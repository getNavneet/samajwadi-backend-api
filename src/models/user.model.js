import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Ensure it's a 10-digit number
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    cardNo: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: false,
        trim: true,
    }
}, {
    timestamps: true // Automatically add `createdAt` and `updatedAt`
});

export const User = mongoose.model("User", userSchema)