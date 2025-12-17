// models/CartoonImage.model.js
import mongoose from "mongoose";

const cartoonImageSchema = new mongoose.Schema({
    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },

}, { timestamps: true });

export const CartoonImageModel = mongoose.model("CartoonImage", cartoonImageSchema);
