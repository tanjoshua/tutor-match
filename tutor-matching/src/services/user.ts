import instance from "./axiosInstance";

export const getMe = async () => {
  const data = await instance.get("/base/user/me");
  return data.data;
};
