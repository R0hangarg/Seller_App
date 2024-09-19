import Joi from 'joi'

export const profileUpdateSchema = Joi.object({
    businessDescription: Joi.string().optional(),
    logoUrl: Joi.string().uri().optional(), // Valid URL
    website: Joi.string().uri().optional(), // Valid URL
    socialMediaLinks: Joi.array().items(
        Joi.object({
            platform: Joi.string().required(),
            url: Joi.string().uri().required(), // Valid URL
        })
    ).optional(),
});