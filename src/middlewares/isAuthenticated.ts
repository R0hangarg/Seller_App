import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key";

        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'No token provided. Access denied.',
                data: null,
                error: null
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                status: false,
                message: "login First",
                data: null,
                error: null
            })
        }
        res.locals.seller = decoded;
        next()

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error while authenticating seller",
            data: null,
            error: error
        })
    }
}