import { useState, useEffect } from "react";

export function useExitIntent() {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  useEffect(() => {
    // Check if exit intent has been shown in this session
    const hasShown = sessionStorage.getItem("exitIntentShown");
    if (hasShown) {
      setHasShownExitIntent(true);
    }

    let isExitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if cursor is moving towards the top of the page
      if (e.clientY <= 0 && !isExitIntentTriggered && !hasShownExitIntent) {
        isExitIntentTriggered = true;
        setHasShownExitIntent(true);
        setShowExitIntent(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Add a small delay to prevent immediate triggering
    let timeoutId: NodeJS.Timeout;
    const handleMouseEnter = () => {
      timeoutId = setTimeout(() => {
        document.addEventListener("mouseleave", handleMouseLeave);
      }, 1000);
    };

    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasShownExitIntent]);

  return {
    showExitIntent,
    setShowExitIntent,
  };
}
