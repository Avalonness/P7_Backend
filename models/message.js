'use strict';
const {Sequelize,DataTypes, database} = require('../config/connexion');

const Message= database.define('Message', {
        userId: DataTypes.INTEGER, 
        youtube: DataTypes.STRING,
        contentImg: DataTypes.STRING,
        contentText: DataTypes.TEXT,
        likes: DataTypes.INTEGER,
        comments: DataTypes.INTEGER,
    }, {
        Sequelize,
        modelName: 'Message',
        underscored: false,
        paranoid: false
    });

module.exports = Message;