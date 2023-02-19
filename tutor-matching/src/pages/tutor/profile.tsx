import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import { getUserTutorProfile } from "@/services/tutor";

const Profile: NextPageWithLayout = () => {
  const { isLoading, error, data, refetch } = useQuery(
    "userTutorProfile",
    getUserTutorProfile
  );

  if (isLoading) {
    return <></>;
  }

  if (data.profile) {
    const profile = data.profile;
    // profile exists
    return (
      <div>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {profile.title}
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tutor Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.tutorName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Levels</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.levels.join(", ")}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Subjects</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.subjects.join(", ")}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tutor Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.type}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Pricing</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.pricing.rate} / hr
                {profile.pricing.details && (
                  <>
                    <br />
                    {profile.pricing.details}
                  </>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Teaching Experience and Academic Qualifications
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.qualifications}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Tutor Description
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Contact Info
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {profile.contactInfo.phoneNumber &&
                  `Phone Number: ${profile.contactInfo.phoneNumber}`}
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

Profile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Profile;
