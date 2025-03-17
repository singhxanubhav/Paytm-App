import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const connectDb = async () => {
    try {
      await mongoose.connect(process.env.DB_CONNECTION_STRING);
      console.log(`MongoDB connect Successfully `);
    } catch (error) {
      console.log(error);
    }
  };

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
});

export const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
});

export const Account = mongoose.model("Account", accountSchema);


