import CONFIG from '../config.js';

const searchAllItems =  async (query) => {
    try {
        const response = await fetch(`${CONFIG.BASE_URL}/api/search/all`, {
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
