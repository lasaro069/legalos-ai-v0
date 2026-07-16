import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function run() {
  console.log('Creating superadmin user...')
  
  // 1. Create user in auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'lasaro069@gmail.com',
    password: 'Josue2415*',
    email_confirm: true,
    user_metadata: {
      nombre_completo: 'Super Administrador'
    }
  })

  if (authError) {
    console.error('Error creating auth user:', authError)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log('User created with ID:', userId)

  // 2. The trigger handle_new_user should have created a profile in public.usuarios
  // We just need to update it to be superadmin.
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ es_superadmin: true })
    .eq('id', userId)

  if (updateError) {
    console.error('Error updating usuario to superadmin:', updateError)
    process.exit(1)
  }

  console.log('Superadmin user created successfully!')
}

run()
