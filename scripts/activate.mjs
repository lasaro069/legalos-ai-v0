import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  const { data: user } = await supabase.from('usuarios').select('*').eq('email', 'abogado@invitado').single()
  
  if (user) {
    await supabase.from('miembros_firma').update({ estado: 'activo' }).eq('usuario_id', user.id)
    console.log("Updated to activo")
  }
}
main()
