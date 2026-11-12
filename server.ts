import { readFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'

const root = process.cwd()

const folderMap: Record<string, string> = {
  toast: 'toast',
  checkbox: 'nested-checkboxes',
  accordion: 'accordion',
  tabs: 'tabs',
  tooltip: 'tooltip',
  table: 'table',
  markdown: 'markdown',
  squareGame: 'square-game',
  progressBar: 'progress-bar',
  uploadComponent: 'upload-component',
  infiniteCanvas: 'infinite-canvas',
  gallery: 'gallery',
  gptChat: 'gpt-chat',
  heatmap: 'heatmap',
  heatmapCanvas: 'heatmap-canvas',
  redditThread: 'reddit-thread',
  starRating: 'star-rating',
  videoPlayer: 'video-player',
}

function applyCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-File-Name')
}

function send(
  res: ServerResponse,
  status: number,
  body: string,
  contentType = 'text/plain; charset=utf-8',
) {
  applyCors(res)
  res.statusCode = status
  res.setHeader('Content-Type', contentType)
  res.end(body)
}

async function handleUpload(req: IncomingMessage, res: ServerResponse) {
  const filename = req.headers['x-file-name']
  if (!filename || Array.isArray(filename)) {
    send(res, 400, 'Missing X-File-Name header')
    return
  }

  console.log(`Receiving stream for ${filename}`)

  try {
    for await (const _chunk of req) {
      // Drain the upload body. The exercise server does not persist the file.
    }
    send(res, 200, 'Upload success')
  } catch {
    console.log(`Upload interrupted for ${filename}`)
    if (!res.writableEnded) send(res, 200, 'Interrupted')
  }
}

async function streamMarkdown(res: ServerResponse, delay: number) {
  let content: string
  try {
    content = await readFile(path.join(root, 'public/sample-response.md'), 'utf8')
  } catch {
    send(res, 404, 'File not found')
    return
  }

  applyCors(res)
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')

  let position = 0
  const chunkSize = 100
  let timer: ReturnType<typeof setTimeout> | undefined
  let closed = false

  const stop = () => {
    closed = true
    if (timer) clearTimeout(timer)
  }
  res.on('close', stop)

  const sendChunk = () => {
    if (closed) return
    if (position >= content.length) {
      res.end()
      return
    }
    res.write(content.slice(position, position + chunkSize))
    position += chunkSize
    timer = setTimeout(sendChunk, delay)
  }

  sendChunk()
}

async function handleProblem(res: ServerResponse, problemId: string) {
  const folder = folderMap[problemId]
  if (!folder) {
    send(res, 404, 'Problem not found')
    return
  }

  try {
    const content = await readFile(path.join(root, 'src/done', folder, 'problem.md'), 'utf8')
    send(res, 200, content)
  } catch {
    send(res, 404, 'Problem file not found')
  }
}

async function handleTypeahead(req: IncomingMessage, res: ServerResponse, url: URL) {
  const query = url.searchParams.get('query') || ''
  const limit = parseInt(url.searchParams.get('limit') || '10', 10)

  await new Promise((resolve) => setTimeout(resolve, 2000))
  if (res.writableEnded || req.destroyed) return

  try {
    const text = await readFile(path.join(root, 'src/problems/45-typeahead/data.json'), 'utf8')
    const data = JSON.parse(text) as Array<{ query: string; id: string; value: string }>
    const filtered = data
      .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit)

    send(res, 200, JSON.stringify(filtered), 'application/json')
  } catch (error) {
    console.error(error)
    if (!res.writableEnded) send(res, 500, 'Error processing request')
  }
}

async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (req.method === 'OPTIONS') {
    applyCors(res)
    res.statusCode = 204
    res.end()
    return
  }

  if (url.pathname === '/api/upload' && req.method === 'POST') {
    await handleUpload(req, res)
    return
  }

  if (url.pathname === '/api/stream-markdown' && req.method === 'GET') {
    const delay = parseInt(url.searchParams.get('delay') || '300', 10)
    await streamMarkdown(res, delay)
    return
  }

  if (url.pathname.startsWith('/api/problem/') && req.method === 'GET') {
    const problemId = decodeURIComponent(url.pathname.slice('/api/problem/'.length))
    await handleProblem(res, problemId)
    return
  }

  if (url.pathname === '/api/typeahead' && req.method === 'GET') {
    await handleTypeahead(req, res, url)
    return
  }

  send(res, 404, 'Not Found')
}

export function apiMiddleware(req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
  if (!url.pathname.startsWith('/api/')) {
    next()
    return
  }

  void handleApi(req, res, url).catch((error) => {
    console.error(error)
    if (!res.writableEnded) send(res, 500, 'Error processing request')
  })
}
