import Joi from 'joi'

export const sellerSchema = Joi.object({
    businessName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^[a-zA-Z0-9]+$/).required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(), // Adjust regex as needed
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      country: Joi.string().optional(),
    }).required(),
  });