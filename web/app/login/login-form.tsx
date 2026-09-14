import { signIn } from "@/auth"

export function LoginForm({
  callbackUrl,
  error,
}: {
  callbackUrl: string
  error?: string
}) {
  async function authenticate(formData: FormData) {
    "use server"
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: callbackUrl || "/members/",
    })
  }

  return (
    <form action={authenticate} className="d-grid gap-3">
      {error ? (
        <div className="alert alert-danger" role="alert">
          Sign-in failed. Check the email and password in <code>.env</code>.
        </div>
      ) : null}
      <div>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="form-control"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue="demo@example.com"
          required
        />
      </div>
      <div>
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          className="form-control"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <button className="btn btn-primary" type="submit">
        Sign in
      </button>
      <p className="small sweb-muted mb-0">
        Default demo user: <code>demo@example.com</code> / <code>changeme-demo</code>
      </p>
    </form>
  )
}
