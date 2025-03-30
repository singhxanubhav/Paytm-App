import express from "express";
import { userSignup, userSignin, userUpdate } from "../types.js";
import { User, Account } from "../models/index.js";
import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.js";
import { authMiddleware } from "../middlewares/index.js";
import bcrypt from "bcrypt";

const app = express();

app.post("/signup", async (req, res) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;

        // Validate incoming data
        const parsedValues = userSignup.safeParse({ username, firstName, lastName, email, password });
        if (!parsedValues.success) {
            return res.status(411).json({ msg: "Inputs are Incorrect!" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(411).json({ msg: "User Already Exists!" });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);  // Using async/await for better performance

        // Create new user
        const newUser = await User.create({ username, firstName, lastName, email, password: hash });

        // Generate random balance (as integer)
        const randomBalance = Math.floor(Math.random() * 10000) + 1;

        // Create user account
        const newUserAccount = await Account.create({ 
            userId: newUser._id, 
            balance: randomBalance, 
            firstName: newUser.firstName 
        });

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser._id, firstName }, JWT_SECRET);

        // Send success response
        res.status(200).json({
            msg: "User Created Successfully",
            token,
            balance: newUserAccount.balance,
            pass: newUser.password
        });

    } catch (error) {
        console.error("Error in Signup Route:", error.message);
        res.status(500).json({ msg: "Server Error Occurred!" });
    }
});

app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const parsedValues = userSignin.safeParse({ username, password });

        if (!parsedValues.success) {
            return res.status(411).json({ msg: "Inputs are Incorrect!" });
        }

        const userExists = await User.findOne({ username });
        if (!userExists) {
            return res.status(411).json({ msg: "Wrong Username!" });
        }

        // Optimized bcrypt comparison using async/await
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(411).json({ msg: "Password is Incorrect!" });
        }

        const token = jwt.sign({ userId: userExists._id }, JWT_SECRET);

        res.status(200).json({
            msg: "Logged In Successfully",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error Occurred!", error: error.message });
    }
});


app.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    const userId = req.userId;

    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },  // Exclude the logged-in user
            {
                $or: [
                    { firstName: { $regex: filter, $options: "i" } }, // Case-insensitive
                    { lastName: { $regex: filter, $options: "i" } }
                ]
            }
        ]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
        }))
    });
});

app.put("/", authMiddleware, async (req, res) => {
    const { success } = userUpdate.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Error while updating information" });
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({ message: "Updated successfully" });
});

app.post("/me", authMiddleware, (req, res) => {
    res.status(200).json({ msg: "You're logged in", userId: req.userId });
});

export default app;
