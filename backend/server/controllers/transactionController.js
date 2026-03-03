import transactionModel from "../models/transactions.js"
import customerModel from "../models/customer.js"
export const addTransaction = async (req, res) => {
    try {
        const { customerId, amount, type, note } = req.body;

        //* what if the customerId doesn't belong to user or its from hacker?
        //* instead of custormeId find it with both customer and logged-in user's id.       
        const customer = await customerModel.findOne({
            _id: customerId,
            userId: req.user._id
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const transaction = await transactionModel.create({
            userId: req.user._id,
            customerId,
            amount,
            type,
            note
        });

        if (type === 'credit') {
            customer.balance += amount;
        }
        else {
            customer.balance -= amount;
        }

        await customer.save();

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getTransactions = async (req, res) => {
    try {
        const { customerId } = req.params;

        // check customer 
        const customer = await customerModel.findOne({
            _id: customerId,
            userId: req.user._id
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const transactions = await transactionModel.find({
            customerId,
            userId: req.user._id
        }).sort({ createdAt: -1 }); //Newest transactions comes first

        res.status(200).json(transactions);

    } catch (err) {
        res.status(500).json({ message: err.message });

    }
}

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find({
            userId: req.user._id
        })
        .populate("customerId", "name")
        .sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}