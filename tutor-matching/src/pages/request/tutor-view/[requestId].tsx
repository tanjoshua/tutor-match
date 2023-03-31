import { NextPageWithLayout } from "../../_app";
import { ReactElement, useState } from "react";
import Layout from "../../../components/layouts/Layout";
import { useQuery } from "react-query";
import {
  LinkIcon,
  LockClosedIcon,
  MapPinIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  applyToTutorRequest,
  getHasApplied,
  getTutorRequest,
  withdrawApplication,
} from "@/services/tutorRequest";
import { RateOptions } from "@/utils/enums";
import { redirectIfNotLoggedIn } from "@/utils/redirect";
import Link from "next/link";

const TutorProfile: NextPageWithLayout = () => {
  redirectIfNotLoggedIn();
  const router = useRouter();
  const { requestId } = router.query;
  const { isLoading, error, data, refetch } = useQuery(
    ["tutorRequestTutorView", requestId],
    () => getTutorRequest({ id: requestId as string }),
    { enabled: !!requestId }
  );

  const {
    isLoading: hasAppliedLoading,
    error: hasAppliedError,
    data: hasAppliedData,
    refetch: refetchHasApplied,
  } = useQuery(
    ["tutorHasApplied", requestId],
    () => getHasApplied({ id: requestId as string }),
    { enabled: !!requestId }
  );

  if (isLoading) {
    return <></>;
  }

  if (error) {
    // profile does not exist
    return (
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 ">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Tutor request not found
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We could not find the tutor request you were looking for. Go to
              your dashboard to find new tutor requests
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/tutor/dashboard"
                className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.tutorRequest) {
    const tutorRequest = data.tutorRequest;
    // profile exists
    return (
      <div>
        <Head>
          <title>
            {`Request for ${tutorRequest.level}: ${tutorRequest.subjects.join(
              ","
            )}`}
          </title>
        </Head>
        <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {`${tutorRequest.level}: ${tutorRequest.subjects.join(
                ", "
              )} Tutor Request`}
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <UserIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorRequest.gender.length === 2
                  ? "Any gender"
                  : tutorRequest.gender.join(", ")}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPinIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorRequest.region}
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="sm:ml-3">
              {hasAppliedData?.hasApplied ? (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={async () => {
                    await withdrawApplication({ id: requestId as string });
                    refetchHasApplied();
                  }}
                >
                  <XMarkIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                    aria-hidden="true"
                  />
                  Withdraw
                </button>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={async () => {
                    await applyToTutorRequest({ id: requestId as string });
                    refetchHasApplied();
                  }}
                >
                  <ClipboardDocumentListIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                    aria-hidden="true"
                  />
                  Apply
                </button>
              )}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Level</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {tutorRequest.level}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Subject(s)</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {tutorRequest.subjects.join(", ")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Tutor Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {tutorRequest.type.length === 3
                  ? "All tutors welcome"
                  : tutorRequest.type.join(", ")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Pricing</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {tutorRequest.pricing.rateOption === RateOptions.Max
                  ? `$${tutorRequest.pricing.rate}/hr or lower`
                  : tutorRequest.pricing.rateOption}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">
                Student availability
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                {tutorRequest.availability}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">
                Student location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {tutorRequest.region} region
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">
                Additional information
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {tutorRequest.description}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  } else {
    // this shouldn't happen but I think it does when the page first loads
    return <></>;
  }
};

TutorProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TutorProfile;
