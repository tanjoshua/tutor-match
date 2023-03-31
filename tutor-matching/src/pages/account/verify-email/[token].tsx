import App, { NextPageWithLayout } from "../../_app";
import { ReactElement, useEffect, useState } from "react";
import Layout from "../../../components/layouts/Layout";
import { useQuery, useQueryClient } from "react-query";
import { LockClosedIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  closeTutorRequest,
  getTutorApplications,
  updateTutorApplicationState,
} from "@/services/tutorRequest";
import { ApplicationState, RateOptions } from "@/utils/enums";
import Spinner from "@/components/shared/Spinner";
import AppCard from "@/components/tutor-request/AppCard";
import TutorDetailsModal from "@/components/tutor-request/TutorDetailsModal";
import ContactModal from "@/components/tutor-profile/ContactModal";
import CloseRequestModal from "@/components/tutor-request/CloseRequestModal";
import toast from "react-hot-toast";
import { verifyEmailViaToken } from "@/services/auth";

const TutorProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      // process email verification
      verifyEmailViaToken({ token: token as string })
        .then((result) => {
          setSuccess(true);
          toast.success(result.message);
          router.push("/account/details");
        })
        .catch(() => {
          setError(true);
          toast.error("Error verifying");
        });
    }
  }, [token]);

  return (
    <div className="relative px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-20 ">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {!error && !success && <div>Verifying your email</div>}
            {error && <div>Error</div>}
            {success && <div>Email verified</div>}
          </h1>
          <div className="mt-6 text-lg leading-8 text-gray-600">
            {!error && !success && <div>Please be patient</div>}
            {error && <div>Could not verify your email</div>}
            {success && <div>redirecting you shortly</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

TutorProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TutorProfile;
