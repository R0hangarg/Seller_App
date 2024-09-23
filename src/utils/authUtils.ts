// authUtils.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Configuration for JWT
const JWT_SECRET = process.env.JWT_SECRET_KEY || "Your-secret-key"; // Replace with your secret
const JWT_EXPIRES_IN = '1h'; // Token expiration time

// Password hashing utility
export const hashPassword = async (password:any) => {
    const saltRounds = 10; // Number of rounds for salt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Password validation utility
export const validatePassword = async (password:any, hashedPassword:any) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Token creation utility
export const createToken = (payload:any) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Token verification utility
export const verifyToken = (token:any) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        const errorMessage = (error instanceof jwt.JsonWebTokenError) ? error.message : 'Invalid token';
        return { valid: false, error: errorMessage };
    }
};


