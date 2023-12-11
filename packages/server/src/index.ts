import { z } from 'zod';
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import cors from 'cors';
import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { ExampleShared } from '@core/example'

const t = initTRPC.create({
  transformer: superjson,
});

const router = t.router({
  "": t.procedure
    .query(() => 'Hello world!'),
});

export type Router = typeof router;

const server = express();
const caller = router.createCaller({})

server.use(cors())
server.use(express.json())

// Expose a http server (if required)
server.get('/hello2', (req, res) => {
  caller['']()
    .then(result => res.json(result))
    .catch(err => res.send(`Failed: ${err instanceof Error ? err.toString() : 'unknown'}`))
})

// If all else fails, use trpc
server.use('/', createExpressMiddleware<Router>({
  router,
}))

const example = new ExampleShared()
console.log({ yeet: example.yeet })

server.listen(8080)
