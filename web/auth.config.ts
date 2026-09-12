import type { NextAuthConfig } from "next-auth"

export function protectedPrefixes(): string[] {
  return (process.env.PROTECTED_PATHS ?? "/members")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

export function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes().some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      if (!isProtectedPath(request.nextUrl.pathname)) {
        return true
      }
      return !!auth
    },
  },
} satisfies NextAuthConfig
