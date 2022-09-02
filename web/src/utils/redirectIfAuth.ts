import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "../api/fetcher";

const redirectIfAuth = () => {
  const router = useRouter();
  const { data, error } = useSWR("/base/user/me", fetcher);

  if (data && data.user) {
    if (typeof router.query.next == "string" && router.query.next) {
      router.push(router.query.next);
    } else {
      router.replace("/");
    }
  }
};

export default redirectIfAuth;
