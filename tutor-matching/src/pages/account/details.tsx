import Head from "next/head";
import { NextPageWithLayout } from "./../_app";
import { ReactElement } from "react";
import Layout from "../../components/layouts/Layout";
import { redirectIfNotLoggedIn } from "@/utils/redirect";
import { useQuery } from "react-query";
import { getMe } from "@/services/user";
import Spinner from "@/components/shared/Spinner";

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
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {data?.user?.email}
              </p>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <a
                href="/account/change-password"
                className="mt-1 text-sm leading-6 text-indigo-600 cursor-pointer hover:underline"
              >
                Change password
              </a>
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
