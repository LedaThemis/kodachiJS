import { Schema, model } from 'mongoose';

const ProfileSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, required: false },
    activity: {
        text: { type: Number, required: false },
        voice: { type: Number, required: false },
    },
});

export default model('Profile', ProfileSchema);
