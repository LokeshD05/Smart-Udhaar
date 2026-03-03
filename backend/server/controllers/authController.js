import bcrypt from "bcrypt"
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { name, email, password, phone, shopName } = req.body;

    if (!name || !email || !password || !phone || !shopName) {
        return res.json({ success: false, message: 'fill all the details' });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "user already exists" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            shopName,
            phone
        });
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.secretKey, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",//! changed here
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "fill all the details" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.secretKey, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //! changed here
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const logOut = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({ success: true, message: 'logged out successfully!' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}