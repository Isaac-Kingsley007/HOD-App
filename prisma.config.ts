import path from 'node:path'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: env('DIRECT_URL'),
  },
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
})
