import mongoose from "mongoose";
import transactionModel from "../models/transactions.js";

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const aggregateTransactions = await transactionModel.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $facet: {
                    summary: [
                        {
                            $group: {
                                _id: null,
                                totalCredit: {
                                    $sum: {
                                        $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0]
                                    }
                                },
                                totalPayment: {
                                    $sum: {
                                        $cond: [{ $eq: ["$type", "payment"] }, "$amount", 0]
                                    }
                                },
                                totalTransactions: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalCredit: 1,
                                totalPayment: 1,
                                totalTransactions: 1,
                                pendingAmount: {
                                    $subtract: ["$totalCredit", "$totalPayment"]
                                }
                            }
                        }
                    ],
                    CustomerCount: [
                        {
                            $group: {
                                _id: "$customerId"
                            }
                        },
                        {
                            $count: "totalCustomers"
                        }
                    ]
                }
            }
        ]);
        
        //! must revise this 
        //* use ?? instead
        const result = aggregateTransactions[0] || {};

        const dashboardSummary = result.summary?.[0] || {
            totalCredit: 0,
            totalPayment: 0,
            totalTransactions: 0,
            pendingAmount: 0
        };

        const totalCustomers = result.CustomerCount?.[0]?.totalCustomers || 0;
        res.status(200).json({
            ...dashboardSummary,
            totalCustomers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" })
    }
}