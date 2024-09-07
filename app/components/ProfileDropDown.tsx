'use client';
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/context/AuthContext";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { auth } from "../firebase/config";
import { motion } from "framer-motion";
import { FiEdit } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { SlSettings } from "react-icons/sl";
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const ProfileDropDown = () => {
  const { user, userDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
  const router = useRouter(); // Initialize the useRouter hook

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    
      // Optionally, handle navigation or state reset here
      router.push('/requests'); // Redirect to the login page or home page
      setShowDropdown(false); // Hide dropdown on logout
    } catch (error) {
      console.error("Error logging out: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
   
    setShowDropdown(false); // Optionally close dropdown
    router.push('/edit/profile'); // Navigate to the edit profile page
  };

  const handleSettings = () => {
    
    setShowDropdown(false);
    router.push('/settings'); // Navigate to the settings page
  };

  useEffect(() => {
    if (!user) {
      setShowDropdown(false); // Ensure dropdown is hidden if user logs out
    }
  }, [user]);

  // console.log(userDetails);

  // Render nothing if loading or userDetails are not available
  if (loading || !showDropdown) return null;

  return (
    user && (
      <motion.div
        className="absolute bg-white py-4 rounded-2xl w-60 lg:w-80 top-full right-4 mt-2 bg-blk1 shadow-md z-40"
        initial={{
          scale: 0,
          opacity: 0,
          x: 100, // Move from right
          y: -200, // Move from above
        }}
        animate={{
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
        }}
        exit={{
          scale: 0,
          opacity: 0,
          x: 50, // Move back to right
          y: -50, // Move back above
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 40,
        }}
      >
        <div className="text-center items-center flex flex-col">
          {userDetails?.img && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={userDetails?.img || "/dp.png"}
                alt="User DP"
                layout="fill" // Fills the container
                objectFit="cover" // Ensures the image covers the container
                className="rounded-full"
              />
            </div>
          )}
          <h2 className="relative text-center text-blk1 text-xl  font-semibold mb-2 mt-4">
            {userDetails?.displayName || "User"}
          </h2>
          {userDetails?.isUserId && (
            <p className="text-center text-gray-300 text-sm font-semibold mb-4">
              @{userDetails?.userID}
            </p>
          )}

          <div className="flex w-full flex-col items-center px-4 ">
            <button
              onClick={handleEditProfile}
              className="w-full text-blk1 rounded-2xl p-2 py-4 hover:bg-gray-100 hover:text-purp mb-2 flex items-center justify-start gap-2"
            >
              <FiEdit className="size-5 mb-1" />
              Edit Profile
            </button>
            <button
              onClick={handleSettings}
              className="w-full text-blk1 rounded-2xl p-2 py-4 hover:bg-gray-100 hover:text-purp mb-2 flex items-center justify-start gap-2"
            >
              <SlSettings className="size-5" />
              Settings
            </button>

            <div className="border-[1px] w-full border-gray-100 mb-2"></div>

            <button
              onClick={handleLogout}
              className="w-full text-blk1 rounded-2xl p-2 py-4  hover:bg-gray-100 hover:text-purp flex items-center justify-start gap-2"
            >
              <FiLogOut className="size-5 mb-1" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default ProfileDropDown;
