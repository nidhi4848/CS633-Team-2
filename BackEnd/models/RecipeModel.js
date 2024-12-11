import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recipeName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
    }],
    instructions: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
