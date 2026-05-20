import { defineConfig } from '@prisma/client'

export default defineConfig({
  // Для SQLite
  adapter: 'sqlite',
  connection: {
    url: 'file:./dev.db'
  }
  
  // ИЛИ для других баз данных:
  // adapter: 'postgresql',
  // connection: {
  //   url: process.env.DATABASE_URL
  // }
})