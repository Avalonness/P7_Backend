const express = require('express');
const router = express.Router();
const {createOne, getAll, getOne, updateOne, deleteOne, postComment} = require('../controllers/controllers.js');
const auth = require('../middleware/auth.js')

router.post('/createOne', auth, createOne)
router.get('/getAll', auth, getAll)
router.get('/:id', auth, getOne)
router.put('/updateOne/:id', auth, updateOne)
router.delete('/deleteOne/:id', auth, deleteOne)
router.post('/:id/postComment', auth, postComment)




module.exports = router;