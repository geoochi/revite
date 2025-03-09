import express from 'express'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHandler } from '@universal-middleware/express'
import { createDevMiddleware } from 'vike/server'
import { signup, signin, signout, me } from './src/server/auth.js'
import { vikeHandler } from './src/server/vike-handler.js'

const root = dirname(fileURLToPath(import.meta.url))
const app = express()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(`${root}/dist/client`))
} else {
  const { devMiddleware } = await createDevMiddleware({ root })
  app.use(devMiddleware)
}

app.post('/api/auth/signup', createHandler(signup)())
app.post('/api/auth/signin', createHandler(signin)())
app.post('/api/auth/signout', createHandler(signout)())
app.get('/api/auth/me', createHandler(me)())
app.all('*', createHandler(vikeHandler)())

const port = 3000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
