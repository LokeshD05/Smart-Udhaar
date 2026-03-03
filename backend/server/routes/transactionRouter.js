import express from "express";
import { addTransaction, getAllTransactions, getTransactions } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const transactionRouter = express.Router();

// Add transaction
transactionRouter.post("/", authMiddleware, addTransaction);

// Get transactions
transactionRouter.get("/:customerId", authMiddleware, getTransactions);
transactionRouter.get("/",authMiddleware,getAllTransactions);
export default transactionRouter;
