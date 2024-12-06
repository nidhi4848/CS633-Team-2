import CONFIG from '../config.js';

const checkIfDayAvailable = async (date, token) => {
    try {
        // Log the API call for debugging purposes
        console.log(`Making GET request to: ${CONFIG.BASE_URL}/api/day/${date}`);

        // Make the API call
        const res = await fetch(`${CONFIG.BASE_URL}/api/day/${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`, // Include the token in the headers
            },
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
        console.error('Error in checkIfDayAvailable:', error.message);

        // Rethrow the error to allow calling functions to handle it further if needed
        throw new Error(
            error.message || 'Unable to check day availability. Please try again later.'
        );
    }
};
const addMealToDay = async (date, mealType, mealData, token) => {
    try {
        // Log the API call for debugging purposes
        console.log(`Making POST request to: ${CONFIG.BASE_URL}/api/day/`);

        // Make the API call with the required parameters
        const res = await fetch(`${CONFIG.BASE_URL}/api/day/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`, // Include the token in the headers
            },
            body: JSON.stringify({
                date: date, // The date in YYYY-MM-DD format
                mealType: mealType, // The type of meal (e.g., breakfast, lunch, dinner)
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
        return data; // Return the data (e.g., the updated day object)

    } catch (error) {
        // Log the error for debugging
        console.error('Error in addMealToDay:', error.message);

        // Rethrow the error to allow calling functions to handle it further if needed
        throw new Error(
            error.message || 'Unable to add meal to day. Please try again later.'
        );
    }
}


export { checkIfDayAvailable, addMealToDay };
