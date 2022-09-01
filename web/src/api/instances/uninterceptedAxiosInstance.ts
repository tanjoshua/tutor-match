import axios from "axios";
const baseURL = "http://localhost:8000/api";

const uninterceptedAxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default uninterceptedAxiosInstance;
