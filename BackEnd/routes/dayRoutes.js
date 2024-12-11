import express from 'express';
import auth from '../Middlewares/auth.js';
import {checkIfDayAvailable, addMealToDay, deleteMealFromDay} from '../Controllers/dayController.js';

const router = express.Router();


//Get Date data route
router.get('/:date', auth, checkIfDayAvailable);

//Add meal to day route
router.post('/', auth, addMealToDay);

router.delete('/', auth, deleteMealFromDay);


export {router as dayRoutes};