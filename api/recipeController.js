import CONFIG from '../config.js';

const addRecipe = async (mealData, token) => {
    try {

        // Make the API call
        const res = await fetch(`${CONFIG.BASE_URL}/api/recipe/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`, // Include the token in the headers
            },
            body: JSON.stringify({
                mealData: mealData, // The meal data to be added
            }),
        });

        // Check if the response status is okay
        if (!res.ok) {
            // Parse error message from the response
            const errorData = await res.json();
            console.error(`Error from server: ${errorData.error}`);
            throw new Error(errorData.error || 'Something went wrong. Please try again.');
        }

        // Parse the response JSON
        const data = await res.json();
        return data;

    } catch (error) {
        // Log the error for debugging
        console.error('Error in addRecipe:', error.message);

        // Rethrow the error to allow calling functions to handle it further if needed
        throw new Error(
            error.message || 'Unable to add recipe. Please try again later.'
        );
    }
};


const getUserRecipes = async (token) => {
    try {
        // Make the API call
        const res = await fetch(`${CONFIG.BASE_URL}/api/recipe/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`, // Include the token in the headers
            }
        });

        // Check if the response status is okay
        if (!res.ok) {
            // Parse error message from the response
            const errorData = await res.json();
            console.error(`Error from server: ${errorData.error}`);
            throw new Error(errorData.error || 'Something went wrong. Please try again.');
        }

        // Parse the response JSON
        const data = await res.json();
        return data;

    } catch (error) {
        // Log the error for debugging
        console.error('Error in getUserRecipes:', error.message);

        // Rethrow the error to allow calling functions to handle it further if needed
        throw new Error(
            error.message || 'Unable to get recipes. Please try again later.'
        );
    }
};

const deleteRecipe = async (recipeId, token) => {
    try {
        // Make the API call
        const res = await fetch(`${CONFIG.BASE_URL}/api/recipe/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`, // Include the token in the headers
            }
        });

        // Check if the response status is okay
        if (!res.ok) {
            // Parse error message from the response
            const errorData = await res.json();
            console.error(`Error from server: ${errorData.error}`);
            throw new Error(errorData.error || 'Something went wrong. Please try again.');
        }

        // Parse the response JSON
        const data = await res.json();
        return data;

    } catch (error) {
        // Log the error for debugging
        console.error('Error in deleteRecipe:', error.message);

        // Rethrow the error to allow calling functions to handle it further if needed
        throw new Error(
            error.message || 'Unable to delete recipe. Please try again later.'
        );
    }
}



export { addRecipe, getUserRecipes, deleteRecipe };
