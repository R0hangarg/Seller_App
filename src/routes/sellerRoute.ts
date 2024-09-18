import express from 'express'
import { sellerController } from '../controller/sellerController';
import { verifyEmailController } from '../controller/verifyEmailController';

const sellerRouter = express.Router();

sellerRouter.post('/register',sellerController)
sellerRouter.get('/verify-email',verifyEmailController)

export default sellerRouter;