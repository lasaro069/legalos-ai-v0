create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
    new_firma_id uuid;
begin
    -- Create user profile
    insert into public.usuarios (id, email, nombre_completo)
    values (new.id, new.email, new.raw_user_meta_data->>'nombre_completo');
    
    -- Only create a default firma if this is NOT an invite
    if (new.raw_user_meta_data->>'is_invite') is null or (new.raw_user_meta_data->>'is_invite') != 'true' then
        -- Create default firma
        insert into public.firmas (nombre)
        values (coalesce(new.raw_user_meta_data->>'nombre_firma', 'Firma de ' || split_part(new.email, '@', 1)))
        returning id into new_firma_id;
        
        -- Assign user as owner of the new firma
        insert into public.miembros_firma (firma_id, usuario_id, rol, estado)
        values (new_firma_id, new.id, 'propietario', 'activo');
    end if;

    return new;
end;
$$;
