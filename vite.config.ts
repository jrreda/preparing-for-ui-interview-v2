import { fileURLToPath, URL } from 'node:url'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { apiMiddleware } from './server.ts'

const alias = (specifier: string) => fileURLToPath(new URL(specifier, import.meta.url))

function apiPlugin(): Plugin {
  return {
    name: 'course-api',
    configureServer(server) {
      server.middlewares.use(apiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware)
    },
  }
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  resolve: {
    alias: {
      '@course/styles': alias('./src/utilities/styles.module.css'),
      '@course/cx': alias('./src/utilities/utility.ts'),
      '@course/types': alias('./src/utilities/types.ts'),
      '@course/utils': alias('./src/utilities/utils.ts'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
