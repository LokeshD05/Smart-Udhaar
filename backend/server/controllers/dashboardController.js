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
                    ],

                    topDebtors: [
                        {
                            $group: {
                                _id: "$customerId",
                                totalCredit: {
                                    $sum: {
                                        $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0]
                                    }
                                },
                                totalPayment: {
                                    $sum: {
                                        $cond: [{ $eq: ["$type", "payment"] }, "$amount", 0]
                                    }
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "customers",
                                localField: "_id",        // ✅ fixed: was "customerId"
                                foreignField: "_id",
                                as: "customer"
                            }
                        },
                        {
                            $unwind: "$customer"
                        },
                        {
                            $project: {
                                customerId: "$_id",
                                name: "$customer.name",   // ✅ added
                                debt: {
                                    $subtract: ["$totalCredit", "$totalPayment"]
                                }
                            }
                        },
                        {
                            $sort: { debt: -1 }
                        },
                        {
                            $limit: 5
                        }
                    ],

                    recentTransactions: [
                        {
                            $sort: { createdAt: -1 }
                        },
                        {
                            $limit: 5
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

        const topDebtors = result.topDebtors ?? [];
        const recentTransactions = result.recentTransactions ?? [];

        res.status(200).json({
            ...dashboardSummary,
            totalCustomers,
            topDebtors,
            recentTransactions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server Error" })
    }
}