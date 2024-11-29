// ingredientSchema.js
import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
