import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createProduct, deleteProductController, getAllProducts, updateProduct } from '../controller/productController';
const productRouter = express.Router();

productRouter.post('/:sellerId/products',isAuthenticated, createProduct);
productRouter.put('/:sellerId/products/:productId',isAuthenticated,updateProduct)
productRouter.delete('/:sellerId/products/:productId',isAuthenticated,deleteProductController)
productRouter.get('/:sellerId/products',isAuthenticated,getAllProducts)

export default productRouter;