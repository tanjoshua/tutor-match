import { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useQuery } from "react-query";
import { PencilIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  getAppliedRequests,
  getTutorApplications,
  getTutorRequests,
} from "@/services/tutorRequest";
import {
  ApplicationState,
  RateOptions,
  Region,
  TutorType,
} from "@/utils/enums";
import Spinner from "@/components/shared/Spinner";
import Select from "@/components/shared/Select";
import { LevelCategories, levelCategoryOptions } from "@/utils/options/levels";
import { levelCategoryToSubjectOptions } from "@/utils/options/subjects";
import Creatable from "@/components/shared/Creatable";
import RequestCard from "@/components/tutor-request/RequestCard";
import PaginateFooter from "@/components/shared/PaginateFooter";

const tabClasses =
  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ";
const tabClassesSelected =
  "inline-block p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg";

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

  const setPage = (page: number) => {
    setPaginationQuery({ ...paginationQuery, page: page });
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
      <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {`Find potential students here`}
          </h1>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <p className="text-sm text-gray-500">
              Apply to requests from potential clients. This list will be
              constantly updated so check back in regularly!
            </p>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                refetch();
              }}
            >
              {isRefetching ? (
                <>Loading</>
              ) : (
                <>
                  <ArrowPathIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                    aria-hidden="true"
                  />
                  Refresh
                </>
              )}
            </button>
          </span>
          <span className="ml-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-700"
                aria-hidden="true"
              />
              Edit request
            </button>
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 lg:grid lg:grid-cols-5 lg:items-start">
        <div className="md:col-span-2">
          <div className="border-b border-gray-200">
            <div className="text-2xl font-bold text-gray-900 p-4 leading-6">
              Tutor request filters
            </div>
          </div>
          <div className="p-2">
            <div className="my-2">
              <label className="block font-medium text-gray-900">Region</label>
              <Select
                isMulti
                isClearable
                options={Object.values(Region).map((value) => ({
                  label: value,
                  value: value,
                }))}
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
            <div className="my-2">
              <label className="block font-medium text-gray-900">Gender</label>
              <Select
                isClearable
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
            <div className="my-2">
              <label className="block font-medium text-gray-900">Type</label>
              <Select
                isMulti
                isClearable
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
            <div className="my-2">
              <label className="block font-medium text-gray-900">Levels</label>
              <Select
                isMulti
                isClearable
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
            <div className="my-2">
              <label className="block font-medium text-gray-900">
                Subjects
              </label>
              {filters.levelCategories.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  Select a level to view options
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
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 mx-2 leading-6">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  className={
                    tabSelected === "Requests" ? tabClassesSelected : tabClasses
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
                    tabSelected === "Applied" ? tabClassesSelected : tabClasses
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
              isRefetching || isLoading ? (
                <Spinner />
              ) : (
                <div>
                  <div className="divide-y-2">
                    {data.tutorRequests.map((tutorRequest: any) => (
                      <RequestCard
                        key={tutorRequest._id}
                        tutorRequest={tutorRequest}
                        showDetails={() => {}}
                        refetch={refetch}
                      />
                    ))}
                  </div>
                  <PaginateFooter
                    page={paginationQuery.page}
                    limit={paginationQuery.limit}
                    total={data?.count}
                    setPage={setPage}
                  />
                </div>
              )
            ) : appliedIsRefetching || appliedIsLoading ? (
              <Spinner />
            ) : (
              <div>
                <div className="divide-y-2">
                  {appliedData.applications.map((application: any) => (
                    <RequestCard
                      key={application._id}
                      tutorRequest={application.tutorRequestDetails}
                      showDetails={() => {}}
                      refetch={appliedRefetch}
                    />
                  ))}
                </div>
                <PaginateFooter
                  page={appliedPaginationQuery.page}
                  limit={appliedPaginationQuery.limit}
                  total={appliedData?.count}
                  setPage={setPage}
                />
              </div>
            )}
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
