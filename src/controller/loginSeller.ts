import { Request, Response } from "express";
import { loginValidationScehma } from "../validations/loginValidation";
import sellerAccount from "../models/sellerModel";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const loginSeller = async (req: Request, res: Response) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";
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

        const isMatch = await bcrypt.compare(user.password, userCheck.password)

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

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

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