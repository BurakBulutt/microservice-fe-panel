import {toast} from "react-toastify";

const defaultOptions = {
  position: "top-center",
  autoClose: 3000,
  theme: "colored",
  closeOnClick: true
};

export const useToast = () => {
  const success = (content, options = {}) => {
    toast.success(content, { ...defaultOptions, ...options });
  };

  const error = (content, options = {}) => {
    toast.error(content, { ...defaultOptions, ...options });
  };

  const info = (content, options = {}) => {
    toast.info(content, { ...defaultOptions, ...options });
  };

  const warning = (content, options = {}) => {
    toast.warning(content, { ...defaultOptions, ...options });
  };

  return {
    success,
    error,
    info,
    warning,
  };
};
