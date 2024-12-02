import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    phone: { type: String, unique: true },
    name: { type: [String], default: [] }, // Array of names
    state: { type: [String], default: [] }, // Array of states
    city: { type: [String], default: [] }, // Array of cities
    cardNo: { type: [String], default: [] }, // Array of card numbers
    url: { type: [String], default: [] }, // Array of URLs
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema)