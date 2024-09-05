"use client";

import React, {
  ReactElement,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.memo(
  ({ className, children, delay = 1000 }: AnimatedListProps) => {
    const [items, setItems] = useState<React.ReactNode[]>([]);
    const prevChildrenRef = useRef<React.ReactNode[]>([]);

    useEffect(() => {
      const newItems = React.Children.toArray(children);
      if (newItems.length > prevChildrenRef.current.length) {
        // Only add new items to state if there are more items
        setItems(newItems);
      }
      prevChildrenRef.current = newItems;
    }, [children]);

    

    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AnimatePresence>
          {items
            .slice() // Create a shallow copy to avoid mutating the original array
            
            .map((item, index) => (
              <AnimatedListItem key={index}>{item}</AnimatedListItem>
            ))}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  };

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  );
}
