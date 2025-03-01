import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    // const getAuthState = async () => {
    //     try {
            
    //         const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
    //         if (data.success) {
    //             setIsLoggedin(true);
    //             getUserData();
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.status === 401) {
    //             setIsLoggedin(false);
    //             setUserData(null);
    //         } else {
    //             toast.error(error.message || 'An error occurred');
    //         }
    //     }
    // };
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`); // Fixed route
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setIsLoggedin(false);
                setUserData(null);
            } else {
                toast.error(error.message || 'An error occurred');
            }
        }
    };

    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true;  // Ensure cookies are included
    
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                withCredentials: true,  // Explicitly include cookies
            });
    
            if (data.success) {
                setUserData(data.userData);
                setIsLoggedin(true); // Set isLoggedin to true
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
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
        setUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
