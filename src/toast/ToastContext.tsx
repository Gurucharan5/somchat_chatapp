import { createContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info" | "default";

export interface ToastOptions {
  duration?: number;
  type?: ToastType;
}


export type ToastContextType = {
  showToast: (message: string, options?: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});
