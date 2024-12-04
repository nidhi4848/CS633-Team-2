import Day from '../models/DayModel.js';
import User from '../models/UserModel.js';
import Meal from '../models/MealModel.js';

const checkIfDayAvailable = async (req, res) => {
    try {
        // Validate the date format (YYYY-MM-DD)
        const date = req.params.date;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Find the user
        const user = await User.findById(req.user._id).populate('days');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the day with the specified date exists
        const dayExists = await Day.findOne({ user: user._id, date: date }).populate('breakfast lunch dinner');
        if (!dayExists) {
            return res.status(200).json({ day: {} });
        }

        // Respond with the data inside the day
        res.status(200).json({ day: dayExists });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const addMealToDay = async (req, res) => {
    try {
        const { date, mealType, mealData } = req.body;

        // Validate the date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        // Validate meal type
        const validMealTypes = ['breakfast', 'lunch', 'dinner'];
        if (!validMealTypes.includes(mealType)) {
            return res.status(400).json({ error: `Invalid meal type. Choose from: ${validMealTypes.join(', ')}` });
        }

        // Find the user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the Day document
        let day = await Day.findOne({ user: user._id, date: date });
        if (!day) {
            // If the day doesn't exist, create it
            day = new Day({ user: user._id, date: date });
            await day.save();
        }

        // Create a new Meal document
        const meal = new Meal({ ...mealData, user: user._id });
        await meal.save();

        // Add the meal to the corresponding meal type
        day[mealType].push(meal._id);
        await day.save();

        res.status(200).json({ message: `Meal added to ${mealType}`, day });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export { checkIfDayAvailable, addMealToDay };