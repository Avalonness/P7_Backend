const { Message, Comment } = require('../models/map');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.config');
/**************************************************************/
/************************Commentaires************************/
/*************************************************************/

////// Commenter un message //////
const postComment = async (req, res) => {
   
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const user = decodedToken.userId;

    const postId = req.params.id;
    const content = req.body.content;
    if (content !== null) {
      Comment.create ({
        userId: user,
        MessageId: postId,
        content: req.body.content
      }),
      Message.findOne({ where: { id: postId } })//On sélectionne le post par son id
        .then((post) => {
          post.update({
            comments: post.comments +1,//on ajoute 1 au comments
          }, { id: postId })
          .then(() => res.status(200).json({message: 'Nouveau commentaire envoyé !'}))
          .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(400).json({ error }));
    } else {
      console.error(error);
    }
 
};

const deleteCommentOne = (req, res, next) => {
    const id = req.params.id;
    const idPost = req.params.idPost;

        Comment.destroy({ where: { id: id }}),
        Message.findOne({ where: { id: idPost } })
        .then((post) => {
            post.update({
              comments: post.comments -1,
            }, { id: idPost })
            .then(() => res.status(200).json({  message: 'Commentaire supprimé !' }))
            .catch(error => res.status(400).json({ error }));
          })
        .catch(error => res.status(500).json({ error }));
   
  };

  const getComment = (req, res) => {
    const id = req.params.id

      Comment.findAll({ where : {MessageId : id }})
      .then((comments) => res.status(200).json(comments))
      .catch(error => res.status(500).json({ error }))
    
  }


  module.exports = { postComment, deleteCommentOne, getComment}