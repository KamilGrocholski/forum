import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delayInMs = 300) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounced(value);
    }, delayInMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delayInMs]);

  return debounced;
};

export default useDebounce;
