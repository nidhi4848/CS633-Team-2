// pantrySchema.js
import mongoose from 'mongoose';

const PantrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to Ingredient model
        ref: 'Ingredient',  // Ensures that the ingredients are objects based on Ingredient model
    }],
}, { timestamps: true });

const Pantry = mongoose.model('Pantry', PantrySchema);

export default Pantry;
