import CONFIG from '../config.js';

// Get Pantry Items for the User
const getUserPantry = async (token) => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/pantry`, {
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

// Add Ingredient to the User's Pantry
const addItemToPantry = async (item, token) => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/pantry/addIngredient`, {
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

// Delete Ingredient from the User's Pantry
const deleteFromPantry = async (ingredientId, token) => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/pantry/deleteIngredient`, {
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

export { getUserPantry, addItemToPantry, deleteFromPantry };
