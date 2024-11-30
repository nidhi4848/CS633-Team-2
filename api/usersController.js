import CONFIG from '../config.js';

console.log(CONFIG.BASE_URL);

const loginUser = async (email, password) => {
    if(!email || !password){
        throw Error('All fields are required');
    }

    console.log(1);

    const res = await fetch(`${CONFIG.BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    });
    

    const data = await res.json();

    if(!res.ok){
        throw Error(data.error);
    }

    return data;
}

const registerUser = async (email, password, firstName, lastName) => {
    if(!email || !password || !firstName || !lastName){
        throw Error('All fields are required');
    }

    const res = await fetch(`${CONFIG.BASE_URL}/api/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, firstName, lastName})
    });
    

    const data = await res.json();

    if(!res.ok){
        throw Error(data.error);
    }

    return data;
}


const getUserInfo = async() => {
    const res = await fetch(`${CONFIG.BASE_URL}/api/users/info`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    

    const data = await res.json();

    if(!res.ok){
        throw Error(data.error);
    }

    return data;
}



export { loginUser, registerUser };