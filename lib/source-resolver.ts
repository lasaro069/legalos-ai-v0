import { CaseDeadline, Hearing, LegalCase, LegalDocument, SourceType, Task } from "@/types";

type SourceLike = Partial<Pick<CaseDeadline, "caseId" | "sourceType" | "sourceId">> &
  Partial<Pick<Task, "source">> &
  Partial<Pick<LegalDocument, "association" | "clientId" | "proceedingId" | "hearingId">>;

type SourceCollections = {
  cases: LegalCase[];
  documents?: LegalDocument[];
  hearings?: Hearing[];
  deadlines?: CaseDeadline[];
};

export type ResolvedSource = {
  type: SourceType | "Sin origen";
  label: string;
  detail: string;
  href?: string;
  caseHref?: string;
};

export function resolveSource(item: SourceLike, collections: SourceCollections): ResolvedSource {
  const sourceType = inferSourceType(item);
  const legalCase = findCase(item.caseId, collections.cases);
  const caseHref = legalCase ? `/cases/${legalCase.id}` : undefined;
  const sourceId = item.sourceId;

  if (!sourceType) {
    return {
      type: "Sin origen",
      label: legalCase?.name ?? "Origen no definido",
      detail: legalCase ? "Conectado al expediente base." : "No hay trazabilidad registrada.",
      href: caseHref,
      caseHref
    };
  }

  if (sourceType === "Documento") {
    const document = collections.documents?.find((candidate) => candidate.id === sourceId);
    return {
      type: sourceType,
      label: document?.title ?? sourceFallback("Documento", sourceId),
      detail: document ? `${document.type} - ${document.date}` : "Documento de origen no encontrado en el prototipo.",
      href: document ? `/documents/${document.id}` : undefined,
      caseHref: document?.caseId ? `/cases/${document.caseId}` : caseHref
    };
  }

  if (sourceType === "Audiencia") {
    const hearing = collections.hearings?.find((candidate) => candidate.id === sourceId);
    return {
      type: sourceType,
      label: hearing ? `${hearing.type} - ${hearing.date}` : sourceFallback("Audiencia", sourceId),
      detail: hearing ? `${hearing.court} - ${hearing.status}` : "Audiencia de origen no encontrada en el prototipo.",
      href: hearing ? `/hearings/${hearing.id}` : undefined,
      caseHref: hearing?.caseId ? `/cases/${hearing.caseId}` : caseHref
    };
  }

  if (sourceType === "Actuacion") {
    const match = findProceeding(sourceId, collections.cases);
    return {
      type: sourceType,
      label: match?.proceeding.title ?? sourceFallback("Actuacion", sourceId),
      detail: match ? `${match.proceeding.type} - ${match.proceeding.date}` : "Actuacion conectada, pendiente de resolver en el expediente.",
      href: match ? `/cases/${match.legalCase.id}` : caseHref,
      caseHref: match ? `/cases/${match.legalCase.id}` : caseHref
    };
  }

  if (sourceType === "Termino") {
    const deadline = collections.deadlines?.find((candidate) => candidate.id === sourceId);
    return {
      type: sourceType,
      label: deadline?.title ?? sourceFallback("Termino", sourceId),
      detail: deadline ? `${deadline.type} - ${deadline.date}` : "Termino de origen no encontrado en el prototipo.",
      href: "/deadlines",
      caseHref: deadline?.caseId ? `/cases/${deadline.caseId}` : caseHref
    };
  }

  if (sourceType === "Expediente") {
    const sourceCase = findCase(sourceId ?? item.caseId, collections.cases);
    return {
      type: sourceType,
      label: sourceCase?.name ?? legalCase?.name ?? sourceFallback("Expediente", sourceId),
      detail: sourceCase ? `${sourceCase.legalArea} - ${sourceCase.filingNumber}` : "Expediente base.",
      href: sourceCase ? `/cases/${sourceCase.id}` : caseHref,
      caseHref: sourceCase ? `/cases/${sourceCase.id}` : caseHref
    };
  }

  if (sourceType === "Cliente") {
    return {
      type: sourceType,
      label: "Cliente vinculado",
      detail: "Origen conectado a la ficha del cliente.",
      caseHref
    };
  }

  if (sourceType === "Sugerencia IA") {
    return {
      type: sourceType,
      label: "Sugerencia IA pendiente de validacion",
      detail: "Requiere revision del abogado antes de actuar.",
      caseHref
    };
  }

  return {
    type: sourceType,
    label: "Registro manual",
    detail: "Creado manualmente por el despacho.",
    caseHref
  };
}

function inferSourceType(item: SourceLike): SourceType | undefined {
  if (item.sourceType) return item.sourceType;
  if (item.source) return item.source as SourceType;
  if (item.proceedingId) return "Actuacion";
  if (item.hearingId) return "Audiencia";
  if (item.clientId) return "Cliente";
  if (item.association === "Actuacion") return "Actuacion";
  if (item.association === "Cliente") return "Cliente";
  if (item.caseId) return "Expediente";
  return undefined;
}

function findCase(id: string | undefined, cases: LegalCase[]) {
  if (!id) return undefined;
  return cases.find((legalCase) => legalCase.id === id);
}

function findProceeding(id: string | undefined, cases: LegalCase[]) {
  if (!id) return undefined;
  for (const legalCase of cases) {
    const proceeding = legalCase.proceedings?.find((candidate) => candidate.id === id);
    if (proceeding) return { legalCase, proceeding };
  }
  return undefined;
}

function sourceFallback(type: SourceType, sourceId: string | undefined) {
  return sourceId ? `${type} ${sourceId}` : `${type} sin identificador`;
}
