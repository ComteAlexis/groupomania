const jwt = require('jsonwebtoken')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_KEY)

module.exports = (req, res, next) => {
  if (req.signedCookies.session !== null && req.signedCookies.session !== undefined) {
    try {
      jwt.verify(cryptr.decrypt(req.signedCookies.session), process.env.JWT_SECRET)
      next()
    } catch (err) {
      res.status(500).json({ error: 'Veuillez vous reconnectez' })
    }
  } else {
    res.status(500).json({ error: 'Merci de vous connecter' })
  }
}
