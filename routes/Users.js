const express = require('express')
const router = express.Router()
const Auth = require('../middlewares/Auth')

const userCtrl = require('../controllers/Users')

router.post('/login', userCtrl.connectUser)
router.post('/signup', userCtrl.createUser)
router.put('/:id', Auth, userCtrl.updateUser)
router.delete('/:id', Auth, userCtrl.deleteUser)

module.exports = router
