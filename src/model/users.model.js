import mongoose from 'mongoose';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
const { Schema } = mongoose;
const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    bankAccNum: { type: String, required: true, default: () => uuidv4() },
    isActive: { type: Boolean },
    credit: {
        type: Number,
        required: true,
        min: [0, 'Invalid Price has to be a positive number'],
    },
    cash: {
        type: Number,
        required: true,
        min: [0, 'Invalid Price has to be a positive number'],
    },
});
export const User = mongoose.model('User', userSchema);
