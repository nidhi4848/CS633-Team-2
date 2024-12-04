import CONFIG from '../config.js';

// Get Fridge Items for the User
const getUserFridge = async (token) => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/fridge`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw Error(data.error);
    }

    return data;
}

// Add Ingredient to the User's Fridge
const addItemToFridge = async (item, token) => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/fridge/addIngredient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            foodName: item.foodName,  // Send individual fields instead of the full object
            quantity: item.quantity,
            calories: item.calories,
        })
    });

    const data = await res.json();

    if (!res.ok) {
        throw Error(data.error);
    }

    return data;
}

// Delete Ingredient from the User's Fridge
const deleteFromFridge = async (ingredientId, token) => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/fridge/deleteIngredient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            ingredientId: ingredientId  // Pass only the ingredientId for deletion
        })
    });

    const data = await res.json();

    if (!res.ok) {
        throw Error(data.error);
    }

    return data;
}

export { getUserFridge, addItemToFridge, deleteFromFridge };
