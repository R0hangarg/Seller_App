import Joi from 'joi'


export const loginValidationScehma = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
})

export const resetPasswordValidation = Joi.object({
    email: Joi.string().required().email()
})

export const resetPasswordRequestValidation = Joi.object({
    password: Joi.string().required().min(6)
})
