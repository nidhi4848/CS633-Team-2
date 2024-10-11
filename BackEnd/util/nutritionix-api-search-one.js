import 'dotenv/config.js';
import fetch from 'node-fetch';

const getOneItem = async (query) => {
    if (!query) {
        throw Error('Query is required');
    }
    
    const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': process.env.NUTRITIONIX_APP_ID,
            'x-app-key': process.env.NUTRITIONIX_API_KEY,
        },
        body: JSON.stringify({ query: query }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error('API Error:', data);
        throw Error(data.message || 'Failed to fetch nutrition info');
    }

    if (data.foods && data.foods.length > 0) {
        console.log('Fetched food data:', data.foods[0]);
        return data.foods; // Return the first food item
    } else {
        console.log('No food data found');
        return null; // Return null if no results found
    }
};

export { getOneItem };