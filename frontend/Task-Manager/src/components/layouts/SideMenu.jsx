import React, { useContext, useEffect, useState } from 'react';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';
import toast from 'react-hot-toast';

const SideMenu = ({ activeMenu }) => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);

    const navigate = useNavigate();

    const handleClick = (route) => {
        if(route === "logout"){
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    useEffect(() => {
        if(user){
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
        }
        return () => {};
    }, [user]);

    return <div className="w-64 h-[calc(100vh-61px)] bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-700 sticky top-[61px] z-20">
        <div className="flex flex-col items-center justify-center mb-7 pt-5">
            <ProfilePhotoSelector
                currentImage={user?.profileImageUrl || ''}
                onImageChange={async (file) => {
                    if (!file) return;
                    console.log('=== PROFILE UPLOAD STARTED ===');
                    console.log('File selected:', file.name, file.size);
                    
                    // 1. Upload image
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                        console.log('Uploading image to:', API_PATHS.IMAGE.UPLOAD_IMAGE);
                        const uploadRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const imageUrl = uploadRes.data.imageUrl;
                        console.log('Image uploaded successfully. Server response:', uploadRes.data);
                        console.log('Image URL from server:', imageUrl);
                        console.log('Image URL type:', typeof imageUrl);
                        
                        // 2. Update user profile with the image URL
                        console.log('=== UPDATING PROFILE ===');
                        console.log('Sending profileImageUrl:', imageUrl);
                        const profileRes = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, { profileImageUrl: imageUrl });
                        console.log('Full profile update response:', profileRes.data);
                        console.log('Response status:', profileRes.status);
                        
                        if (profileRes.status === 200) {
                            // Create updated user object with all fields
                            const updatedUser = {
                                ...user,
                                ...profileRes.data,
                                profileImageUrl: imageUrl  // Override with the actual uploaded URL
                            };
                            console.log('=== USER STATE UPDATE ===');
                            console.log('Current user state:', user);
                            console.log('Backend response data:', profileRes.data);
                            console.log('Updated user object to save:', updatedUser);
                            console.log('Updated user profileImageUrl:', updatedUser.profileImageUrl);
                            
                            // Update context (which updates localStorage)
                            updateUser(updatedUser);
                            
                            // VERIFICATION: Fetch profile again to confirm backend has it
                            setTimeout(async () => {
                                try {
                                    console.log('=== VERIFICATION: Fetching profile again ===');
                                    const verifyRes = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                                    console.log('Verification fetch response:', verifyRes.data);
                                    console.log('Verification profileImageUrl:', verifyRes.data?.profileImageUrl);
                                    if (verifyRes.data?.profileImageUrl === imageUrl) {
                                        console.log('✓ VERIFIED: Backend has correct profileImageUrl');
                                    } else {
                                        console.error('✗ MISMATCH: Backend profileImageUrl is different!');
                                        console.error('Expected:', imageUrl);
                                        console.error('Got:', verifyRes.data?.profileImageUrl);
                                    }
                                } catch (verifyErr) {
                                    console.error('Verification fetch failed:', verifyErr);
                                }
                            }, 1000);
                            
                            // Verify immediately after update
                            setTimeout(() => {
                                const cachedData = localStorage.getItem('userData');
                                console.log('=== IMMEDIATE VERIFICATION ===');
                                console.log('localStorage userData:', cachedData);
                                if (cachedData) {
                                    const parsed = JSON.parse(cachedData);
                                    console.log('Parsed userData:', parsed);
                                    console.log('Cached profileImageUrl:', parsed?.profileImageUrl);
                                }
                            }, 100);
                            
                            toast.success('Profile image updated successfully!');
                        } else {
                            console.error('Profile update failed with status:', profileRes.status);
                            toast.error('Failed to update profile: Server error');
                        }
                    } catch (err) {
                        console.error('=== PROFILE UPLOAD ERROR ===');
                        console.error('Error:', err.message);
                        console.error('Error response:', err.response?.data);
                        console.error('Error status:', err.response?.status);
                        toast.error('Failed to update profile image: ' + (err.response?.data?.message || err.message));
                    }
                }}
            />

            {user?.role === "admin" && (
                <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
                    Admin
                </div>
            )}

            <h5 className="text-gray-950 dark:text-white font-medium leading-6 mt-3">
                {user?.name || ""}
            </h5>

            <p className="text-[12px] text-gray-500 dark:text-gray-400">
                {user?.email || ""}
            </p>
        </div>

        {sideMenuData.map((item, index) => (
            <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] text-gray-700 dark:text-gray-200 ${
                activeMenu == item.label 
                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3" 
                : ""
            } py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(item.path)}
            >
                <item.icon className="text-xl" />
                {item.label}
            </button>
        ))}
    </div>
};

export default SideMenu;