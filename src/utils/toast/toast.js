import { toast } from "react-toastify";
import {useCallback, useMemo} from "react";

const defaultOptions = {
  position: "top-center",
  autoClose: 3000,
  theme: "colored",
  closeOnClick: true
};

export const useToast = () => {
  const success = useCallback((content, options = {}) => {
    toast.success(content, { ...defaultOptions, ...options });
  }, []);

  const error = useCallback((content, options = {}) => {
    toast.error(content, { ...defaultOptions, ...options });
  }, []);

  const info = useCallback((content, options = {}) => {
    toast.info(content, { ...defaultOptions, ...options });
  }, []);

  const warn = useCallback((content, options = {}) => {
    toast.warn(content, { ...defaultOptions, ...options });
  }, []);

  const warning = useCallback((content, options = {}) => {
    toast.warning(content, { ...defaultOptions, ...options });
  }, []);

  return useMemo(() => ({
    success,
    error,
    info,
    warn,
    warning,
  }), [success, error, info, warn, warning]);
};
