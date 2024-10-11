import mongoose from "mongoose";

const FridgeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ingredients: {
        type: Array,
        required: true
    }
}, { timestamps: true });

const Fridge = mongoose.model('Fridge', FridgeSchema);

export default Fridge;