create policy "Contactos: Los miembros pueden eliminar contactos de su firma"
on public.contactos for delete
using (
  firma_id in (
    select firma_id from public.miembros_firma where usuario_id = auth.uid()
  )
);
