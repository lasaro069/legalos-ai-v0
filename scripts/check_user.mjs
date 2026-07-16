import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  const { data: users } = await supabase.auth.admin.listUsers()
  
  const user = users.users.find(u => u.email === 'abogado@invitado')
  console.log("abogado@invitado metadata:", user?.user_metadata)
  console.log("abogado@invitado raw_app_meta_data:", user?.app_metadata)
  
  const { data: members } = await supabase
    .from('miembros_firma')
    .select('*')
    .eq('usuario_id', user.id)
    
  console.log("Miembros firma:", members)
  
  const { data: firms } = await supabase
    .from('firmas')
    .select('*')
  console.log("All firms:", firms)
}

main()
