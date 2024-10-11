import 'dotenv/config.js';
import fetch from 'node-fetch';

const getAllItems = async (query) => {
    if (!query) {
        throw Error('Query is required');
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodedQuery}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'x-app-id': process.env.NUTRITIONIX_APP_ID,
            'x-app-key': process.env.NUTRITIONIX_API_KEY,
        }
    });

    const data = await res.json();

    if (!res.ok) {
        throw Error(data.message || 'Failed to fetch nutrition info');
    }

    if (data.common && data.common.length > 0) {
        console.log(data.common);
        return data.common; // Return all common food items
    } else {
        return []; // Return an empty array if no results found
    }
};

export { getAllItems };