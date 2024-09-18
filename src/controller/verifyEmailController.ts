import { Request, Response } from "express"
import sellerAccount from "../models/sellerModel";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyEmailController = async (req: Request, res: Response) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";

        const token = req.query.token;
        if (typeof token !== 'string') {
            return res.status(400).json({ message: 'Invalid token format.' });
        }
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const tokenCheck = await sellerAccount.findOne({ verificationToken: token })

        if (!tokenCheck) {
            return res.status(400).json({
                status: false,
                message: 'Invalid or expired token.',
                data: null,
                error: null
            })
        }
        if (decoded.email !== tokenCheck.email) {
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