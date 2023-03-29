import instance from "./axiosInstance";

export const register = ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return instance.post("/base/auth/register", { name, email, password });
};

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return instance.post("/base/auth/login", { email, password });
};

export const googleLogin = ({ credential }: { credential: string }) => {
  return instance.post("/base/auth/googleLogin", { credential });
};

export const googleRegister = ({ credential }: { credential: string }) => {
  return instance.post("/base/auth/googleRegister", { credential });
};

export const logout = async () => {
  return instance.post("/base/auth/logout");
};

export const forgotPassword = ({ email }: { email: string }) => {
  return instance.post("/base/auth/forgotPassword", { email });
};

export const resetPassword = ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return instance.post("/base/auth/resetPassword", { token, password });
};

export const changeEmail = ({
  password,
  newEmail,
}: {
  password: string;
  newEmail: string;
}) => {
  return instance.post("/base/auth/changeEmail", { newEmail, password });
};

export const changePassword = ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  return instance.post("/base/auth/changePassword", {
    oldPassword,
    newPassword,
  });
};
