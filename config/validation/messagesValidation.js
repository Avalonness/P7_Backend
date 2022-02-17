const Joi = require('joi');

const messagesValidation = (body) => {
    const messagesSchema = Joi.object({
        youtube : Joi.string().min(3).max(100).trim(),
        contentImg : Joi.string().min(3).max(200).trim(),
        contentText : Joi.string().required()
    })

    return messagesSchema.validate(body)
}

module.exports = messagesValidation;