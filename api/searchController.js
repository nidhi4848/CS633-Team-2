import CONFIG from '../config.js';

const searchAllItems = async (query = '') => {
    const API_URL = `${CONFIG.BASE_URL}/api/search/all`;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorMessage = `Failed to fetch items: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching items:', error.message || error);
        return [];
    }
};


const searchOneItem =  async (query) => {
    try {
        const response = await fetch(`${CONFIG.BASE_URL}/api/search/one`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        });

        if (!response.ok) {
        throw new Error('Failed to fetch items');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching items:', error);
        return [];
    }
}

export { searchAllItems, searchOneItem };
