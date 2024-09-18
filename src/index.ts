import express from 'express'
import { connectDB } from './database/db';
import dotenv from 'dotenv';
import sellerRouter from './routes/sellerRoute';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use('/api/sellers', sellerRouter)

connectDB.then(() => {
    app.listen(PORT, () => {
        console.log(`Server successfully connected on port ${PORT}`)
    })
}).catch((error) => {
    console.log(`Error occured ${error}`);
    process.exit(1)
})

export default app;