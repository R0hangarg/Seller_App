import express from 'express'
import { createProduct } from '../controller/createProductController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const productRouter = express.Router();

productRouter.post('/:sellerId/products',isAuthenticated, createProduct)

export default productRouter;