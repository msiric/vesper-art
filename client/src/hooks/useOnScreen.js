import { useEffect, useState } from "react";

const useOnScreen = (ref, shouldStop) => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
      if (shouldStop) {
        observer.unobserve(ref.current);
      }
    }
    return () => {
      observer.disconnect();
    };
  }, [ref.current, shouldStop]);

  return isIntersecting;
};

export default useOnScreen;
