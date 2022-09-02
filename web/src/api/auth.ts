import axiosInstance from "./instances/axiosInstance";

export const registerUser = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return axiosInstance.post("/base/auth/register", { name, email, password });
};

export const loginUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return axiosInstance.post("/base/auth/login", { email, password });
};

export const logoutUser = () => {
  return axiosInstance.post("/base/auth/logout");
};

export const forgotPassword = ({ email }: { email: string }) => {
  return axiosInstance.post("/base/auth/forgotPassword", { email });
};

export const resetPassword = ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return axiosInstance.post("/auth/resetPassword", { token, password });
};

export const changeEmail = ({
  password,
  newEmail,
}: {
  password: string;
  newEmail: string;
}) => {
  return axiosInstance.post("/auth/changeEmail", { newEmail, password });
};

export const changePassword = ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  return axiosInstance.post("/auth/changePassword", {
    oldPassword,
    newPassword,
  });
};
