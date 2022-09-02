import axiosInstance from "./instances/uninterceptedAxiosInstance";
export const getCurrentUser = () => {
  return axiosInstance.get("/base/user/me");
};
