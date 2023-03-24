import { NextPageWithLayout } from "../_app";
import { Fragment, ReactElement, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import {
  PencilIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getAppliedRequests,
  getTutorApplications,
  getTutorRequests,
} from "@/services/tutorRequest";
import { ApplicationState, RateOptions, TutorType } from "@/utils/enums";
import Spinner from "@/components/shared/Spinner";
import Select from "@/components/shared/Select";
import { LevelCategories, levelCategoryOptions } from "@/utils/options/levels";
import { levelCategoryToSubjectOptions } from "@/utils/options/subjects";
import Creatable from "@/components/shared/Creatable";
import RequestCard from "@/components/tutor-request/RequestCard";
import PaginateFooter from "@/components/shared/PaginateFooter";
import TutorRequestModal from "@/components/tutor-request/TutorRequestModal";
import { getUserTutorProfile } from "@/services/tutor";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { regionOptions } from "@/utils/options/regions";
import { Disclosure, Menu, Transition } from "@headlessui/react";

const tabClasses =
  "inline-block px-4 pb-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "inline-block px-4 pb-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";
const sortOptions = [{ name: "Newest", href: "#", current: true }];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const TutorProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const [filters, setFilters] = useState<{
    region: string[];
    gender: string;
    type: string[];
    levelCategories: string[];
    subjects: any;
  }>({
    region: [],
    gender: "",
    type: [],
    levelCategories: [],
    subjects: {},
  });
  const [paginationQuery, setPaginationQuery] = useState({
    page: 1,
    limit: 5,
  });
  useEffect(() => {
    setPaginationQuery({ ...paginationQuery, page: 1 });
  }, [filters]);
  const [appliedPaginationQuery, setAppliedPaginationQuery] = useState({
    page: 1,
    limit: 5,
  });
  const [tabSelected, setTabSelected] = useState<"Requests" | "Applied">(
    "Requests"
  );
  const [requestDetailsModalOpen, setRequestDetailsModalOpen] = useState(false);
  const [requestData, setRequestData] = useState<any>({});
  const { isLoading, error, data, refetch, isRefetching } = useQuery(
    ["getTutorRequest", filters, paginationQuery],
    () => getTutorRequests({ ...filters, ...paginationQuery })
  );
  const {
    isLoading: appliedIsLoading,
    error: appliedError,
    data: appliedData,
    refetch: appliedRefetch,
    isRefetching: appliedIsRefetching,
  } = useQuery(["getAppliedRequests"], () =>
    getAppliedRequests({ ...appliedPaginationQuery })
  );
  const {
    isLoading: tutorProfileIsLoading,
    error: tutorProfileError,
    data: tutorProfileData,
    refetch: tutorProfileRefetch,
  } = useQuery("userTutorProfile", getUserTutorProfile);
  useEffect(() => {
    if (tutorProfileData?.profile) {
      setFilters({
        ...filters,
        region: tutorProfileData.profile.regions,
        gender: tutorProfileData.profile.gender,
        type: [tutorProfileData.profile.type],
        levelCategories: tutorProfileData.profile.levels,
        subjects: tutorProfileData.profile.subjects,
      });
    }
  }, [tutorProfileData]);

  const setPage = (page: number) => {
    setPaginationQuery({ ...paginationQuery, page: page });
  };
  const showRequestDetails = (data: any) => {
    setRequestData(data);
    setRequestDetailsModalOpen(true);
  };

  if (error) {
    return <></>;
  }

  // profile exists
  return (
    <div>
      <Head>
        <title>{`Tutor Dashboard`}</title>
      </Head>
      <TutorRequestModal
        open={requestDetailsModalOpen}
        setOpen={setRequestDetailsModalOpen}
        tutorRequest={requestData}
        refetch={() => {
          refetch();
          appliedRefetch();
        }}
      />
      <div className="bg-white px-4 py-5 mx-auto">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Find potential students here
            </h1>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <p className="text-sm text-gray-500">
                Apply to requests from potential clients. This list will be
                constantly updated so check back in regularly!
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className="lg:block">
              <div className="flex">
                <div
                  className="text-sm text-gray-500 mr-2 underline cursor-pointer hover:text-gray-400"
                  onClick={() => {
                    setFilters({
                      region: [],
                      gender: "",
                      type: [],
                      levelCategories: [],
                      subjects: {},
                    });
                  }}
                >
                  Clear filters
                </div>
                <div
                  className="text-sm text-gray-500 underline cursor-pointer hover:text-gray-400"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      region: tutorProfileData.profile.regions,
                      gender: tutorProfileData.profile.gender,
                      type: [tutorProfileData.profile.type],
                      levelCategories: tutorProfileData.profile.levels,
                      subjects: tutorProfileData.profile.subjects,
                    });
                  }}
                >
                  Autofill
                </div>
              </div>

              <Disclosure as="div" className="border-b border-gray-200 py-4">
                {({ open }) => (
                  <>
                    <h3 className="-my-3 flow-root">
                      <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">Level</span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel className="pt-4">
                      <div className="text-sm">
                        <Select
                          isMulti
                          isClearable
                          placeholder="All levels"
                          options={levelCategoryOptions}
                          value={filters.levelCategories.map((x) => ({
                            value: x,
                            label: x,
                          }))}
                          onChange={(value: any) => {
                            setFilters({
                              ...filters,
                              levelCategories: value.map((x: any) => x.value),
                            });
                          }}
                        />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="border-b border-gray-200 py-4">
                {({ open }) => (
                  <>
                    <h3 className="-my-3 flow-root">
                      <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          Subjects
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel className="pt-4">
                      {filters.levelCategories.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                          Select a level to view subject filters
                        </p>
                      )}
                      {Object.values(LevelCategories).map((level) => {
                        if (filters.levelCategories.includes(level)) {
                          return (
                            <div className="my-2" key={level}>
                              <label className="block text-sm text-gray-900">
                                {level}:
                              </label>
                              <Creatable
                                className="text-sm"
                                isMulti
                                isClearable
                                placeholder={`All ${level} subjects`}
                                options={levelCategoryToSubjectOptions(level)}
                                value={
                                  filters.subjects[level]
                                    ? filters.subjects[level].map((x: any) => ({
                                        value: x,
                                        label: x,
                                      }))
                                    : []
                                }
                                onChange={(value: any) => {
                                  const newSubjects = { ...filters.subjects };
                                  newSubjects[level] = value.map(
                                    (value: any) => value.value
                                  );
                                  setFilters({
                                    ...filters,
                                    subjects: newSubjects,
                                  });
                                }}
                              />
                            </div>
                          );
                        }
                      })}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="border-b border-gray-200 py-4">
                {({ open }) => (
                  <>
                    <h3 className="-my-3 flow-root">
                      <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">Type</span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel className="pt-4">
                      <div className="text-sm">
                        <Select
                          isMulti
                          isClearable
                          placeholder="No type filter"
                          options={Object.values(TutorType).map((value) => ({
                            label: value,
                            value: value,
                          }))}
                          value={filters.type.map((x) => ({
                            value: x,
                            label: x,
                          }))}
                          onChange={(value: any) => {
                            setFilters({
                              ...filters,
                              type: value.map((x: any) => x.value),
                            });
                          }}
                        />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="border-b border-gray-200 py-4">
                {({ open }) => (
                  <>
                    <h3 className="-my-3 flow-root">
                      <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          Gender
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel className="pt-4">
                      <div className="text-sm">
                        <Select
                          isClearable
                          placeholder="No gender filters"
                          options={["Male", "Female"].map((value) => ({
                            label: value,
                            value: value,
                          }))}
                          value={{
                            label: filters.gender,
                            value: filters.gender,
                          }}
                          onChange={(value: any) => {
                            setFilters({
                              ...filters,
                              gender: value?.value,
                            });
                          }}
                        />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="border-b border-gray-200 py-4">
                {({ open }) => (
                  <>
                    <h3 className="-my-3 flow-root">
                      <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          Regions
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel className="pt-4">
                      <div className="text-sm">
                        <Select
                          isMulti
                          isClearable
                          placeholder="Any region"
                          options={regionOptions}
                          value={filters.region.map((x) => ({
                            value: x,
                            label: x,
                          }))}
                          onChange={(value: any) => {
                            setFilters({
                              ...filters,
                              region: value.map((x: any) => x.value),
                            });
                          }}
                        />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>

            <div className="lg:col-span-3">
              <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mx-2 leading-6">
                <ul className="flex flex-wrap -mb-px">
                  <li className="mr-2">
                    <button
                      className={
                        tabSelected === "Requests"
                          ? tabClassesSelected
                          : tabClasses
                      }
                      onClick={() => {
                        refetch();
                        setTabSelected("Requests");
                      }}
                    >
                      Tutor Requests
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={
                        tabSelected === "Applied"
                          ? tabClassesSelected
                          : tabClasses
                      }
                      onClick={() => {
                        appliedRefetch();
                        setTabSelected("Applied");
                      }}
                    >
                      Applied
                    </button>
                  </li>
                </ul>
              </div>
              <div className="p-2">
                {tabSelected === "Requests" ? (
                  isLoading ? (
                    <Spinner />
                  ) : (
                    <div>
                      <div className="divide-y-2">
                        {data.tutorRequests.map((tutorRequest: any) => (
                          <RequestCard
                            key={tutorRequest._id}
                            tutorRequest={tutorRequest}
                            showDetails={showRequestDetails}
                            refetch={refetch}
                          />
                        ))}
                      </div>
                      {data.tutorRequests.length === 0 ? (
                        <div className="text-sm text-gray-500">
                          No matching requests
                        </div>
                      ) : (
                        <PaginateFooter
                          page={paginationQuery.page}
                          limit={paginationQuery.limit}
                          total={data?.count}
                          setPage={setPage}
                        />
                      )}
                    </div>
                  )
                ) : appliedIsLoading ? (
                  <Spinner />
                ) : (
                  <div>
                    <div className="divide-y-2">
                      {appliedData.applications.map((application: any) => (
                        <RequestCard
                          key={application._id}
                          tutorRequest={application.tutorRequestDetails}
                          showDetails={showRequestDetails}
                          refetch={appliedRefetch}
                        />
                      ))}
                    </div>
                    {appliedData.applications.length === 0 ? (
                      <div className="text-sm text-gray-500">
                        No applied requests
                      </div>
                    ) : (
                      <PaginateFooter
                        page={appliedPaginationQuery.page}
                        limit={appliedPaginationQuery.limit}
                        total={appliedData?.count}
                        setPage={setPage}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

TutorProfile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TutorProfile;
