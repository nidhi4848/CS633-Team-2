import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    token: string;
}

const useUser = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Failed to load user data', error);
            }
        };

        loadUser();
    }, []);

    const saveUser = async (user: User) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } catch (error) {
            console.error('Failed to save user data', error);
        }
    };

    const clearUser = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Failed to clear user data', error);
        }
    };

    return {
        user,
        saveUser,
        clearUser,
    };
};

export default useUser;