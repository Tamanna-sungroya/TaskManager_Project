import React, { useRef, useState } from 'react';
import { LuUser, LuUpload } from "react-icons/lu";

const ProfilePhotoSelector = ({ currentImage, onImageChange }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    React.useEffect(() => {
        console.log('📸 ProfilePhotoSelector received currentImage:', currentImage);
        console.log('📸 currentImage type:', typeof currentImage);
        console.log('📸 currentImage length:', currentImage?.length);
        console.log('📸 previewUrl:', previewUrl);
    }, [currentImage, previewUrl]);

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
                {previewUrl || currentImage ? (
                    <img
                        src={previewUrl || currentImage}
                        alt="profile"
                        className="w-20 h-20 rounded-full object-cover bg-blue-100/50"
                        onError={(e) => {
                            console.error('❌ Image failed to load:', previewUrl || currentImage);
                            console.error('Image error event:', e);
                        }}
                        onLoad={() => {
                            console.log('✅ Image loaded successfully:', previewUrl || currentImage);
                        }}
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-100/60 flex items-center justify-center">
                        <LuUser className="text-slate-500 text-xl" />
                    </div>
                )}
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