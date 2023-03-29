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
  MapPinIcon,
  UserIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import ShareModal from "@/components/tutor-profile/ShareModal";
import { LevelCategories } from "@/utils/options/levels";
import { redirectIfNotLoggedIn } from "@/utils/redirect";
import UploadProfilePicModal from "@/components/tutor-profile/UploadProfilePicModal";

const YourProfile: NextPageWithLayout = () => {
  redirectIfNotLoggedIn();
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
  const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);

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
        <UploadProfilePicModal
          open={uploadModalIsOpen}
          setOpen={setUploadModalIsOpen}
        />
        <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
          <div className="min-w-0 flex-1 lg:flex lg:items-center space-y-4 lg:space-x-4">
            <div
              className="group relative h-28 w-28 lg:h-36 lg:w-36 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 cursor-pointer"
              onClick={() => {
                setUploadModalIsOpen(true);
              }}
            >
              <img
                src={
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                className="h-full w-full object-cover object-center group-hover:opacity-80"
              />
              <div className="hidden absolute top-2 right-2 group-hover:block">
                <PencilIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div>
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
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {profile.gender}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPinIcon
                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  {profile.regions.length == 5
                    ? "All regions"
                    : profile.regions.join(", ")}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 lg:mt-0 flex space-x-2">
            <span className="">
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

            <span className="">
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
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                {Object.values(LevelCategories).map((level) => {
                  if (
                    profile.levels.includes(level) &&
                    profile.subjects[level]
                  ) {
                    return `${level}: ${profile.subjects[level].join(", ")}\n`;
                  }
                })}
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
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                {profile.contactInfo.phoneNumber &&
                  `Phone Number: +65 ${profile.contactInfo.phoneNumber}\n`}
                {profile.contactInfo.email &&
                  `Email: ${profile.contactInfo.email}\n`}
                {profile.contactInfo.telegram &&
                  `Telegram: @${profile.contactInfo.telegram}\n`}
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
