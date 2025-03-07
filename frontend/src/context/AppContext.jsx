import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedin(true);
                console.log('Auth successful, fetching user data...');
                await getUserData();
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Handle 401 Unauthorized error gracefully
                setIsLoggedin(false);
                setUserData(null);
            } else {
                toast.error(error.message || 'An error occurred');
            }
        } finally {
            setLoading(false); // Set loading to false after auth check
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
    
            console.log("Raw API response:", data);
    
            if (data.success && data.user) { 
                console.log('User data fetched successfully:', data.user);
                setUserData(data.user); 
                setIsLoggedin(true);
            } else {
                console.log("User data is missing from response.");
                toast.error(data.message || "Failed to retrieve user data.");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
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
        loading, // Add loading to context value
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};