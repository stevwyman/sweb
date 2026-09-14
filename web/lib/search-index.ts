import path from "node:path"
import { isProtectedPath } from "@/auth.config"

const SEARCH_INDEX_FILE = /^offline-search-index(\.[a-z0-9]+)?\.json$/i

export function isOfflineSearchIndexPath(pathname: string, filePath?: string): boolean {
  const candidates = [pathname, filePath ? path.basename(filePath) : ""]
  return candidates.some((value) => SEARCH_INDEX_FILE.test(path.basename(value)))
}

function pathnameFromRef(ref: string): string {
  try {
    if (/^https?:\/\//i.test(ref)) {
      return new URL(ref).pathname
    }
  } catch {
    // Fall through to the raw ref.
  }
  return ref.startsWith("/") ? ref : `/${ref}`
}

export function filterSearchIndex(docs: unknown, signedIn: boolean): unknown {
  if (!Array.isArray(docs) || signedIn) {
    return docs
  }

  return docs.filter((doc) => {
    if (!doc || typeof doc !== "object" || !("ref" in doc)) {
      return true
    }
    const ref = String((doc as { ref?: unknown }).ref ?? "")
    return !isProtectedPath(pathnameFromRef(ref))
  })
}
