// DropdownContext.js
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// Create Context
const DropdownContext = createContext();

// Custom hook to use the DropdownContext
export const useDropdown = () => useContext(DropdownContext);

// Provider component
export const DropdownProvider = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        isDropdownOpen,
        toggleDropdown,
        dropdownRef,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};
