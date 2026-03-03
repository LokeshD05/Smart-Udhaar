import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./server/config/mongodb.js"
import authRouter from "./server/routes/authRouter.js"
import customerRouter from "./server/routes/customerRouter.js"
import transactionRouter from "./server/routes/transactionRouter.js"
import dashRouter from "./server/routes/dashboardRouter.js"

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3000
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//* API endpoint
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/customers',customerRouter);
app.use('/api/transactions',transactionRouter);
app.use('/api/dashboard',dashRouter);

app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(PORT,()=>{
    console.log(`Server is listening on port:${PORT}`);
})
