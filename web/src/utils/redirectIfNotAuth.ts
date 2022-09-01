import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import urlNextify from "./urlNextify";

const redirectIfNotAuth = () => {
  const router = useRouter();
  const { data, error } = useSWR("/base/user/me", fetcher);

  if (data && !data.user) {
    router.replace(`/base/auth/login${urlNextify(router.asPath)}`);
  }
};

export default redirectIfNotAuth;
