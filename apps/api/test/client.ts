import request from 'supertest'
import { createServer } from 'node:http'
import { app } from '../src/app'

function readBody(req: any): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      resolve(undefined)
      return
    }

    let data = ''
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString()
    })
    req.on('end', () => {
      resolve(data || undefined)
    })
  })
}

function nodeToWebRequest(req: any, body?: string) {
  const url = `http://localhost${req.url}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') {
      headers.set(key, value)
    }
  }

  return new Request(url, {
    method: req.method,
    headers,
    body,
  })
}

const server = createServer(async (req, res) => {
  const body = await readBody(req)
  const webReq = nodeToWebRequest(req, body)

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
