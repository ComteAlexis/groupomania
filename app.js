const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const userRoute = require('./routes/Users')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/api/user', userRoute)

module.exports = app
