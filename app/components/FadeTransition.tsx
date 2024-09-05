import { useState, useEffect, ReactNode } from "react";

type FadeTransitionProps = {
  children: ReactNode;
  trigger: string;
};

const FadeTransition: React.FC<FadeTransitionProps> = ({ children, trigger }) => {
  const [fade, setFade] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);

  useEffect(() => {
    // Start fade-out when trigger changes
    setFade(false);

    // Set a timeout to wait for fade-out to complete before changing the content
    const timeoutId = setTimeout(() => {
      setCurrentChildren(children);
      setFade(true); // Start fade-in after content changes
    }, 300); // This should match the duration of the fade-out

    return () => clearTimeout(timeoutId);
  }, [trigger, children]);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${fade ? "opacity-100" : "opacity-0"}`}
    >
      {currentChildren}
    </div>
  );
};

export default FadeTransition;
