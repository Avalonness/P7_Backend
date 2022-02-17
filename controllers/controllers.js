const { Message, Comment } = require('../models/map');
const messagesValidation = require('../config/validation/messagesValidation');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');

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

    if (error) return res.status(401).json(error.details[0].message)
    Message.create({
        UserId: getUserId,
        youtube: (req.body.youtube ? `${req.body.youtube}` : null),
        contentImg: (req.body.contentImg ? `${req.body.contentImg}` : null),
        contentText: req.body.contentText
    })
    .then(() => res.status(201).json({msg : "Element créer"}))
    .catch(error => res.status(500).json(error))
}


////// Trouver tous les messages //////
const getAll = (req, res) =>{
    Message.findAll({
        attributes: {exclude : ["updatedAt"]}
    })
    .then(messages =>
        res.status(200).json(messages))
    .catch(error => res.status(500).json(error))

}


////// Trouver un message //////
const getOne = (req, res) =>{
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
/************************Commentaires************************/
/*************************************************************/

////// Commenter un message //////
const postComment = async (req, res) => {
   
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, config.secret);
        const user = decodedToken.userId;
		let content = req.body.content;
		const newCom = await Comment.create({
            userId: user,
            postId: req.params.id,
            content: content
		});

		if (newCom) {
			res.status(201).json({ message: "Votre commentaire a été publié", newCom });
		} else {
			throw new Error("Une erreur est survenue.");
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};


/**************************************************************/
/************************Likes************************/
/*************************************************************/


module.exports = { createOne, getAll, getOne, updateOne, deleteOne, postComment }