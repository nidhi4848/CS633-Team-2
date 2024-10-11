import express from 'express';
import { searchAllItems} from '../Controllers/searchController.js';
import { searchOneItem} from '../Controllers/searchController.js';

const router = express.Router();

//Search all items
router.post('/all', searchAllItems);
router.post('/one', searchOneItem);


export {router as searchRoutes}; 