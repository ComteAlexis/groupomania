const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')

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
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/user', userRoute)

module.exports = app
