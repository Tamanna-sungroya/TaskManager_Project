import React, { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from './SideMenu';
import ThemeToggle from '../ThemeToggle';

const Navbar = ({activeMenu}) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    return (
        <div className="flex gap-5 items-center bg-white dark:bg-gray-900 border border-b border-gray-200/50 dark:border-gray-800 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
            <button
            className="block lg:hidden text-black"
            onClick={() => {
                setOpenSideMenu(!openSideMenu);
            }}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>

          <h2 className="text-lg font-semibold text-black dark:text-white">
  TASKFORGE
  <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
    Collaborate, Create, Conquer Together
  </span>
</h2>
            <div className="ml-auto">
                <ThemeToggle />
            </div>

            {openSideMenu && (
                <div className="fixed top-[61px] -ml-4 bg-white">
                    <SideMenu activeMenu={activeMenu} />
                </div>
            )}
        </div>
    );
};

export default Navbar;