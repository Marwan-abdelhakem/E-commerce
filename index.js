import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.development only in local development
if (process.env.NODE_ENV !== 'production') {
  const envFile = path.join(__dirname, 'src/config/.env.development')
  dotenv.config({ path: envFile })
}

import express from "express"
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.config.js'
import bootStrap from "./src/app.controller.js"

const app = express()
const port = process.env.PORT || 3000

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Docs'
}))

// Bootstrap with error handling
try {
  await bootStrap(app, express)
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${port}`)
    console.log(`📚 API Docs: http://localhost:${port}/api-docs`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
} catch (error) {
  console.error('❌ Failed to start server:', error.message)
  process.exit(1)
}

export default app;