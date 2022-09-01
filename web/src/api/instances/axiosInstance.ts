import axios from "axios";
const baseURL = "http://localhost:8000/api";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

// If user is not logged in and an axios request is made,
// this interceptor will redirect the user to the login page
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
