# sweb

Hugo generates a static [Docsy](https://www.docsy.dev/) documentation site. A small Node service in front of it uses [Auth.js](https://authjs.dev) JWT sessions (no database) so some of those pages still require login.

Hugo, Go, and Node run **inside Podman**. The files you edit stay on the host.

## Quick start

```sh
cp .env.example .env   # already created for local demo
podman compose up
```

Open [http://localhost:3000](http://localhost:3000).

| | |
| --- | --- |
| Public | `/`, `/docs/`, and `/blog/` |
| Protected | `/members/` |
| Login | `/login` |
| Demo user | `demo@example.com` / `changeme-demo` |

Stop with `Ctrl+C` or `podman compose down`.

## How it fits together

1. The `hugo` container watches `site/` and writes HTML into `static-site/`.
2. The `web` container is Next.js + Auth.js. It serves those files and checks a JWT cookie before returning anything under `PROTECTED_PATHS` (default `/members`).
3. Users live in the `AUTH_USERS` environment variable (`email:password` pairs). After login, Auth.js stores an encrypted JWT in an HTTP-only cookie — nothing is written to a database.

Do not publish `static-site/` to a public CDN on its own. The HTML for members pages is still sitting on disk; the Auth.js container is what keeps them from being downloaded anonymously.

Protected Hugo pages stay out of sitemaps (`index: false`). Docsy Lunr search is on in the navbar and docs sidebar; Auth.js filters the search index so `/members` hits only appear when you are signed in.

## Edit locally

| Path | What it is |
| --- | --- |
| `site/content/` | Hugo pages and posts |
| `site/hugo.toml` | Site title, menus, Docsy theme module |
| `web/auth.ts` | Auth.js config (JWT, credentials) |
| `.env` | Secret, users, protected paths |

The Hugo container polls for file changes, so saving a Markdown file on the host rebuilds the static output. Restart `web` after changing `.env`.

## Protect another section

1. Add Hugo content, for example `site/content/staff/_index.md`.
2. Set `PROTECTED_PATHS=/members,/staff` in `.env`.
3. Add `/staff/:path*` to `web/middleware.ts` `config.matcher`.
4. Recreate the web container: `podman compose up -d --force-recreate web`.
