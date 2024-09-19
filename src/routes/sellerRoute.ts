import express from 'express'
import { sellerController } from '../controller/sellerController';
import { verifyEmailController } from '../controller/verifyEmailController';
import { updateSellerInfo } from '../controller/updateSellerInfo';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { loginSeller } from '../controller/loginSeller';
import { resetPassword, resetPasswordRequest } from '../controller/resetPassword';

const sellerRouter = express.Router();

sellerRouter.post('/register', sellerController);
sellerRouter.get('/verify-email', verifyEmailController);
sellerRouter.put('/:sellerId/profile', isAuthenticated, updateSellerInfo);
sellerRouter.post('/login', loginSeller);
sellerRouter.post('/password-reset/request', resetPassword);
sellerRouter.post('/password-reset/confirm', resetPasswordRequest);


export default sellerRouter;