import express from 'express'
import { orderController,  subscribe, updateOrderController } from '../controller/orderController';

const orderRouter = express.Router();

orderRouter.post('/orders',orderController);
orderRouter.post('/orders/:id',updateOrderController);
orderRouter.post('/subscribe', subscribe);

export default orderRouter