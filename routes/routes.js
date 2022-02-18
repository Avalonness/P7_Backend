const express = require('express');
const router = express.Router();
const {createOne, getAll, getOne, updateOne, deleteOne, likeOne, getLike} = require('../controllers/controllers.js');
const {postComment, deleteCommentOne} = require('../controllers/comments.js');
const auth = require('../middleware/auth.js')

router.post('/createOne', auth, createOne)
router.get('/', auth, getAll)
router.get('/:id', auth, getOne)
router.put('/updateOne/:id', auth, updateOne)
router.delete('/deleteOne/:id', auth, deleteOne)

router.post('/:id/postComment', auth, postComment)
router.delete('/:idPost/commentDelete/:id', auth, deleteCommentOne)

router.post('/:id/likeOne', auth, likeOne);
router.get('/:id/getLike', auth, getLike);




module.exports = router;