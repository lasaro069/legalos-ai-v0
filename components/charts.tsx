export function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return <div className="flex h-32 items-end gap-2">{values.map((value, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t bg-legal-blue" style={{ height: `${(value / max) * 100}%` }} /><span className="text-[10px] text-slate-400">{["Ene", "Feb", "Mar", "Abr", "May", "Jun"][index]}</span></div>)}</div>;
}

export function Donut() {
  return <div className="mx-auto h-36 w-36 rounded-full bg-[conic-gradient(#2563eb_0_40%,#14b8a6_40%_65%,#f59e0b_65%_80%,#ef4444_80%_90%,#64748b_90%_100%)] p-8"><div className="grid h-full w-full place-items-center rounded-full bg-white text-center text-xs font-semibold text-slate-600">Casos</div></div>;
}
