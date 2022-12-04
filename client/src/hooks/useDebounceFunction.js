import { useRef } from "react";

export const useDebounceFunction = (fn, delay) => {
  const timeout = useRef(null);

  const debounced = (...args) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => fn(...args), delay);
  };

  return debounced;
};
