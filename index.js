import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load appropriate .env file based on environment
const envFile = process.env.NODE_ENV === 'production' 
  ? 'src/config/.env.production' 
  : 'src/config/.env.development'

dotenv.config({ path: path.join(__dirname, envFile) })

import express from "express"
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.config.js'
import bootStrap from "./src/app.controller.js"

const app = express()
const port = process.env.PORT || 3000

// Swagger Documentation - must be before bootStrap
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Commerce API Docs'
}))

await bootStrap(app, express)

app.listen(port, () => {
  console.log(`Server app listening on port ${port}!`)
  console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`)
})

export default app;