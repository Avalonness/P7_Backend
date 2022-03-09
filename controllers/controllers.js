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
    const {body} = req
    const {error} = messagesValidation(body)
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.secret);
    const getUserId = decodedToken.userId;
    const image = (req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null)

    // if (error) return res.status(401).json(error.details[0].message)
    
       Message.create({
          userId: getUserId,
          youtube: (req.body.youtube ? `${req.body.youtube}` : null),
          contentImg : image,
          contentText: req.body.contentText
          })
          .then(() => res.status(201).json({msg : "Element créer"}))
          .catch(error => res.status(500).json(error))
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
  


module.exports = { createOne, getAll, getOne, updateOne, deleteOne, getUser, getUserOne}