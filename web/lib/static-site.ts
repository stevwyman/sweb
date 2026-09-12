import { promises as fs } from "node:fs"
import path from "node:path"

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ttf": "font/ttf",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
}

export function staticRoot(): string {
  return process.env.STATIC_DIR ?? "/static-site"
}

export async function resolveStaticFile(urlPath: string): Promise<string | null> {
  const root = path.resolve(staticRoot())
  const decoded = decodeURIComponent(urlPath.split("?")[0] ?? "")
  let relative = decoded.replace(/^\/+/, "")
  if (relative === "") {
    relative = "index.html"
  }

  const candidates = [
    relative,
    relative.endsWith("/") ? `${relative}index.html` : `${relative}/index.html`,
    relative.endsWith(".html") ? relative : `${relative}.html`,
  ]

  for (const candidate of candidates) {
    const fullPath = path.resolve(root, candidate)
    if (fullPath !== root && !fullPath.startsWith(`${root}${path.sep}`)) {
      return null
    }
    try {
      const stat = await fs.stat(fullPath)
      if (stat.isFile()) {
        return fullPath
      }
    } catch {
      // try the next candidate
    }
  }

  return null
}

export async function readStaticFile(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath)
}

export function contentTypeFor(filePath: string): string {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream"
}
