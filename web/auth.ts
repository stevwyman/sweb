import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "@/auth.config"
import { findUser } from "@/lib/users"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials.email ?? "")
        const password = String(credentials.password ?? "")
        const user = findUser(email, password)
        if (!user) {
          return null
        }
        return user
      },
    }),
  ],
})
