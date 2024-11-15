const searchAllItems = async (query) => {

    const res = await fetch(`${BACKEND_URL}/api/search/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query})
    });

    const data = await res.json();

    if(!res.ok){
        throw Error(data.error);
    }

    return data;
}