const { createServer } = require("node:http")
const path = require("node:path")
const { parse } = require("node:url")
const next = require("next")

// Plesk layout: web/ sits next to static-site/
if (!process.env.STATIC_DIR) {
  process.env.STATIC_DIR = path.resolve(__dirname, "..", "static-site")
}

const dev = process.env.NODE_ENV !== "production"
const hostname = "0.0.0.0"
const port = Number.parseInt(process.env.PORT || "3000", 10)

const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((request, response) => {
    const parsedUrl = parse(request.url ?? "/", true)
    handle(request, response, parsedUrl)
  }).listen(port, hostname, () => {
    console.log(`sweb listening on ${hostname}:${port}`)
    console.log(`STATIC_DIR=${process.env.STATIC_DIR}`)
  })
})
