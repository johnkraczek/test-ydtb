import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect unauthenticated users to login
  // TODO: Add proper session check and redirect logic
  redirect('/dashboard')
}