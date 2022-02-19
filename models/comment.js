'use strict';
const {Sequelize,DataTypes, database} = require('../config/connexion');

const Comment= database.define('Comment', {
        userId: DataTypes.INTEGER,
        MessageId: DataTypes.INTEGER,
        content: DataTypes.STRING,
    }, {
        Sequelize,
        modelName: 'Comment',
        underscored: false,
        paranoid: false
    });

module.exports = Comment;