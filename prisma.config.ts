import path from 'node:path'
import { defineConfig } from '@prisma/config'
import { config } from 'dotenv'

// Load .env file
config()

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL!,
  },
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
})
