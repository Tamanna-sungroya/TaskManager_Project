import React, { useContext, useEffect, useState } from 'react';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
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
                    // 1. Upload image
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                        const uploadRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        const imageUrl = uploadRes.data.imageUrl;
                        // 2. Update user profile
                        await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, { profileImageUrl: imageUrl });
                        window.location.reload(); // reload to update context/profile
                    } catch (err) {
                        alert('Failed to update profile image');
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