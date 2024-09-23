import express from 'express'
import { loginSeller, registerSellerController, resetPassword, resetPasswordRequest, updateSellerInfo, verifyEmailController} from '../controller/sellerController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const sellerRouter = express.Router();

sellerRouter.post('/register', registerSellerController);
sellerRouter.get('/verify-email', verifyEmailController);
sellerRouter.put('/:sellerId/profile', isAuthenticated, updateSellerInfo);
sellerRouter.post('/login', loginSeller);
sellerRouter.post('/password-reset/request', resetPassword);
sellerRouter.post('/password-reset/confirm', resetPasswordRequest);


export default sellerRouter;