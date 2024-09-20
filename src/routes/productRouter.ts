import express from 'express'
import { createProduct } from '../controller/createProductController';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { updateProduct } from '../controller/updateProductController';
import { deleteProductController } from '../controller/deleteProductController';
import { getAllProducts } from '../controller/getAllProducts';

const productRouter = express.Router();

productRouter.post('/:sellerId/products',isAuthenticated, createProduct);
productRouter.put('/:sellerId/products/:productId',isAuthenticated,updateProduct)
productRouter.delete('/:sellerId/products/:productId',isAuthenticated,deleteProductController)
productRouter.get('/:sellerId/products',isAuthenticated,getAllProducts)

export default productRouter;