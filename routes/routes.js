const express = require('express');
const router = express.Router();
const {createOne, getAll, getOne, updateOne, deleteOne, getUser, getUserOne} = require('../controllers/controllers.js');
const {postComment, deleteCommentOne, getComment} = require('../controllers/comments.js');
const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js')


router.post('/createOne', auth, multer, createOne)
router.get('/', auth, getAll)
router.get('/getOne/:id', auth, getOne)
router.put('/updateOne/:id', auth, updateOne)
router.delete('/deleteOne/:id', auth, deleteOne)

router.post('/:id/postComment', auth, postComment)
router.delete('/:idPost/commentDelete/:id', auth, deleteCommentOne)
router.get('/:id/comment', auth, getComment)

router.get('/getUsers', auth, getUser);
router.get('/getUserOne', auth, getUserOne);







module.exports = router;