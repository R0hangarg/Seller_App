import { Request, Response } from "express";
import sellerAccount from "../models/sellerModel";
import { sellerSchema } from "../validations/sellerAccountValidations";
import { resetPasswordEmail, sendVerificationEmail } from "../utils/emailService";
import jwt from 'jsonwebtoken'
import { loginValidationScehma, resetPasswordRequestValidation, resetPasswordValidation } from "../validations/loginValidation";
import { profileUpdateSchema } from "../validations/profileUpdate";
import {hashPassword,validatePassword,verifyToken,createToken} from '../utils/authUtils'

// Register Controller 
export const registerSellerController = async (req: Request, res: Response) => {
    try {
        // const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";
        const { error } = await sellerSchema.validateAsync(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                message: error.message,
                data: null,
                error: error
            });
        }

        const user = req.body;
        const userCheck = await sellerAccount.findOne({
            email: user.email,
        });

        if (userCheck) {
            return res.status(409).json({
                status: false,
                message: "Seller Account Already Exits !!!",
                data: null,
                error: null
            });
        }

        const hashedPassword = await hashPassword(user.password)

        //creating a token
        const payload = { email: user.email }
        const verificationToken = createToken(payload)

        const newUser = new sellerAccount({
            businessName: user.businessName,
            email: user.email,
            password: hashedPassword,
            phoneNumber: user.phoneNumber,
            address: user.address,
            verificationToken: verificationToken,
        });

        const savedUser = await newUser.save();
        await sendVerificationEmail(user.email, verificationToken);
        return res.status(201).json({
            status: true,
            message: "Seller registered successfully",
            data: savedUser,
            error: null
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while creating user.",
            data: null,
            error: error
        });
    }
}

//VerifyEmail Controller will work after registering new seller
export const verifyEmailController = async (req: Request, res: Response) => {
    try {
        // const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";

        const token = req.query.token;
        if (typeof token !== 'string') {
            return res.status(400).json({ message: 'Invalid token format.' });
        }
        const decoded = verifyToken(token)
        const tokenCheck = await sellerAccount.findOne({ verificationToken: token })

        if (!tokenCheck) {
            return res.status(400).json({
                status: false,
                message: 'Invalid or expired token.',
                data: null,
                error: null
            })
        }
        const { email } = decoded.decoded as jwt.JwtPayload;
        if (email !== tokenCheck.email) {
            return res.status(400).json({
                status: false,
                message: 'Token does not match seller.',
                data: null,
                error: null
            });
        }

        tokenCheck.emailVerified = true;
        tokenCheck.verificationToken = undefined;
        await tokenCheck.save();

        return res.status(200).json({
            status: true,
            message: 'Email veriffied successfully',
            data: null,
            error: null
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error,
            data: null,
            error: error
        })
    }

}

//Login Controller 
export const loginSeller = async (req: Request, res: Response) => {
    try {
        // const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";
        const user = await loginValidationScehma.validateAsync(req.body);

        const userCheck = await sellerAccount.findOne({ email: user.email });

        if (!userCheck) {
            return res.status(404).json({
                status: false,
                message: "No such user found please Register first",
                data: null,
                error: null
            })
        }

        const isMatch = await validatePassword(user.password, userCheck.password)

        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Incorrect password",
                data: null,
                error: null
            });
        }

        const payload = {
            email: user.email
        };

        const token = createToken(payload)

        res.cookie('token', token, {
            httpOnly: true, // JavaScript can't access the cookie
            maxAge: 3600000, // Cookie expiration time (1 hour in milliseconds)
            sameSite: 'strict' // Prevent CSRF attacks
        }).status(200).json({
            status: true,
            message: "Loggin user successfully",
            data: token,
            error: null,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error while logging seller",
            data: null,
            error: error
        });
    }

}

// controller to Update Seller Info
export const updateSellerInfo = async (req: Request, res: Response) => {
    try {
        const { sellerId } = req.params;

        const { error } = profileUpdateSchema.validate(req.body)

        if (error) {
            return res.status(400).json({
                status: false,
                message: "validation failed",
                data: null,
                error: error
            })
        }

        const updatedUser = req.body;

        const updatedSeller = await sellerAccount.findByIdAndUpdate(sellerId, updatedUser, {
            new: true,
            runValidators: true
        })

        if (!updatedSeller) {
            return res.status(400).json({
                status: false,
                message: "Seller account not found",
                data: null,
                error: null
            })
        }

        return res.status(200).json({
            status: true,
            message: "Seller account updated successfully",
            data: updatedSeller,
            error: null
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error Updating the seller info",
            data: null,
            error: error
        })
    }

}

//ResetPassword  Request Controller 
export const resetPassword = async (req: Request, res: Response) => {
    try {
        // const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";

        const { email } = await resetPasswordValidation.validateAsync(req.body);

        const userCheck = await sellerAccount.findOne({ email: email })

        if (!userCheck) {
            return res.status(400).json({
                status: false,
                message: "Seller email Doesn't exits",
                data: null,
                error: null
            })
        }

        const payload = {email:email}
        const resetToken = createToken(payload)

        userCheck.verificationToken = resetToken;
        userCheck.save();

        await resetPasswordEmail(email, resetToken)

        return res.status(200).json({
            status: true,
            message: "A message indicating reset instructions have been sent",
            data: userCheck,
            error: null
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error while reseting password",
            data: null,
            error: error
        })
    }

}

//ResetPassword Confirm Controller
export const resetPasswordRequest = async (req: Request, res: Response) => {
    try {
        const { password } = await resetPasswordRequestValidation.validateAsync(req.body);

        const token = req.query.token;

        if (!token) {
            return res.status(400).json({
                status: false,
                message: "No token received",
                data: null,
                error: null
            })
        }

        const hashedPassword = await hashPassword(password)

        const updatedSeller = await sellerAccount.findOneAndUpdate({ verificationToken: token }, { password: hashedPassword }, { new: true })

        if (!updatedSeller) {
            return res.status(400).json({
                status: false,
                message: "Token is invalid or expired",
                data: null,
                error: null
            })
        }

        res.status(200).json({
            status: true,
            message: "Password reset successfully",
            data: updatedSeller,
            error: null
        })

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "error updating password",
            data: null,
            error: error
        })
    }
}