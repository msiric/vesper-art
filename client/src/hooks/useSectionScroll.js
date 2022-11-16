import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSectionScroll = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));

      setTimeout(() => {
        window.scrollTo({
          behavior: element ? "smooth" : "auto",
          top: element ? element.offsetTop : 0,
        });
      }, 100);
    }
  }, [hash]);

  return null;
};
