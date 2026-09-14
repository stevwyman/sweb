import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { isProtectedPath } from "@/auth.config"
import { filterSearchIndex, isOfflineSearchIndexPath } from "@/lib/search-index"
import { contentTypeFor, readStaticFile, resolveStaticFile } from "@/lib/static-site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ slug?: string[] }>
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params
  const pathname = `/${(slug ?? []).join("/")}`
  const session = await auth()

  if (isProtectedPath(pathname) && !session?.user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname.endsWith("/") ? pathname : `${pathname}/`)
    return NextResponse.redirect(loginUrl)
  }

  const filePath = await resolveStaticFile(pathname)
  if (!filePath) {
    return new NextResponse("Not found", { status: 404 })
  }

  const body = await readStaticFile(filePath)

  if (isOfflineSearchIndexPath(pathname, filePath)) {
    let docs: unknown
    try {
      docs = JSON.parse(body.toString("utf8"))
    } catch {
      return new NextResponse("Invalid search index", { status: 500 })
    }

    const filtered = filterSearchIndex(docs, Boolean(session?.user))
    return NextResponse.json(filtered, {
      headers: {
        "cache-control": "private, no-store",
        vary: "Cookie",
      },
    })
  }

  const headers = new Headers()
  headers.set("content-type", contentTypeFor(filePath))
  headers.set(
    "cache-control",
    isProtectedPath(pathname) ? "private, no-store" : "public, max-age=60"
  )

  return new NextResponse(new Uint8Array(body), { status: 200, headers })
}
