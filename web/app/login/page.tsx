import { auth } from "@/auth"
import { LoginForm } from "./login-form"
import { LogoutForm } from "./logout-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const session = await auth()
  const params = await searchParams
  const callbackUrl = params.callbackUrl || "/members/"

  return (
    <main className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h4 mb-3">sweb login</h1>
          <p className="text-secondary">
            Auth.js stores an encrypted JWT in a cookie. There is no database.
          </p>
          {session?.user ? (
            <LogoutForm email={session.user.email ?? session.user.name ?? "signed in"} />
          ) : (
            <LoginForm callbackUrl={callbackUrl} error={params.error} />
          )}
          <p className="mt-4 mb-0">
            <a href="/">Back to the public site</a>
          </p>
        </div>
      </div>
    </main>
  )
}
