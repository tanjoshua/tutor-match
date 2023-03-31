import { getUserTutorProfile } from "@/services/tutor";
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
      router.replace("/tutor/your-profile");
    }
  }, [isLoading, data, router]);
};

export const redirectIfNoTutorProfile = () => {
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  const isLoggedIn = !isLoading && !!data.user;
  const {
    isLoading: profileIsLoading,
    error: profileError,
    data: profileData,
    refetch: profileRefetch,
  } = useQuery("userTutorProfile", getUserTutorProfile);
  useEffect(() => {
    if (!isLoading && isLoggedIn && !profileIsLoading && !profileData.profile) {
      router.replace("/tutor/your-profile");
    }
  }, [isLoggedIn, profileIsLoading, profileData, router]);
};
