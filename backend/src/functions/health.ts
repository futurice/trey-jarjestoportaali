import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"

export async function health(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`)

  const name = request.query.get("name") || (await request.text()) || "world"

  context.info("OK")

  return { body: `Hello, ${name}!` }
}

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: health,
})
