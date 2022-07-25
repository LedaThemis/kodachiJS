import { Schema, model } from 'mongoose';

const BirthdaySchema = new Schema({
    user_id: { type: String, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    name: { type: String, required: false },
});

export default model('Birthday', BirthdaySchema);
