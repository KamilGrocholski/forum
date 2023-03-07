import { type ToastId, toastsStore } from "../../../store/toastsStore";
import { shallow } from "zustand/shallow";
import clsx from "clsx";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { GrFormClose } from "react-icons/gr";

export type ToastProps = {
  id: ToastId;
  duration?: number;
  variant: keyof typeof VARIANT;
  children: React.ReactNode;
};

const Toast: React.FC<ToastProps> = ({
  id,
  duration = 3000,
  variant,
  children,
}) => {
  const { toasts, close } = toastsStore(
    (store) => ({
      toasts: store.toasts,
      close: store.close,
    }),
    shallow
  );

  const shouldRender = toasts.has(id);

  useEffect(() => {
    if (!shouldRender) return;

    const timeoutId = setTimeout(() => {
      close(id);
    }, duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [close, duration, id, shouldRender]);

  if (!shouldRender) return null;

  return createPortal(
    <AnimatePresence>
      {shouldRender ? (
        <motion.div
          key={id}
          layout
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.5,
            transition: { duration: 0.5 },
          }}
          className={clsx(
            "flex w-64 flex-row items-center justify-between gap-1 rounded p-3 shadow-2xl shadow-black",
            VARIANT[variant]
          )}
        >
          {children}
          <button
            onClick={() => close(id)}
            className="h-fit w-fit rounded p-1 hover:bg-red-900"
          >
            <GrFormClose />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.getElementById("toasts-portal") as HTMLElement
  );
};

const VARIANT = {
  error: "bg-red-500 text-red-200",
  warning: "bg-yellow-500 text-yellow-200",
  info: "bg-blue-500 text-blue-200",
  success: "bg-green-500 text-green-200",
} as const;

export default Toast;
