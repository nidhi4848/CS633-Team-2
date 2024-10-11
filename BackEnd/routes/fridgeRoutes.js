import express from 'express';
import { addFridgeToUser, getFridgeFromUser } from '../Controllers/fridgeController.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();


//Get Fridge from specific user Route
router.get('/', auth, getFridgeFromUser);

//Add a new Fridge to a User Route
router.post('/', auth, addFridgeToUser);

export {router as fridgeRoutes};