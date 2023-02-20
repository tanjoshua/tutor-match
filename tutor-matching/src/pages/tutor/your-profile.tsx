import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import { getUserTutorProfile } from "@/services/tutor";
import {
  LinkIcon,
  LockClosedIcon,
  PencilIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import ShareModal from "@/components/tutor-profile/shareModal";

const YourProfile: NextPageWithLayout = () => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : ""; // getting hostname for shareable link
  const router = useRouter();
  const { isLoading, error, data, refetch } = useQuery(
    "userTutorProfile",
    getUserTutorProfile
  );
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);

  if (isLoading) {
    return <></>;
  }

  if (data.profile) {
    const profile = data.profile;
    // profile exists
    return (
      <div>
        <Head>
          <title>Tutor Profile</title>
        </Head>
        <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Your Tutor Profile
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-700">
                {profile.isPublic ? (
                  <>
                    <UserGroupIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    Public profile
                  </>
                ) : (
                  <>
                    <LockClosedIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    Private profile
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="sm:ml-3">
              <button
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => router.push("/tutor/edit-profile")}
              >
                <PencilIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  aria-hidden="true"
                />
                Edit
              </button>
            </span>

            <span className="sm:ml-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setShareModalIsOpen(true)}
              >
                <LinkIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  aria-hidden="true"
                />
                Share
              </button>
              <ShareModal
                link={`${origin}/tutor-profile/${profile.id}`}
                open={shareModalIsOpen}
                setOpen={setShareModalIsOpen}
              />
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.title}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Tutor Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.tutorName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Levels</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.levels.join(", ")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Subjects</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.subjects.join(", ")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Tutor Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.type}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">Pricing</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                ${profile.pricing.rate} / hr
                {profile.pricing.details && (
                  <>
                    <br />
                    {profile.pricing.details}
                  </>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">
                Teaching Experience and Academic Qualifications
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                {profile.qualifications}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">
                Tutor Description
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                {profile.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-700">
                Contact Info
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.contactInfo.phoneNumber &&
                  `Phone Number: +65 ${profile.contactInfo.phoneNumber}`}
                {profile.contactInfo.phoneNumber &&
                  profile.contactInfo.email && <br />}
                {profile.contactInfo.email &&
                  `Email: ${profile.contactInfo.email}`}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  } else {
    // profile does not exist
    return (
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 ">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              No profile found
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A tutor profile contains all the information potential
              students/parents need to select you as their tutor. Create your
              profile now.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/tutor/create-profile"
                className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create profile
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

YourProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default YourProfile;
