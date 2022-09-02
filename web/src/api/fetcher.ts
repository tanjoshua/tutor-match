import uninterceptedAxiosInstance from "./instances/uninterceptedAxiosInstance";

export const fetcher = (url) =>
  uninterceptedAxiosInstance(url).then((res) => res.data);
