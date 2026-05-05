import React, { useRef, useState } from 'react';
import { LuUser, LuUpload } from "react-icons/lu";

const ProfilePhotoSelector = ({ currentImage, onImageChange }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            onImageChange(file);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className="flex justify-center mb-6">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
                <img
                    src={previewUrl || currentImage || ''}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover bg-blue-100/50"
                />
                <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                    onClick={onChooseFile}
                >
                    <LuUpload />
                </button>
            </div>
        </div>
    );
};

export default ProfilePhotoSelector;