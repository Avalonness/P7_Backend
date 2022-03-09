const express = require('express');
const router = express.Router();
const {signup, login, deleteUser, editUser} = require('../controllers/users.js');
const multer = require('../middleware/multer-config.js')

router.post('/signup', signup);
router.post('/login', login);
router.delete('/deleteUser/:id', deleteUser)
router.put('/editUser/:id', multer, editUser)

module.exports = router;