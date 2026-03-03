import express from "express"
import { addCustomer, getCustomer } from "../controllers/customerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const customerRouter = express();

customerRouter.post('/',authMiddleware,addCustomer);
customerRouter.get('/',authMiddleware,getCustomer);

export default customerRouter;