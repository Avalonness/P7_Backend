'use strict';
const User = require('../models/user');
const Message = require('../models/message');
const Comment = require('../models/comment');
const Like = require('../models/like')

Message.belongsTo(User);  
Message.hasMany(Comment, { onDelete: 'cascade' });
Comment.belongsTo(Message);
Comment.belongsTo(User);

module.exports = {User, Message, Comment, Like};