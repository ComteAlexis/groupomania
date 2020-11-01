const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/Users')

router.post('/login', userCtrl.connectUser)
router.post('/signup', userCtrl.createUser)
router.put('/:id', userCtrl.updateUser)
router.delete('/:id', userCtrl.deleteUser)

module.exports = router
