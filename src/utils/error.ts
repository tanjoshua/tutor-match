export const getErrorMessage = (error: any, defaultMessage?: string) => {
  return error?.response?.data?.message || defaultMessage || "Error occurred";
};
