import mongoose from 'mongoose';
import Fridge from '../models/FridgeModel.js';
import User from '../models/UserModel.js';
import Ingredient from '../models/IngredientModel.js';  // Import the Ingredient model

/********************************************** Get All Fridge Items *********************************************/
const getFridgeFromUser = async (req, res) => {
    try {
        // Go to the user model and get the fridge Id
        const user = await User.findById(req.user._id);
        const fridge = await Fridge.findById(user.fridge).populate('ingredients');
        res.status(200).json(fridge);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/********************************************** Add Ingredient to Fridge *********************************************/
// Adding ingredient to a fridge
const addIngredientToFridge = async (req, res) => {
    try {
        // Find user and their fridge
        const user = await User.findById(req.user._id);
        const fridge = await Fridge.findById(user.fridge);
        
        // Create new ingredient
        const newIngredient = new Ingredient({
            foodName: req.body.foodName,
            quantity: req.body.quantity,
            calories: req.body.calories,
            measurement: '',
        });
        
        // Save the new ingredient
        await newIngredient.save();
        
        // Add the ingredient ObjectId to fridge's ingredients array
        fridge.ingredients.push(newIngredient._id);  
        await fridge.save();

        res.status(200).json(fridge);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

/********************************************** Delete Ingredient from Fridge *********************************************/
// Deleting ingredient from fridge
const deleteIngredientFromFridge = async (req, res) => {
    try {
        // Go to the user model and get the fridge Id
        const user = await User.findById(req.user._id);
        const fridge = await Fridge.findById(user.fridge);
        
        // Ensure the ingredient to delete is passed as an ObjectId
        const ingredientId = req.body.ingredientId; // Make sure the request has an `ingredientId`

        if (!ingredientId) {
            return res.status(400).json({ error: 'Ingredient ID is required' });
        }

        // Remove the ingredient from the fridge by pulling its ObjectId
        fridge.ingredients.pull(ingredientId);  // Use the ingredient's ObjectId for deletion
        
        // Save the updated fridge
        await fridge.save();
        res.status(200).json(fridge);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export { getFridgeFromUser, addIngredientToFridge, deleteIngredientFromFridge };
