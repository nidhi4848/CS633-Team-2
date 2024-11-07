const loginUser = async (email, password) => {
    if(!email || !password){
        throw Error('All fields are required');
    }

    console.log(1);

    const res = await fetch('https://long-symbols-clean.loca.lt/api/users/login', {
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

export { loginUser };