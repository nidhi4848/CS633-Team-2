import Pantry from '../models/PantryModel.js';
import User from '../models/UserModel.js';
import Ingredient from '../models/IngredientModel.js';

/********************************************** Get All Pantry Items *********************************************/
const getPantryFromUser = async (req, res) => {
    try {
        // Go to the user model and get the pantry Id
        const user = await User.findById(req.user._id);
        const pantry = await Pantry.findById(user.pantry).populate('ingredients');
        res.status(200).json(pantry);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/********************************************** Add Ingredient to Pantry *********************************************/
// Adding ingredient to a pantry
const addIngredientToPantry = async (req, res) => {
    try {
        // Find user and their pantry
        const user = await User.findById(req.user._id);
        const pantry = await Pantry.findById(user.pantry);
        
        // Create new ingredient
        const newIngredient = new Ingredient({
            foodName: req.body.foodName,
            quantity: req.body.quantity,
            calories: req.body.calories,
            measurement: '',
        });
        
        // Save the new ingredient
        await newIngredient.save();
        
        // Add the ingredient ObjectId to pantry's ingredients array
        pantry.ingredients.push(newIngredient._id);  
        await pantry.save();

        res.status(200).json(pantry);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/********************************************** Delete Ingredient from Pantry *********************************************/
const deleteIngredientFromPantry = async (req, res) => {
    try {
        // Go to the user model and get the pantry Id
        const user = await User.findById(req.user._id);
        const pantry = await Pantry.findById(user.pantry);
        
        // Ensure the ingredient to delete is passed as an ObjectId
        const ingredientId = req.body.ingredientId; // Make sure the request has an `ingredientId`

        if (!ingredientId) {
            return res.status(400).json({ error: 'Ingredient ID is required' });
        }

        // Remove the ingredient from the pantry by pulling its ObjectId
        pantry.ingredients.pull(ingredientId);  // Use the ingredient's ObjectId for deletion
        
        // Save the updated pantry
        await pantry.save();
        res.status(200).json(pantry);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export { getPantryFromUser, addIngredientToPantry, deleteIngredientFromPantry };
