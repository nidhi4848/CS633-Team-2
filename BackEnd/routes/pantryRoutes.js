import express from 'express';
import {getPantryFromUser, addIngredientToPantry, deleteIngredientFromPantry } from '../Controllers/pantryController.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();


//Get Fridge from specific user Route
router.get('/', auth, getPantryFromUser);

//Add Ingredient to Fridge Route
router.post('/addIngredient', auth, addIngredientToPantry);

//Delete Ingredient from Fridge Route
router.post('/deleteIngredient', auth, deleteIngredientFromPantry);

export {router as pantryRoutes};