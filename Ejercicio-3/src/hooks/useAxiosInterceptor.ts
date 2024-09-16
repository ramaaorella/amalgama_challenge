import api from "@/services/api/axiosConfig";
import { useLayoutEffect } from "react";

import { InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@/services/providers/AuthProvider";

const useAxiosInterceptor = () => {
  const { token } = useAuth();

  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.Authorization = token
          ? `Bearer ${token}`
          : config.headers.Authorization;

        if (config.method === "post" || config.method === "put") {
          config.headers["Content-Type"] = "application/x-www-form-urlencoded";

          if (config.data && typeof config.data === "object") {
            const params = new URLSearchParams();
            Object.keys(config.data).forEach((key) => {
              params.append(key, config.data[key]);
            });
            config.data = params;
          }
        }

        return config;
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);
};

export default useAxiosInterceptor;
