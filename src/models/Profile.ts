import { Schema, model } from 'mongoose';

const ProfileSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, required: true },
});

export default model('Profile', ProfileSchema);
