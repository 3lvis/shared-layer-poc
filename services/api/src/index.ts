import Fastify from 'fastify'
import cors from '@fastify/cors'
import { catalog, calcTotal, type CartLine } from '@axis/shared'

const PORT = Number(process.env.PORT || 3000)

const app = Fastify({ logger: true })
await app.register(cors, { origin: true })

app.get('/health', async () => ({ ok: true }))

app.get('/products', async () => {
  return { products: Object.values(catalog) }
})

app.post('/cart/total', async (req, reply) => {
  try {
    const body = (req.body ?? []) as CartLine[]
    const total = calcTotal(body)
    return { totalNOK: total }
  } catch (e) {
    reply.code(400)
    return { error: 'Invalid cart payload' }
  }
})

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`→ API listening on http://localhost:${PORT}`)
})

