const mysql = require('mysql')

class Database {
  constructor (config) {
    this.connection = mysql.createConnection(config)
    this.connection.connect()
  }

  query (sqlRequest, option) {
    return new Promise((resolve, reject) => {
      this.connection.query(sqlRequest, option, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    })
  }
}

const connection = new Database({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})

module.exports = connection
