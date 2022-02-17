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
}, {
    Sequelize,
    modelName: 'User',
    underscored: false,
    paranoid: false
});

module.exports = User;