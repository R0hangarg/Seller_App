import express from 'express'
import { connectDB } from './database/db';
import dotenv from 'dotenv';
import sellerRouter from './routes/sellerRoute';
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import productRouter from './routes/productRouter';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter)
app.use('/api/sellers', sellerRouter);
app.use('/api/sellers',productRouter);

connectDB.then(() => {
    app.listen(PORT, () => {
        console.log(`Server successfully connected on port ${PORT}`)
    })
}).catch((error) => {
    console.log(`Error occured ${error}`);
    process.exit(1)
})

export default app;