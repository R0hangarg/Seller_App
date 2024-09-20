import { Request, Response } from "express";
import sellerAccount from "../models/sellerModel";
import { resetPasswordRequestValidation, resetPasswordValidation } from "../validations/loginValidation";
import jwt from "jsonwebtoken";
import { resetPasswordEmail } from "../utils/emailService";
import bcrypt from 'bcryptjs'

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";

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

        const resetToken = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '1h' })

        userCheck.verificationToken = resetToken;
        userCheck.save();

        await resetPasswordEmail(email, resetToken)
console.log(resetToken)
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

        const hashedPassword = await bcrypt.hash(password, 10);

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