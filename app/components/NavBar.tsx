"use client";
import { useState, useContext, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import { MdAddBox } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileDropDown from "./ProfileDropDown";
import { motion, useAnimation } from "framer-motion";
import { useRouter, usePathname } from "next/navigation"; // Updated imports

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, userDetails } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const [reqOrTest, setReqOrTest] = useState("Requests");
  const [mounted, setMounted] = useState(false); // State to track if component is mounted
  const router = useRouter();
  const pathname = usePathname(); // Use pathname hook

  // Only set mounted to true once the component has mounted
  useEffect(() => {
    setMounted(true);
    controls.start({ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 });
  }, [isOpen, controls]);

  useEffect(() => {
    if (pathname === "/requests") {
      setReqOrTest("Requests");
    }
    if (pathname === "/testimonies") {
      setReqOrTest("Testimonies");
    }
  }, [pathname]);

  const handleNavigation = (path: string) => {
    if (mounted) {
      router.push(path); 
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar bg-blk1 text-sm lg:text-base flex justify-between items-center p-4 fixed top-0 left-0 w-full z-50">
      <div className="hidden lg:flex md:hidden justify-around items-center px-4 py-2 gap-4">
        <Image
          src="/logow.png"
          width={32}
          height={32}
          className="rounded-full"
          alt="Logo"
          onClick={() => handleNavigation("/")} // Navigate to home
        />
        <button
          onClick={() => handleNavigation("/requests")} // Route to requests page
          className={`flex text-xs lg:text-base items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 ${
            pathname === "/requests" ? "bg-purp text-white" : "text-white"
          }`}
        >
          Requests
        </button>

        <button
          onClick={() => handleNavigation("/testimonies")} // Route to testimonies page
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 ${
            pathname === "/testimonies" ? "bg-coral text-white" : "text-white"
          }`}
        >
          Testimonies
        </button>
      </div>

      <div className="lg:hidden text-sm lg:text-base relative flex items-center justify-between gap-2 text-left">
        <div className="relative">
          <button
            onClick={handleToggle}
            className={`inline-flex w-44 items-center justify-between rounded-2xl shadow-sm px-6 py-3  font-medium text-white  transition-colors duration-300`}
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
                  onClick={() => handleNavigation("/requests")}
                  className={`${
                    pathname === "/requests"
                      ? "bg-purp text-white"
                      : "text-gray-700"
                  } group flex items-center px-4 py-3  w-full text-left hover:bg-purp hover:text-white transition-colors duration-300`}
                >
                  Requests
                </button>
                <button
                  onClick={() => handleNavigation("/testimonies")}
                  className={`${
                    pathname === "/testimonies"
                      ? "bg-coral text-white"
                      : "text-gray-700"
                  } group flex items-center px-4 py-3  w-full text-left hover:bg-coral hover:text-white transition-colors duration-300`}
                >
                  Testimonies
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-around items-center px-4 py-2 gap-4 relative">
        {user && userDetails?.isUserId && (
          <button
            onClick={() => handleNavigation("/post")}
            className={`flex items-center justify-center  w-[42px] h-[42px] rounded-full transition-colors duration-300 ${
              pathname === "/post" ? "text-purp" : "text-white"
            }`}
          >
            <MdAddBox className="text-2xl" />
          </button>
        )}
        {user && userDetails?.isUserId && (
          <button
            onClick={() => handleNavigation("/notifications")}
            className={`flex items-center justify-center w-[42px] h-[42px] rounded-full transition-colors duration-300 ${
              pathname === "/notifications" ? "text-purp" : "text-white"
            }`}
          >
            <IoNotifications className="text-2xl" />
          </button>
        )}

        {!user && (
          <button
            onClick={() => handleNavigation("/login")}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 transform ${
              pathname === "/profile"
                ? "bg-white text-blk1"
                : "bg-white text-blk1"
            } hover:bg-gray-200 active:bg-gray-200 active:scale-95`}
          >
            Login
          </button>
        )}

        {user && (
          <button
            onClick={() => handleNavigation("/profile/" + userDetails?.uid)}
            className={`flex items-center justify-center  rounded-full transition-colors duration-300 ${
              pathname === "/profile" + userDetails?.uid ? "bg-purp text-white" : "text-white"
            }`}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={userDetails?.img || "/dp.png"}
                alt="User DP"
                layout="fill"
                objectFit="cover"
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
        {isDropdownOpen && <ProfileDropDown />}
      </div>
    </nav>
  );
};

export default NavBar;
