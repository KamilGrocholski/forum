import { useCallback, useState } from "react";

export type Actions<T> = {
  clear: () => void;
  add: (value: T) => void;
  delete: (value: T) => void;
};

const useSet = <T>(
  initialArgs?: T[] | null
): [Omit<Set<T>, "add" | "delete" | "clear">, Actions<T>] => {
  const [set, setSet] = useState<Set<T>>(new Set(initialArgs));

  const actions: Actions<T> = {
    clear: useCallback(() => {
      setSet(new Set());
    }, []),
    add: useCallback((value) => {
      const copy = new Set(set);
      copy.add(value);
      setSet(copy);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    delete: useCallback((value) => {
      const copy = new Set(set);
      copy.delete(value);
      setSet(copy);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  };

  return [set, actions];
};

export default useSet;
