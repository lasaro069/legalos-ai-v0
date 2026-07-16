import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Get the most recently created user
  const { data: users } = await supabase.auth.admin.listUsers()
  
  if (!users.users || users.users.length === 0) {
    console.log("No users found.")
    return
  }
  
  const lastUser = users.users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
  
  console.log(`Setting password for: ${lastUser.email}`)
  
  const { error } = await supabase.auth.admin.updateUserById(lastUser.id, {
    password: 'password123',
    email_confirm: true
  })
  
  if (error) {
    console.error("Error setting password:", error.message)
  } else {
    console.log(`Success! You can now log in with email: ${lastUser.email} and password: password123`)
  }
}

main()
