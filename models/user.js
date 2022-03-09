'use strict';
const {Sequelize,DataTypes, database} = require('../config/connexion');

const User = database.define('User', {
    username: {
        type: DataTypes.STRING,
        required: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        required: true,
        unique: true
    },
    password: DataTypes.STRING,
    profilImg: DataTypes.STRING,
    levelAccount: DataTypes.INTEGER,

}, {
    Sequelize,
    modelName: 'User',
    underscored: false,
    paranoid: false
});

module.exports = User;