import Head from "next/head";
import { NextPageWithLayout } from "./../_app";
import { ReactElement } from "react";
import Layout from "../../components/layouts/Layout";
import { redirectIfNotLoggedIn } from "@/utils/redirect";
import { useQuery } from "react-query";
import { getMe } from "@/services/user";
import Spinner from "@/components/shared/Spinner";
import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { requestEmailVerification } from "@/services/auth";
import { toast } from "react-hot-toast";
import Link from "next/link";

const AccountDetails: NextPageWithLayout = () => {
  redirectIfNotLoggedIn();
  const { isLoading, error, data, refetch } = useQuery("me", getMe);
  return (
    <>
      <Head>
        <title>Account details</title>
      </Head>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="px-4 py-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold leading-6 text-gray-900">
                Account details
              </h2>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {data?.user?.name}
              </p>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-1 text-sm leading-6 text-gray-600 flex space-x-2 items-center">
                <div>{data?.user?.email} </div>
                <div>
                  {data?.user?.emailVerified ? (
                    <CheckBadgeIcon
                      className="h-6 w-6"
                      data-tooltip-id="email-verification"
                      data-tooltip-content="Email verified"
                    />
                  ) : (
                    <ExclamationCircleIcon
                      className="h-6 w-6"
                      data-tooltip-id="email-verification"
                      data-tooltip-content="Email not yet verified"
                    />
                  )}
                  <Tooltip id="email-verification" />
                </div>
              </div>
              {!data?.user?.emailVerified && (
                <div
                  className="mt-1 text-sm leading-6 text-indigo-600 cursor-pointer hover:underline"
                  onClick={async () => {
                    toast.promise(
                      requestEmailVerification({ userId: data.user.id }),
                      {
                        loading: "Loading",
                        success: (data) => data.message,
                        error: "Error occured",
                      }
                    );
                  }}
                >
                  Verify email
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              {data?.user?.hasNormalLogin ? (
                <Link
                  href="/account/change-password"
                  className="mt-1 text-sm leading-6 text-indigo-600 cursor-pointer hover:underline"
                >
                  Change password
                </Link>
              ) : (
                <div className="mt-1 text-sm leading-6 text-indigo-600">
                  You cannot change your password since you've created this
                  account using a Google account
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Notifications
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                We'll always let you know about important changes, but you pick
                what else you want to hear about.
              </p>
            </div>
            <div className="mt-2 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  By Email
                </legend>
                <div className="mt-2 space-y-4">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        name="contactForm"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 pointer-events-none"
                        checked={true}
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="contactForm"
                        className="font-medium text-gray-900"
                      >
                        Customer contact (compulsory)
                      </label>
                      <p className="text-gray-500">
                        Get notified when someone expresses their interest in
                        your services through the customer contact form.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

AccountDetails.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default AccountDetails;
