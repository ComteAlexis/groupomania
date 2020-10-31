const dotenv = require('dotenv').config()
for (const k in dotenv) {
  process.env[k] = dotenv[k]
}

const http = require('http')
const app = require('./app')
const port = process.env.PORT || '3000'

const server = http.createServer(app)

server.listen(port, () => {
  console.log('Server linstening on port: ', port)
})
