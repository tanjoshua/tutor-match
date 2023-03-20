import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "react-query";
import {
  applyToTutorRequest,
  getTutorApplication,
  withdrawApplication,
} from "@/services/tutorRequest";
import { ApplicationState, RateOptions } from "@/utils/enums";
import {
  CurrencyDollarIcon,
  MapPinIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

export default function TutorRequestModal({
  tutorRequest,
  open,
  setOpen,
  refetch,
}: {
  tutorRequest: any;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: Function;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:m-8 max-w-6xl">
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                  <div className="sm:flex sm:items-center sm:justify-between px-4 py-5 sm:px-6">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {`${tutorRequest.level}: ${tutorRequest.subjects?.join(
                          ", "
                        )} Tutor Request`}
                      </h2>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2 ">
                        <div className="flex items-center text-sm text-gray-500">
                          <UserIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {tutorRequest.gender?.length === 2
                            ? "Any gender"
                            : tutorRequest.gender?.join(", ")}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon
                            className=" h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {tutorRequest.region}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <TagIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {tutorRequest.type?.length === 3
                            ? "All types"
                            : tutorRequest.type?.join(", ")}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CurrencyDollarIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          {tutorRequest.pricing?.rateOption === RateOptions.Max
                            ? `${tutorRequest.pricing?.rate}/hr`
                            : tutorRequest.pricing?.rateOption}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-700">
                        Level
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {tutorRequest.level}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-700">
                        Subject(s)
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {tutorRequest.subjects?.join(", ")}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-700">
                        Tutor Type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {tutorRequest.type?.length === 3
                          ? "All tutors welcome"
                          : tutorRequest.type?.join(", ")}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-700">
                        Pricing
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {tutorRequest.pricing?.rateOption === RateOptions.Max
                          ? `$${tutorRequest.pricing?.rate}/hr or lower`
                          : tutorRequest.pricing?.rateOption}
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

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {tutorRequest.applied ? (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={async () => {
                        await withdrawApplication({ id: tutorRequest._id });
                        refetch();
                        setOpen(false);
                      }}
                    >
                      Withdraw application
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={async () => {
                        await applyToTutorRequest({ id: tutorRequest._id });
                        refetch();
                        setOpen(false);
                      }}
                    >
                      Apply
                    </button>
                  )}

                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
