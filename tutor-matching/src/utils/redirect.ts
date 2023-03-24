import { getMe } from "@/services/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const redirectIfNotLoggedIn = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data.user;

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login?next=" + router.asPath);
    }
  }, [isLoading, data, router]);
};

export const redirectIfLoggedIn = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data.user;

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace("/tutor/dashboard");
    }
  }, [isLoading, data, router]);
};
