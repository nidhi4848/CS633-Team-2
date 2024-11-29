import express from 'express';
import { postRoutes } from './routes/postRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { searchRoutes } from './routes/searchRoutes.js';
import { fridgeRoutes } from './routes/fridgeRoutes.js';
import { pantryRoutes } from './routes/pantryRoutes.js';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/fridge', fridgeRoutes);
app.use('/api/pantry', pantryRoutes);

mongoose.connect('mongodb+srv://sergiok:Ivyleague123@cluster0.yqwum.mongodb.net', { dbName: 'demo_db' }).then(() => {
    console.log('Connected to MongoDB');
    app.listen(4000, '0.0.0.0', () => {
        console.log('listening on port 4000');
    });
}).catch(err => {
    console.log(err);
});
