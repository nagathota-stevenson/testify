"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedSubscribeButtonProps {
  buttonColor: string;
  buttonTextColor?: string;
  subscribeStatus: boolean;
  initialText: React.ReactElement | string;
  changeText: React.ReactElement | string;
  onClick: () => void;
}

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  buttonColor,
  subscribeStatus,
  buttonTextColor,
  changeText,
  initialText,
  onClick, // Function passed to handle the button click
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  // Sync the subscribe state when the prop changes (useful for external changes)
  useEffect(() => {
    setIsSubscribed(subscribeStatus);
  }, [subscribeStatus]);

  // Handle click and trigger the external action (subscribe/unsubscribe)
  const handleClick = () => {
    setIsSubscribed(!isSubscribed); // Toggle internal state
    onClick(); // Trigger the external callback function
  };

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          key="subscribed"
          className="relative flex w-[150px] items-center justify-center overflow-hidden rounded-2xl bg-white p-[10px] outline outline-2 outline-black"
          onClick={handleClick} // Call the handler to unsubscribe
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="subscribed-text"
            className="relative block h-full w-full font-normal"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            style={{ color: buttonColor }}
          >
            {changeText}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          key="not-subscribed"
          className="relative flex w-[150px] items-center justify-center overflow-hidden rounded-2xl bg-white p-[10px] outline outline-2 outline-black"
          style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          onClick={handleClick} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="not-subscribed-text"
            className="relative block font-normal"
            initial={{ y: 0 }}
            exit={{ y: 50, transition: { duration: 0.1 } }}
          >
            {initialText}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

