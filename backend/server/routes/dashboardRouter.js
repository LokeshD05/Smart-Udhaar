import express from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import  authMiddleware  from "../middleware/authMiddleware.js"

const dashRouter = express.Router();

dashRouter.get('/', authMiddleware, getDashboardSummary);

export default dashRouter;