import { timingSafeEqual } from "node:crypto"

export type LocalUser = {
  id: string
  name: string
  email: string
  password: string
}

export function getLocalUsers(): LocalUser[] {
  return (process.env.AUTH_USERS ?? "")
    .split(",")
    .map((entry, index) => {
      const trimmed = entry.trim()
      if (!trimmed) {
        return null
      }
      const colon = trimmed.indexOf(":")
      if (colon <= 0) {
        return null
      }
      const email = trimmed.slice(0, colon).trim().toLowerCase()
      const password = trimmed.slice(colon + 1)
      if (!email || !password) {
        return null
      }
      return {
        id: String(index + 1),
        email,
        name: email.split("@")[0] ?? email,
        password,
      }
    })
    .filter((user): user is LocalUser => user !== null)
}

export function findUser(
  email: string,
  password: string
): Omit<LocalUser, "password"> | null {
  const needle = email.trim().toLowerCase()
  const user = getLocalUsers().find((candidate) => candidate.email === needle)
  if (!user || !secureEqual(user.password, password)) {
    return null
  }
  return { id: user.id, email: user.email, name: user.name }
}

function secureEqual(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) {
    return false
  }
  return timingSafeEqual(a, b)
}
