import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
    }],
}, { timestamps: true });

const Meal = mongoose.model('Meal', MealSchema);

export default Meal;
