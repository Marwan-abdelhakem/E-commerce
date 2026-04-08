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

await bootStrap(app, express)

app.listen(port, () => {
  console.log(`Server app listening on port ${port}!`)
})

export default app;