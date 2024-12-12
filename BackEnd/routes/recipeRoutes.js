import express from 'express';
import auth from '../Middlewares/auth.js';
import { getUserRecipes, addRecipe, deleteRecipe } from '../Controllers/recipeController.js';

const router = express.Router();


//get recipe route
router.get('/', auth, getUserRecipes);

//Add recipe route
router.post('/', auth, addRecipe);

router.delete('/:recipeId', auth, deleteRecipe);


export {router as recipeRoutes};