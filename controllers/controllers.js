const { Message, Like, User } = require('../models/map');
const messagesValidation = require('../config/validation/messagesValidation');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/auth.config');


/**************************************************************/
/************************Messages************************/
/*************************************************************/

////// Poster un message //////
const createOne = (req, res) =>{
  console.log(req.body)
    const {body} = req
    const {error} = messagesValidation(body)
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const getUserId = decodedToken.userId;

  //   if (error) return res.status(401).json(error.details[0].message)
  //   if (req.body.youtube !== "null") {
  //      Message.create({
  //         userId: getUserId,
  //         youtube: (req.body.youtube ? `${req.body.youtube}` : null),
  //         contentText: req.body.contentText
  //         })
  //         .then(() => res.status(201).json({msg : "Element youtube créer"}))
  //         .catch(error => res.status(500).json(error))
  //   }

  //   if (req.body.youtube === "null" && req.body.contentText) {
  //     Message.create({
  //        userId: getUserId,
  //        contentText: req.body.contentText
  //        })
  //        .then(() => res.status(201).json({msg : "Element basique créer"}))
  //        .catch(error => res.status(500).json(error))
  //  }

  //  if (req.file !== "null") {
  //   Message.create({
  //      userId: getUserId,
  //      contentImg: req.file,
  //      contentText: req.body.contentText
  //      })
  //      .then(() => res.status(201).json({msg : "Element media créer"}))
  //      .catch(error => res.status(500).json(error))
//  }

console.log(body)
}


////// Trouver tous les messages //////
const getAll = (req, res, next) =>{
    Message.findAll({
        attributes: {exclude : ["updatedAt"]}
    })
    .then(messages =>
        res.status(200).json(messages))
    .catch(error => res.status(500).json(error))

}


////// Trouver un message //////
const getOne = (req, res, next) =>{
    const {id} = req.params
    Message.findByPk(id, {
        attributes: {exclude : ["updatedAt"]}
    } )
    .then(message => {
        if(!message) return res.status(404).json({msg: "Message inexistant"})
        res.status(200).json(message)
    })
    .catch(error => res.status(500).json(error))

}


////// Modifier un message //////
const updateOne = (req, res) =>{
    const {id} = req.params

    Message.findByPk(id)
    .then(message => {
        if(!message) return res.status(404).json({msg: "Message inexistant"})

        if (message.image !== null){
          const fileName = message.image.split('/images')[1]
          fs.unlink(`images/${fileName}`)
          }

        message.youtube = (req.body.youtube ? `${req.body.youtube}` : null)
        message.contentImg = (req.body.contentImg ? `${req.body.contentImg}` : null),
        message.contentText = req.body.contentText

        message.save()
        .then( () => res.status(201).json({msg: "Message modifié !"}))
        .catch(error => res.status(500).json(error))
    })
    .catch(error => res.status(500).json(error))

}


////// Supprimer un message //////
const deleteOne = (req, res) =>{
    const {id} = req.params
    Message.destroy({where : {id : id}})
    .then( result => {
        if(result == 0) return res.status(404).json({msg: "Message inexistant"})
        res.status(200).json({msg: "Message effacée !"})
    })
    .catch(error => res.status(500).json(error))
}


/**************************************************************/
/************************Likes************************/
/*************************************************************/

const likeOne = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const user = decodedToken.userId;

    const postId = req.params.id;
    const like = req.body.likes;

    if (like === 1){
      Like.findOrCreate({ where : { postId: postId, userId: user } })
      .then (([like, isNotPresent])=> {
        if(isNotPresent) {
          Message.findOne({ where: { id: postId } })//On sélectionne le post par son id
            .then((post) => {
              post.update({
                likes: post.likes +1,//on ajoute 1 au likes
              }, { id: req.params.id })
              .then(() => res.status(200).json({message: 'Vote positif !'}))
              .catch(error => res.status(400).json({error}))
            })
        } else {
          res.status(400).json({message:"Déjà liké !"})
        }
      })
      .catch(error => res.status(400).json({error}))
    }else {
      Message.findOne({ where: { id: postId } })//On sélectionne le post par son id
      .then((post) => {
        Like.findOne ({ where: { userId: user, postId: postId } })
        .then ((likeRes)=>{
          if(likeRes !== null) {
            Like.destroy ( { where: { userId: user, postId:postId } }),
              post.update({
                likes: post.likes - 1,//on retire 1 à likes
              }, { id: req.params.id })
                .then(() => res.status(200).json({message: 'Like réinitialisé !'}))
                .catch(error => res.status(400).json({error}))
          } else {
            throw {message: 'Vous avez déjà réinitialisé votre Like !'};
          }
        })
        .catch(error => res.status(400).json({ error }));
  
      })
      .catch(error => res.status(400).json({ error }));
    }
  };


const getLike = (req, res, next) => {
    Like.findAll({ where: { postId: req.params.id } })
    .then(likes => res.status(200).json(likes))
    .catch(error => res.status(404).json({ error }));
  };

const getUser = (req, res) => {
  User.findAll({
    attributes: {exclude : ["password"]}
})
.then(users =>
    res.status(200).json(users))
.catch(error => res.status(500).json(error))
}

const getUserOne = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const user = decodedToken.userId;

  User.findOne({where : {id : user}}, {
        attributes: {exclude : ["password"]}
    } )
.then(users =>
    res.status(200).json(users))
.catch(error => res.status(500).json(error))
}
  


module.exports = { createOne, getAll, getOne, updateOne, deleteOne, likeOne, getLike, getUser, getUserOne}