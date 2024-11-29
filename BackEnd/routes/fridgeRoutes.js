import express from 'express';
import {getFridgeFromUser, addIngredientToFridge, deleteIngredientFromFridge } from '../Controllers/fridgeController.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();


//Get Fridge from specific user Route
router.get('/', auth, getFridgeFromUser);

//Add Ingredient to Fridge Route
router.post('/addIngredient', auth, addIngredientToFridge);

//Delete Ingredient from Fridge Route
router.post('/deleteIngredient', auth, deleteIngredientFromFridge);

export {router as fridgeRoutes};