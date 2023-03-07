import { NextPageWithLayout } from "../../_app";
import { ReactElement, useState } from "react";
import Layout from "../../../components/Layout";
import { useQuery } from "react-query";
import {
  LockClosedIcon,
  MapPinIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  applyToTutorRequest,
  getHasApplied,
  getTutorApplications,
  getTutorRequest,
  withdrawApplication,
} from "@/services/tutorRequest";
import { RateOptions } from "@/utils/enums";

const tabClasses =
  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "inline-block p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";

const TutorProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const { isLoading, error, data, refetch } = useQuery(
    ["getTutorApplications", token],
    () => getTutorApplications({ token: token as string }),
    { enabled: !!token }
  );
  const [tabSelected, setTabSelected] = useState("Pending");

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
              We could not find the tutor request you were looking for. Find a
              suitable tutor in the tutor marketplace.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/browse"
                className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse tutors
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (data?.tutorRequest) {
    const tutorRequest = data.tutorRequest;
    const tutorApplications = data.tutorApplications;
    console.log(data.tutorApplications);

    // profile exists
    return (
      <div>
        <Head>
          <title>{`Tutor Applications`}</title>
        </Head>
        <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {`Hello ${tutorRequest.name}, here are the tutors that have applied`}
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <p className="mt-2 text-sm text-gray-500">
                New tutors who apply to your tutor request will show up here.
                This list will be constantly updated so check back in regularly!
              </p>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="sm:ml-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PencilIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                  aria-hidden="true"
                />
                Edit tutor request
              </button>
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 md:grid md:grid-cols-2 md:items-start">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mx-2 leading-6">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  className={
                    tabSelected === "Pending" ? tabClassesSelected : tabClasses
                  }
                  onClick={() => setTabSelected("Pending")}
                >
                  Pending
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={
                    tabSelected === "Hidden" ? tabClassesSelected : tabClasses
                  }
                  onClick={() => setTabSelected("Hidden")}
                >
                  Hidden
                </button>
              </li>
              <li className="mr-2 md:hidden">
                <button
                  className={
                    tabSelected === "Shortlisted"
                      ? tabClassesSelected
                      : tabClasses
                  }
                  onClick={() => setTabSelected("Shortlisted")}
                >
                  Shortlisted
                </button>
              </li>
            </ul>
          </div>
          <div className="">
            <div className="border-b border-gray-200">
              <div className="text-2xl font-bold  text-gray-900 p-4 leading-6">
                Shortlisted tutors
              </div>
            </div>
          </div>
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
