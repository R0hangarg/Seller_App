import { Request, Response } from "express";
import sellerAccount from "../models/sellerModel";
import bcrypt from 'bcryptjs'
import { sellerSchema } from "../validations/sellerAccountValidations";
import crypto from 'crypto';
import { sendVerificationEmail } from "../utils/emailService";
import jwt from 'jsonwebtoken'

export const sellerController = async (req: Request, res: Response) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";
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

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const verificationToken = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
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
        return res.cookie('token', token, {
            httpOnly: true, // JavaScript can't access the cookie
            maxAge: 3600000, // Cookie expiration time (1 hour in milliseconds)
            sameSite: 'strict' // Prevent CSRF attacks
        }).status(201).json({
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