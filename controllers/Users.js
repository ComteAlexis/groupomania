const db = require('../admin/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_KEY)

exports.connectUser = (req, res, next) => {
  if (!!req.body.email && !!req.body.password) {
    db.query('SELECT * FROM Users WHERE email = ? LIMIT 1', [req.body.email])
      .then(users => {
        if (users.length === 1) {
          bcrypt.compare(req.body.password, users[0].password)
            .then(result => {
              if (result) {
                const jsonToken = jwt.sign({ userId: users[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' })
                res.cookie('session', cryptr.encrypt(jsonToken), {
                  maxAge: 1000 * 60 * 60 * 24,
                  httpOnly: true,
                  signed: true
                }).status(200).json({ message: users[0].id })
              } else {
                res.status(400).json({ error: 'Le mot de passe ne correspond pas à celui enregistré.' })
              }
            })
            .catch(error => res.status(500).json({ error }))
        } else {
          res.status(400).json({ error: 'Votre compte n\'éxiste pas.' })
        }
      })
      .catch(error => res.status(500).json({ error }))
  } else {
    res.status(500).json({ error: 'Veuillez entrez des informations correct.' })
  }
}

exports.createUser = (req, res, next) => {
  if (!!req.body.password && !!req.body.passVerif && !!req.body.lastname && !!req.body.firstname && !!req.body.email) {
    if (req.body.password === req.body.passVerif) {
      db.query('SELECT * FROM Users WHERE email = ?', [req.body.email])
        .then(result => {
          if (result.length === 0) {
            bcrypt.hash(req.body.password, 10)
              .then(password => {
                db.query('INSERT INTO Users (lastname, firstname, password, email) VALUES (?, ?, ?, ?)', [req.body.lastname, req.body.firstname, password, req.body.email])
                  .then(result => {
                    res.status(201).json({ message: 'User created with success' })
                  })
                  .catch(error => res.status(500).json({ error }))
              })
              .catch(error => res.status(500).json({ error }))
          } else {
            res.status(500).json({ error: 'Email déjà utilisé.' })
          }
        })
        .catch(error => res.status(500).json({ error }))
    } else {
      res.status(500).json({ error: 'Les mots de passe données ne sont pas identique.' })
    }
  } else {
    res.status(500).json({ error: 'Au moins un des champs n\'a pas été remplie.' })
  }
}

exports.updateUser = (req, res, next) => {
  res.status(500).json({ error: 'Gestion du put à faire.' })
}

exports.deleteUser = (req, res, next) => {
  const decodedToken = jwt.verify(cryptr.decrypt(req.signedCookies.session), process.env.JWT_SECRET)
  const userId = decodedToken.userId
  if (parseInt(req.params.id, 10) === userId) {
    db.query('DELETE FROM Users WHERE id = ?', [userId])
      .then(res.status(200).json({ message: 'Utilisateur supprimé' }))
      .catch(error => res.status(500).json({ error }))
  } else {
    res.status(500).json({ error: 'Vous n\'avez pas les droits sur cet utilisateur' })
  }
}
