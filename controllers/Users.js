const db = require('../admin/database')
const bcrypt = require('bcrypt')

exports.connectUser = (req, res, next) => {
  if (!!req.body.email && !!req.body.password) {
    db.query('SELECT * FROM Users WHERE email = ? LIMIT 1', [req.body.email])
      .then(users => {
        if (users.length === 1) {
          bcrypt.compare(req.body.password, users[0].password)
            .then(result => {
              if (result) {
                res.status(200).json({ messsage: 'Gestion de la connection à faire' })
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
  console.log(req.params.id)
  db.query('SELECT id FROM Users WHERE id = ? LIMIT 1', [req.params.id])
    .then(users => {
      if (users.length === 1) {
        console.log('faire la gestion de la vérification des user via cookie')
      } else {
        res.status(400).json({ error: 'L\'utilisateur n\'éxiste pas.' })
      }
    })
    .catch(error => res.status(400).json({ error }))
}

exports.deleteUser = (req, res, next) => {
  res.status(200).json({ message: 'delete user à faire' })
}
