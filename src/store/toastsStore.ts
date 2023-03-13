import { create } from "zustand";

export type ToastId =
  | "post-like-success"
  | "post-like-error"
  | "thread-rate-success"
  | "thread-rate-error"
  | "thread-create-success"
  | "thread-create-error"
  | "post-report-success"
  | "post-report-error"
  | "post-create-success"
  | "post-create-error"
  | 'post-edit-success'
  | 'post-edit-error';

interface ToastStore {
  toasts: Set<ToastId>;
  push: (id: ToastId) => void;
  close: (id: ToastId) => void;
  clear: () => void;
}

export const toastsStore = create<ToastStore>((set, get) => ({
  toasts: new Set(),

  push: (id) =>
    set((state) => {
      const newToasts = new Set(state.toasts);
      newToasts.add(id);
      return {
        ...state,
        toasts: newToasts,
      };
    }),

  close: (id) =>
    set((state) => {
      const newToasts = new Set(state.toasts);
      newToasts.delete(id);
      return {
        ...state,
        toasts: newToasts,
      };
    }),

  clear: () =>
    set((state) => {
      return {
        ...state,
        toasts: new Set(),
      };
    }),
}));
