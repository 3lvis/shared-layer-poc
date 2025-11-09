import Fastify from 'fastify'
import cors from '@fastify/cors'

const PORT = Number(process.env.PORT || 3000)

const app = Fastify({ logger: true })
await app.register(cors, { origin: true })

app.get('/health', async () => ({ ok: true }))

// No domain-specific endpoints in template

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`→ API listening on http://localhost:${PORT}`)
})
