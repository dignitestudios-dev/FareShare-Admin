import axios from "axios";
import Cookies from "js-cookie";

export const baseUrl = "https://backend.faresharellc.com";

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use((request) => {
  let token = Cookies.get("token");
  request.headers = {
    Accept: "application/json, text/plain, */*",
    Authorization: `Bearer ${token}`,
  };
  return request;
});

instance.interceptors.response.use(
  (response) => {
    if (response) {
      return response;
    }
  },
  function (error) {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.clear();
      Cookies.remove("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default instance;
