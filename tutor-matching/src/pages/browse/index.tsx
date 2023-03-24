import { NextPageWithLayout } from "../_app";
import {
  ReactElement,
  use,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getTutorRequests } from "@/services/tutorRequest";
import Head from "next/head";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import Select from "@/components/shared/Select";
import { TutorType } from "@/utils/enums";
import { LevelCategories, levelCategoryOptions } from "@/utils/options/levels";
import Creatable from "@/components/shared/Creatable";
import { levelCategoryToSubjectOptions } from "@/utils/options/subjects";
import Spinner from "@/components/shared/Spinner";
import RequestCard from "@/components/tutor-request/RequestCard";
import PaginateFooter from "@/components/shared/PaginateFooter";
import { getPublicTutorProfiles } from "@/services/tutor";
import ProfileCard from "@/components/tutor-profile/ProfileCard";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { regionOptions } from "@/utils/options/regions";

const sortOptions = [
  { name: "Least recent", href: "#", current: true },
  { name: "Newest", href: "#", current: false },
  { name: "Rate: Low to High", href: "#", current: false },
  { name: "Rate: High to Low", href: "#", current: false },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
const pageLimit = 10;

const stringifyFilters = ({
  regions,
  gender,
  type,
  levelCategories,
  subjects,
  search,
  page,
}: {
  regions: string[];
  gender: string[];
  type: string[];
  levelCategories: string[];
  subjects: any;
  search: string;
  page: number;
}) => {
  const newSubjects: any = {};
  for (const level of levelCategories) {
    newSubjects[level] = subjects[level];
  }
  const output = {
    regions: regions.length ? regions : null,
    gender: gender.length ? gender : null,
    type: type.length ? type : null,
    levelCategories: levelCategories.length ? levelCategories : null,
    subjects: Object.keys(newSubjects).length ? newSubjects : null,
    search: search ? search : null,
    page: page ? page : 1,
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
  page: 1,
};
const BrowseTutors: NextPageWithLayout = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<{
    regions: string[];
    gender: string[];
    type: string[];
    levelCategories: string[];
    subjects: any;
    search: string;
    page: number;
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
  const [tutorDetailsModalOpen, setTutorDetailsModalOpen] = useState(false);
  const [tutorData, setTutorData] = useState<any>({});
  const { isLoading, error, data, refetch, isRefetching } = useQuery(
    ["getTutorRequest", filters],
    () => getPublicTutorProfiles({ ...filters, limit: pageLimit })
  );
  const setPage = (page: number) => {
    router.push({
      pathname: "/browse",
      query: {
        filters: stringifyFilters({
          ...filters,
          page,
        }),
      },
    });
  };

  const showTutorDetails = (data: any) => {
    setTutorData(data);
    setTutorDetailsModalOpen(true);
  };

  if (error) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>{`Browse tutors`}</title>
      </Head>
      <div className="bg-white px-4 py-5 mx-auto">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Browse tutors
          </h1>

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
                        page: 1,
                      }),
                    },
                  });
                }}
              >
                <div className="my-2 text-sm">
                  <label className="block font-medium text-gray-900 mb-1">
                    Search query
                  </label>
                  <input
                    type="text"
                    id="tutorName"
                    className="border border-gray-300 text-gray-900 rounded-lg focus:indigo-blue-500 focus:border-indigo-500 focus:outline-none block w-full p-2.5"
                    placeholder="Search for name or keywords"
                    ref={searchRef}
                  />
                </div>
              </form>
              <div
                className="text-sm text-gray-500 mr-2 underline cursor-pointer hover:text-gray-400"
                onClick={() => {
                  router.push({ pathname: "/browse" });
                }}
              >
                Clear filters
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
                                  levelCategories: value.map(
                                    (x: any) => x.value
                                  ),
                                  page: 1,
                                }),
                              },
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
                                {level} subjects:
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
                                  const newSubjects = {
                                    ...filters.subjects,
                                  };
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
                                      page: 1,
                                    },
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
                                  page: 1,
                                }),
                              },
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
                                  page: 1,
                                }),
                              },
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
                                  page: 1,
                                }),
                              },
                            });
                          }}
                        />
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>

            {/* Product grid */}
            <div className="lg:col-span-3">
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
                      page={filters.page}
                      limit={pageLimit}
                      total={data?.count}
                      setPage={setPage}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

BrowseTutors.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default BrowseTutors;
