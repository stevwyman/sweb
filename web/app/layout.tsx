import type { ReactNode } from "react"
import "./globals.css"

export const metadata = {
  title: "Sign in · sweb",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
