import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  //New state to track loading

    useEffect(() => {
        console.log('=== UserContext useEffect triggered ===');
        
        const accessToken = localStorage.getItem("token");
        console.log('Token from localStorage:', accessToken ? `${accessToken.substring(0, 20)}...` : 'not found');

        if(!accessToken){
            console.log('No token found, clearing user state');
            setUser(null);
            setLoading(false);
            return;
        }

        // Always try to load cached user data first for immediate display
        const cachedUserData = localStorage.getItem("userData");
        console.log('Cached user data on init:', cachedUserData ? 'found' : 'not found');
        
        if (cachedUserData) {
            try {
                const parsedUserData = JSON.parse(cachedUserData);
                console.log('Parsed cached user data:', parsedUserData);
                console.log('Setting user state with cached data');
                setUser(parsedUserData);
                setLoading(false);
                console.log('User state set, should be available to components');
            } catch (error) {
                console.error("Error parsing cached user data:", error);
                setUser(null);
                setLoading(false);
            }
        } else {
            console.log('No cached data, fetching from backend');
            // Fetch fresh user data from backend to ensure profileImageUrl is current
            const fetchUser = async () => {
                try{
                    console.log('Fetching fresh user data from backend...');
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                    console.log('=== Backend GET_PROFILE response ===');
                    console.log('Full response:', response.data);
                    console.log('Response profileImageUrl:', response.data?.profileImageUrl);
                    console.log('Response keys:', Object.keys(response.data));
                    console.log('Setting user state with backend data');
                    setUser(response.data);
                    const cacheData = JSON.stringify(response.data);
                    localStorage.setItem("userData", cacheData);
                    console.log('Saved to localStorage, verifying:', localStorage.getItem("userData"));
                    console.log('User state set with backend data');
                } catch(error){
                    // If backend fetch fails, try cached data as fallback
                    console.error('=== Failed to fetch from backend ===');
                    console.error('Error:', error.message);
                    console.warn("Checking cache as fallback...");
                    const cachedUserData = localStorage.getItem("userData");
                    console.log('Cached data exists:', !!cachedUserData);
                    if (cachedUserData) {
                        try {
                            const parsedUserData = JSON.parse(cachedUserData);
                            console.log('Using cached user data:', parsedUserData);
                            console.log('Setting user state with cached data');
                            setUser(parsedUserData);
                        } catch (parseError) {
                            console.error("Error parsing cached user data:", parseError);
                            console.log('Setting user state to null due to parse error');
                            setUser(null);
                        }
                    } else {
                        console.log('No cached data available, setting user state to null');
                        setUser(null);
                    }
                } finally{
                    console.log('Setting loading to false');
                    setLoading(false);
                }
            };

            fetchUser();
        }

        // Listen for user update events from other components
        const handleUserUpdate = (event) => {
            console.log('=== USER UPDATE EVENT RECEIVED ===');
            console.log('Event detail:', event.detail);
            console.log('ProfileImageUrl in event:', event.detail?.profileImageUrl);
            
            console.log('Setting user state with event data');
            setUser(event.detail);
            localStorage.setItem("userData", JSON.stringify(event.detail));
            
            // Verify the update was applied
            setTimeout(() => {
                const storedData = localStorage.getItem('userData');
                console.log('=== VERIFICATION: Stored data after update ===');
                console.log('Stored profileImageUrl:', JSON.parse(storedData)?.profileImageUrl);
            }, 500);
        };

        window.addEventListener('userUpdated', handleUserUpdate);

        // Cleanup event listener
        return () => {
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
    }, []);

    const updateUser = (userData) => {
        console.log('updateUser called with:', userData);
        // Ensure profileImageUrl is preserved
        const userDataToSave = {
            ...userData,
            profileImageUrl: userData?.profileImageUrl || user?.profileImageUrl
        };
        setUser(userDataToSave);
        if (userDataToSave.token) {
            localStorage.setItem("token", userDataToSave.token);  //Save token
            console.log('Token saved to localStorage');
        }
        // Always cache user data for offline persistence
        localStorage.setItem("userData", JSON.stringify(userDataToSave));
        console.log('User data saved to localStorage:', userDataToSave);
        console.log('Profile image URL saved:', userDataToSave?.profileImageUrl);
        
        // Emit event to notify other components of user update
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('userUpdated', { detail: userDataToSave }));
        }
        
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
    };

    return (
        <UserContext.Provider value = {{ user, loading, updateUser, clearUser }}>
            { children }
        </UserContext.Provider>
    );
}

export default UserProvider;