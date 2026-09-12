import { signOut } from "@/auth"

export function LogoutForm({ email }: { email: string }) {
  async function logout() {
    "use server"
    await signOut({ redirectTo: "/" })
  }

  return (
    <form action={logout} className="d-grid gap-3">
      <p className="mb-0">
        Signed in as <strong>{email}</strong>
      </p>
      <button className="btn btn-outline-secondary" type="submit">
        Sign out
      </button>
    </form>
  )
}
