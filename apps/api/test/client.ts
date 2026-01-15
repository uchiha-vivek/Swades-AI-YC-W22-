import request from 'supertest'
import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { app } from '../src/app'

function nodeRequestToWebRequest(req: any) {
  const url = `http://localhost${req.url}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.append(key, value)
    }
  }

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : Readable.toWeb(req)

  return new Request(url, {
    method: req.method,
    headers,
    body,
  })
}

const server = createServer(async (req, res) => {
  const webReq = nodeRequestToWebRequest(req)
  const response = await app.fetch(webReq)

  res.statusCode = response.status

  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (response.body) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value))
    }
  }

  res.end()
})

export const api = request(server)
