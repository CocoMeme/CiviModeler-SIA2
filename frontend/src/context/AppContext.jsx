import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUSerData] = useState(null);

    const getAuthState = async () => {
        try {
            axios.defaults.withCredentials = true; // send credentials
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        }
    };

    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.get(backendUrl + '/api/user/data');
            data.success 
                ? setUSerData(data.userData) 
                : toast.error(data.message);
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        getUserData,
        userData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

