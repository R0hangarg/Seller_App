import Joi from 'joi'

export const productValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    sku: Joi.string().required(),
})