import { NextPageWithLayout } from "../_app";
import { ReactElement, use, useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getTutorRequests } from "@/services/tutorRequest";
import Head from "next/head";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Select from "@/components/shared/Select";
import { Region, TutorType } from "@/utils/enums";
import { LevelCategories, levelCategoryOptions } from "@/utils/options/levels";
import Creatable from "@/components/shared/Creatable";
import { levelCategoryToSubjectOptions } from "@/utils/options/subjects";
import Spinner from "@/components/shared/Spinner";
import RequestCard from "@/components/tutor-request/RequestCard";
import PaginateFooter from "@/components/shared/PaginateFooter";
import { getPublicTutorProfiles } from "@/services/tutor";
import ProfileCard from "@/components/tutor-profile/ProfileCard";

const stringifyFilters = ({
  regions,
  gender,
  type,
  levelCategories,
  subjects,
  search,
}: {
  regions: string[];
  gender: string[];
  type: string[];
  levelCategories: string[];
  subjects: any;
  search: string;
}) => {
  const output = {
    regions: regions.length ? regions : null,
    gender: gender.length ? gender : null,
    type: type.length ? type : null,
    levelCategories: levelCategories.length ? levelCategories : null,
    subjects: Object.keys(subjects).length ? subjects : null,
    search: search ? search : null,
  };
  return JSON.stringify(output, (k, v) => {
    if (v !== null) return v;
  });
};
const initialFilters = {
  regions: [],
  gender: [],
  type: [],
  levelCategories: [],
  subjects: {},
  search: "",
};
const BrowseTutors: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const [filters, setFilters] = useState<{
    regions: string[];
    gender: string[];
    type: string[];
    levelCategories: string[];
    subjects: any;
    search: string;
  }>(initialFilters);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (router.query.filters && JSON.parse(router.query.filters as string)) {
      setFilters({
        ...initialFilters,
        ...JSON.parse(router.query.filters as string),
      });
    } else {
      setFilters(initialFilters);
    }
  }, [router]);
  const [paginationQuery, setPaginationQuery] = useState({
    page: 1,
    limit: 5,
  });
  useEffect(() => {
    setPaginationQuery({ ...paginationQuery, page: 1 });
  }, [filters]);
  const [tutorDetailsModalOpen, setTutorDetailsModalOpen] = useState(false);
  const [tutorData, setTutorData] = useState<any>({});
  const { isLoading, error, data, refetch, isRefetching } = useQuery(
    ["getTutorRequest", filters, paginationQuery],
    () => getPublicTutorProfiles({ ...filters, ...paginationQuery })
  );
  const setPage = (page: number) => {
    setPaginationQuery({ ...paginationQuery, page: page });
  };

  const showTutorDetails = (data: any) => {
    setTutorData(data);
    setTutorDetailsModalOpen(true);
  };

  if (error) {
    return <></>;
  }

  return (
    <div>
      <Head>
        <title>{`Tutor Dashboard`}</title>
      </Head>
      {/* Modal here */}
      <div className="lg:flex lg:items-center lg:justify-between px-4 py-5 sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Find tutors here
          </h1>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <p className="text-sm text-gray-500">
              Only displaying public profiles
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
                <>Loading...</>
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
        </div>
      </div>

      <div className="border-t border-gray-200 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-3">
        <div className="lg:col-span-1">
          <div className="pt-2 px-2 ">
            <div className="text-2xl font-bold text-gray-900">
              Filter tutor requests
            </div>
            <div
              className="text-sm text-gray-500 mr-2 underline cursor-pointer hover:text-gray-400"
              onClick={() => {
                router.push({ pathname: "/browse" });
              }}
            >
              Clear filters
            </div>
          </div>
          <div className="px-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push({
                  pathname: "/browse",
                  query: {
                    filters: stringifyFilters({
                      ...filters,
                      search: searchRef.current?.value
                        ? searchRef.current?.value
                        : "",
                    }),
                  },
                });
              }}
            >
              <div className="my-2">
                <label className="block font-medium text-gray-900">
                  Search query
                </label>
                <input
                  type="text"
                  id="tutorName"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                  placeholder=""
                  ref={searchRef}
                />
              </div>
            </form>
            <div className="my-2">
              <label className="block font-medium text-gray-900">Region</label>
              <Select
                isMulti
                isClearable
                placeholder="Any region"
                options={Object.values(Region).map((value) => ({
                  label: value,
                  value: value,
                }))}
                value={filters.regions.map((x) => ({
                  value: x,
                  label: x,
                }))}
                onChange={(value: any) => {
                  router.push({
                    pathname: "/browse",
                    query: {
                      filters: stringifyFilters({
                        ...filters,
                        regions: value.map((x: any) => x.value),
                      }),
                    },
                  });
                }}
              />
            </div>
            <div className="my-2">
              <label className="block font-medium text-gray-900">Gender</label>
              <Select
                isClearable
                isMulti
                placeholder="Any gender"
                options={["Male", "Female"].map((value) => ({
                  label: value,
                  value: value,
                }))}
                value={filters.gender.map((x) => ({
                  value: x,
                  label: x,
                }))}
                onChange={(value: any) => {
                  router.push({
                    pathname: "/browse",
                    query: {
                      filters: stringifyFilters({
                        ...filters,
                        gender: value.map((x: any) => x.value),
                      }),
                    },
                  });
                }}
              />
            </div>
            <div className="my-2">
              <label className="block font-medium text-gray-900">Type</label>
              <Select
                isMulti
                isClearable
                placeholder="Any type"
                options={Object.values(TutorType).map((value) => ({
                  label: value,
                  value: value,
                }))}
                value={filters.type.map((x) => ({
                  value: x,
                  label: x,
                }))}
                onChange={(value: any) => {
                  router.push({
                    pathname: "/browse",
                    query: {
                      filters: stringifyFilters({
                        ...filters,
                        type: value.map((x: any) => x.value),
                      }),
                    },
                  });
                }}
              />
            </div>
            <div className="my-2">
              <label className="block font-medium text-gray-900">Levels</label>
              <Select
                isMulti
                isClearable
                placeholder="Any level"
                options={levelCategoryOptions}
                value={filters.levelCategories.map((x) => ({
                  value: x,
                  label: x,
                }))}
                onChange={(value: any) => {
                  router.push({
                    pathname: "/browse",
                    query: {
                      filters: stringifyFilters({
                        ...filters,
                        levelCategories: value.map((x: any) => x.value),
                      }),
                    },
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
                        placeholder={`Any ${level.toLowerCase()} subject`}
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
                          router.push({
                            pathname: "/browse",
                            query: {
                              filters: stringifyFilters({
                                ...filters,
                                subjects: newSubjects,
                              }),
                            },
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
        <div className="lg:col-span-2">
          <div className="p-2">
            {isLoading ? (
              <Spinner />
            ) : (
              <div>
                <div className="divide-y-2">
                  {data.profiles?.map((tutor: any) => (
                    <ProfileCard tutorProfile={tutor} key={tutor.id} />
                  ))}
                </div>
                {data?.profiles?.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No matching tutors
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BrowseTutors.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default BrowseTutors;
