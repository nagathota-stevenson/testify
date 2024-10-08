// NavBar.js
"use client";
import { useState, useContext, useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import { MdAddBox } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import ProfileDropDown from "./ProfileDropDown";
import { motion, useAnimation } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useNotifications } from "@/app/context/NotificationContext";

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, userDetails } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimation();
  const [reqOrTest, setReqOrTest] = useState("Requests");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { newNotificationsCount, setNewNotificationsCount } =
    useNotifications();

  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

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
    <nav
      className="navbar bg-blk1 text-sm lg:text-base flex justify-between items-center p-4 fixed top-0 left-0 w-full z-50"
      aria-label="Main navigation"
    >
      <div className="hidden lg:flex md:hidden justify-around items-center px-4 py-2 gap-4">
        <Image
          src="/logow.png"
          width={32}
          height={32}
          className="rounded-full"
          alt="Website logo"
          onClick={() => handleNavigation("/")}
        />
        <button
          onClick={() => handleNavigation("/requests")}
          className={`flex text-xs lg:text-base items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 ${
            pathname === "/requests" ? "bg-purp text-white" : "text-white"
          }`}
          aria-label="Requests page"
        >
          Requests
        </button>
        <button
          onClick={() => handleNavigation("/testimonies")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 ${
            pathname === "/testimonies" ? "bg-coral text-white" : "text-white"
          }`}
          aria-label="Testimonies page"
        >
          Testimonies
        </button>
      </div>

      <div className="lg:hidden text-sm lg:text-base relative flex items-center justify-between gap-2 text-left">
        <div className="relative">
          <button
            onClick={handleToggle}
            className="inline-flex w-44 items-center justify-between rounded-2xl shadow-sm px-6 py-3 font-medium text-white transition-colors duration-300"
            aria-expanded={isOpen}
            aria-controls="navbar-dropdown"
            aria-label="Toggle requests and testimonies menu"
          >
            {reqOrTest}
            <RiArrowDropDownLine className="ml-2 h-6 w-6" />
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
              className="absolute left-0 mt-2 w-44 rounded-2xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              id="navbar-dropdown"
            >
              <div className="py-4 shadow-md">
                <button
                  onClick={() => handleNavigation("/requests")}
                  className={`${
                    pathname === "/requests"
                      ? "bg-purp text-white"
                      : "text-gray-700"
                  } group flex items-center px-4 py-3  w-full text-left hover:bg-purp hover:text-white transition-colors duration-300`}
                  aria-label="Requests page"
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
                  aria-label="Testimonies page"
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
            className={`flex items-center justify-center w-[42px] h-[42px] rounded-full transition-colors duration-300 ${
              pathname === "/post" ? "text-purp" : "text-white"
            }`}
            aria-label="Create new post"
          >
            <MdAddBox className="text-2xl" />
          </button>
        )}
        {user && userDetails?.isUserId && (
          <button
            onClick={() => handleNavigation("/notifications")}
            className={`relative flex items-center justify-center w-[42px] h-[42px] rounded-full transition-colors duration-300 ${
              pathname === "/notifications" ? "text-purp" : "text-white"
            }`}
            aria-label="Notifications"
          >
            <IoNotifications className="text-2xl" />

            {newNotificationsCount > 0 && (
              <motion.div
                {...animations}
                className="absolute -top-[1px] -right-[1px] bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                aria-label={`You have ${newNotificationsCount} new notifications`}
              >
                {newNotificationsCount}
              </motion.div>
            )}
          </button>
        )}

        {!user && (
          <button
            onClick={() => handleNavigation("/login")}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-300 transform bg-white text-blk1 hover:bg-gray-200 active:bg-gray-200 active:scale-95"
            aria-label="Login"
          >
            Login
          </button>
        )}

        {user && (
          <button
            onClick={() => handleNavigation("/profile/" + userDetails?.uid)}
            className={`flex items-center justify-center rounded-full transition-colors duration-300 ${
              pathname === "/profile" + userDetails?.uid
                ? "bg-purp text-white"
                : "text-white"
            }`}
            aria-label="Profile page"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={userDetails?.img || "/dp.png"}
                alt="User profile picture"
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
            aria-label="Profile dropdown"
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
