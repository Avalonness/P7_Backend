const {
    Sequelize,
    DataTypes
} = require('sequelize');


const database = new Sequelize('cli-groupomania', 'root', '@Tfcvbgt123', {dialect: "mysql", host: "localhost"})

database.authenticate()
    .then(() => console.log("Vous êtes maintenant connecté à la base de donnée !"))
    .catch(err => console.log("erreur d'authentification: " + err));

module.exports = {
    Sequelize,
    DataTypes,
    database
};