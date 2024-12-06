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
        const dayExists = await Day.findOne({ user: user._id, date: date })
            .populate('breakfast lunch dinner');
        
        if (!dayExists) {
            return res.status(200).json({ day: {}, totalCalories: 0 });
        }

        // Calculate total calories for breakfast, lunch, and dinner
        let totalCalories = 0;

        // Helper function to calculate calories for a meal
        const calculateCalories = (meal) => {
            return meal.reduce((sum, item) => sum + (item.calories || 0), 0);
        };

        // Calculate total calories for breakfast, lunch, and dinner
        totalCalories += calculateCalories(dayExists.breakfast || []);
        totalCalories += calculateCalories(dayExists.lunch || []);
        totalCalories += calculateCalories(dayExists.dinner || []);

        // Respond with the data inside the day and total calories
        res.status(200).json({ day: dayExists, totalCalories });

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
        let day = await Day.findOne({ user: user._id, date: date }).populate('breakfast lunch dinner');
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

        // Populate the newly added meal in the response
        await day.populate('breakfast lunch dinner');

        res.status(200).json({ message: `Meal added to ${mealType}`, day });

        // Log the response
        console.log({ message: `Meal added to ${mealType}`, day });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteMealFromDay = async (req, res) => {
    try {
        const { date, mealType, mealId } = req.body;

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
        let day = await Day.findOne({ user: user._id, date: date }).populate('breakfast lunch dinner');
        if (!day) {
            return res.status(404).json({ error: 'Day not found' });
        }

        // Check if the meal exists in the specified meal type
        const mealIndex = day[mealType].findIndex(meal => meal._id.toString() === mealId);
        if (mealIndex === -1) {
            return res.status(404).json({ error: 'Meal not found in the specified meal type' });
        }

        // Remove the meal ID from the meal type array
        day[mealType].splice(mealIndex, 1);
        await day.save();

        // Delete the meal document
        await Meal.findByIdAndDelete(mealId);

        // Respond with the updated day data
        await day.populate('breakfast lunch dinner');
        res.status(200).json({ message: `Meal removed from ${mealType}`, day });

        // Log the response
        console.log({ message: `Meal removed from ${mealType}`, day });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



export { checkIfDayAvailable, addMealToDay, deleteMealFromDay };