create or replace function public.get_firmas_metrics()
returns table (
    firma_id uuid,
    nombre_firma text,
    ciudad text,
    created_at timestamp with time zone,
    usuarios_count bigint,
    clientes_count bigint,
    expedientes_count bigint,
    documentos_count bigint,
    promedio_documentos_por_caso numeric
)
language sql
security definer
as $$
    select 
        f.id as firma_id,
        f.nombre as nombre_firma,
        f.ciudad,
        f.created_at,
        (select count(*) from public.miembros_firma m where m.firma_id = f.id) as usuarios_count,
        (select count(*) from public.contactos c where c.firma_id = f.id) as clientes_count,
        (select count(*) from public.expedientes e where e.firma_id = f.id) as expedientes_count,
        (
            select count(a.id) 
            from public.actuaciones a 
            join public.expedientes e on e.id = a.expediente_id 
            where e.firma_id = f.id and a.documento_url is not null
        ) as documentos_count,
        case 
            when (select count(*) from public.expedientes e where e.firma_id = f.id) > 0 
            then round(
                (select count(a.id) 
                 from public.actuaciones a 
                 join public.expedientes e on e.id = a.expediente_id 
                 where e.firma_id = f.id and a.documento_url is not null)::numeric 
                 / (select count(*) from public.expedientes e where e.firma_id = f.id)::numeric, 
                1
            )
            else 0 
        end as promedio_documentos_por_caso
    from public.firmas f
    order by f.created_at desc;
$$;
