"use client";
import { useState, useContext, SetStateAction, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import { MdAddBox } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileDropDown from "./ProfileDropDown";
import { DropdownProvider } from "@/app/context/DropDownContext";
import { motion, useAnimation } from "framer-motion";

const NavBar = ({
  activeButton,
  setActiveButton,
}: {
  activeButton: string;
  setActiveButton: (button: SetStateAction<string>) => void;
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, userDetails } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const [reqOrTest, setreqOrTest] = useState("Request");

  useEffect(() => {
    controls.start({ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 });
  }, [isOpen]);

  const handleButtonClick = (button: SetStateAction<string>) => {
    if (button === "requests") {
      setreqOrTest("Requests");
      setIsOpen(!isOpen);
    }

    if (button === "testimonies") {
      setreqOrTest("Testimony");
      setIsOpen(!isOpen);
    }
    setActiveButton(button);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar bg-blk1 flex justify-between items-center p-4 fixed top-0 left-0 w-full z-50">
      <div className="hidden lg:flex  md:hidden justify-around items-center px-4 py-2 gap-4">
        <Image
          src="/logow.png"
          width={32}
          height={32}
          className="rounded-full"
          alt="Logo"
        />
        <button
          onClick={() => handleButtonClick("requests")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 ${
            activeButton === "requests" ? "bg-purp text-white" : "text-white"
          }`}
        >
          Requests
        </button>

        <button
          onClick={() => handleButtonClick("testimonies")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 ${
            activeButton === "testimonies"
              ? "bg-coral text-white"
              : "text-white"
          }`}
        >
          Testimonies
        </button>
      </div>

      <div className="lg:hidden relative flex items-center justify-between gap-2 text-left">
        {/* <Image
          src="/logow.png"
          width={32}
          height={32}
          className="rounded-full ml-4"
          alt="Logo"
        /> */}
        <div className="relative">
          <button
            onClick={handleToggle}
            className={`inline-flex w-44 items-center justify-between rounded-2xl shadow-sm px-6 py-3  text-base font-medium text-white  transition-colors duration-300` }
          >
            {reqOrTest}
            <RiArrowDropDownLine className="ml-2 h-6 w-6" />
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
              className="absolute left-0 mt-2 w-44 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            >
              <div className="py-4 shadow-md">
                <button
                  onClick={() => handleButtonClick("requests")}
                  className={`${
                    activeButton === "request"
                      ? "bg-purp text-white"
                      : "text-gray-700"
                  } group flex items-center px-4 py-3 text-base w-full text-left hover:bg-purp hover:text-white transition-colors duration-300`}
                >
                  Request
                </button>
                <button
                  onClick={() => handleButtonClick("testimonies")}
                  className={`${
                    activeButton === "testimony"
                      ? "bg-coral text-white"
                      : "text-gray-700"
                  } group flex items-center px-4 py-3 text-base w-full text-left hover:bg-coral hover:text-white transition-colors duration-300`}
                >
                  Testimony
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-around items-center px-4 py-2 gap-4 relative">
        {user && (
          <button
            onClick={() => handleButtonClick("add")}
            className={`flex items-center justify-center  w-[42px] h-[42px] rounded-full transition-colors duration-300 ${
              activeButton === "add" ? "text-purp" : "text-white"
            }`}
          >
            <MdAddBox className="text-2xl" />
          </button>
        )}
        {user && (
          <button
            onClick={() => handleButtonClick("notifications")}
            className={`flex items-center justify-center w-[42px] h-[42px] rounded-full transition-colors duration-300 ${
              activeButton === "notifications" ? "text-purp" : "text-white"
            }`}
          >
            <IoNotifications className="text-2xl" />
          </button>
        )}

        {!user && (
          <button
            onClick={() => handleButtonClick("profile")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 transform ${
              activeButton === "profile"
                ? "bg-white text-blk1"
                : "bg-white text-blk1"
            } hover:bg-gray-200 active:bg-gray-200 active:scale-95`}
          >
            Login
          </button>
        )}

        {user && (
          <button
            onClick={() => handleButtonClick("profile")}
            className={`flex items-center justify-center  rounded-full transition-colors duration-300 ${
              activeButton === "profile" ? "bg-purp text-white" : "text-white"
            }`}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={userDetails?.img || "/dp.png"}
                alt="User DP"
                layout="fill" // Fills the container
                objectFit="cover" // Ensures the image covers the container
                className="rounded-full"
              />
            </div>
          </button>
        )}
        {user && (
          <button
            onClick={handleDropdownToggle}
            className="flex items-center justify-center text-white rounded-full transition-colors duration-300 active:text-purp"
          >
            <RiArrowDropDownLine className="text-3xl" />
          </button>
        )}

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <ProfileDropDown setActiveButton={setActiveButton} />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
