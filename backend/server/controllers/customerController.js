import customerModel from "../models/customer.js";

export const addCustomer = async (req, res) => {
    try {
        const { name, phone, address, balance } = req.body;
        const customer = await customerModel.create({
            userId: req.user._id,
            name,
            phone,
            address,
            balance: balance || 0
        });
        console.log("req.user in controller:", req.user);
        res.status(201).json(customer);
    } catch (err) {   
        res.status(500).json({ message:err.message });
    }
}

export const getCustomer = async (req, res) => {
    try {
        const customer = await customerModel.find({
            userId: req.user._id
        });
        res.status(200).json(customer);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}