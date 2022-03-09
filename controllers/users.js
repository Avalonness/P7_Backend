const bcrypt = require('bcrypt');
const {User} = require('../models/map');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const fs = require('fs');

const passwordValidator = require('password-validator');
const schema = new passwordValidator(); 
schema
  .is().min(8) //min 8 caractères
  .has().not().spaces() // pas d'espace
  .has().digits(1) // min 1 chiffre
  .has().uppercase(1) // min 1 majuscule
  .has().lowercase(1) // min 1 minuscule

const signup = (req, res, next) => {
    if (!schema.validate(req.body.password)) { 
      res.status(401).json({
        message: 'Mot de passe peu sécurisé !'
      });
      return false;
    }
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        User.create({
            username: req.body.username,
            email: req.body.email, 
            password: hash 
          })
          .then(() => res.status(201).json({
            message: 'Utilisateur créé !'
          }))
          .catch(error => res.status(400).json({
            error: 'Ces identifiants sont déjà utilisés'
          }));
      })
      .catch(error => res.status(500).json({
        error
      }));
  };

  //Login
  const login = (req, res) =>{
    const {body} = req

    User.findOne({ where: { email: req.body.email } })
    .then(user => {
        //  res.status(200).json(user)
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
          var token = jwt.sign({ userId: user.id, levelAccount: user.levelAccount}, config.secret, {
            expiresIn: 86400 // 24 heures
          });         
          res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: token
          });
          
    })
    .catch(error => res.status(500).json(error))
}

////// Supprimer un user //////
const deleteUser = (req, res) =>{
  const id = req.params.id
  User.findOne({where: {id: id}})
  .then(user => {
    if (user.profilImg !== null) {
      const fileName = user.profilImg.split('/images/avatars/')[1]
      fs.unlink(`images/avatars/${fileName}`, (err => { //On supprime l'ancienne image
        if (err) console.log(err);
        else {
          console.log("Image supprimée: " + fileName);
        }
      }))
    }
    user.destroy({where: {id: id}})
      .then(() => res.status(200).json({
        message: 'utilisateur supprimé !'
      }))
      .catch(error => res.status(400).json({
        error
      }));
  })
  .catch(error => res.status(500).json({
    error
  }));
}

const editUser = (req, res, next) => {
  const id = req.params.id
  const image = (req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null)
  const username = (req.body.username ? req.body.username : null)
    User.findOne({
        where: {
          id: id
        }
      })
      .then(user => {
        //Si image dans la requête
        if (req.file) {
          if (user.profilImg !== null) {
            const fileName = user.profilImg.split('/images')[1]
            fs.unlink(`images/${fileName}`, (err => { //Suppression de l'ancienne image
              if (err) console.log(err);
              else {
                console.log("Image supprimée: " + fileName);
              }
            }))
          }
          req.body.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }
        
        if (req.body) {
          username ? (user.username = username) : null,
          image ? user.profilImg = image : null

        user.save()
        .then( () => res.status(201).json({msg: "Profil modifié !"}))
        .catch(error => res.status(500).json(error))
        }
      })
      .catch(error => res.status(500).json({
        error
      }));
};

  module.exports = { signup, login, deleteUser, editUser}