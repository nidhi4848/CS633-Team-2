import User from '../models/UserModel.js';
import Recipe from '../models/RecipeModel.js';
import Ingredient from '../models/IngredientModel.js';



const addRecipe = async (req, res) => {
    try {
        const { mealData } = req.body;

        // Find the user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // add ingredients to Ingredient model
        const ingredients = [];
        for (let i = 0; i < mealData.ingredients.length; i++) {
            const ingredient = new Ingredient({ ...mealData.ingredients[i] });
            await ingredient.save();
            ingredients.push(ingredient._id);
        }

        // Create a new Meal document
        const recipe = new Recipe({ recipeName: mealData.recipeName, ingredients, calories: mealData.calories, instructions: mealData.instructions ,user: user._id });
        await recipe.save();

        res.status(200).json({ message: 'Recipe added', recipe});

        // Log the response
        console.log({ message: 'Recipe added', recipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserRecipes = async(req, res) => {
    try {
        //find the recipes of the user
        const recipes = await Recipe.find({ user: req.user._id }).populate('ingredients');
        res.status(200).json({ recipes });

        // Log the response
        console.log({ recipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        await recipe.delete();
        res.status(200).json({ message: 'Recipe deleted' });

        // Log the response
        console.log({ message: 'Recipe deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



export {addRecipe, getUserRecipes, deleteRecipe};