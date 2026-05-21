import React from 'react'
import UI_IMG from "../../assets/images/auth-img.png";

const AuthLayout = ({ children }) => {
  return <div className='flex bg-white dark:bg-gray-900 min-h-screen'>
    <div className="w-full h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black dark:text-white">TASKFORGE</h2>
        {children}
    </div>
    <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 dark:bg-gray-800 overflow-hidden">
        <img src={UI_IMG} className="w-full h-full object-cover" />
    </div>
  </div>
};

export default AuthLayout;