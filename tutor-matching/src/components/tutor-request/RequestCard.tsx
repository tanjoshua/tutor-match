import {
  applyToTutorRequest,
  withdrawApplication,
} from "@/services/tutorRequest";
import { RateOptions } from "@/utils/enums";
import {
  MapPinIcon,
  UserIcon,
  TagIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  BookmarkIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default ({
  tutorRequest,
  showDetails,
  refetch,
}: {
  tutorRequest: any;
  showDetails: Function;
  refetch: Function;
}) => {
  // normal version
  return (
    <div className="py-6 flex flex-1 flex-col">
      <div>
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{`${tutorRequest.level}: ${tutorRequest.subjects.join(",")}`}</h3>
          <div className="flex items-center">
            <div className="flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400 mr-0.5"
                aria-hidden="true"
              />
              {tutorRequest.pricing.rateOption === RateOptions.Max
                ? `${tutorRequest.pricing.rate}/hr`
                : tutorRequest.pricing.rateOption}
            </div>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500 mb-1">
          <div className="lg:flex lg:items-center lg:space-x-1">
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {tutorRequest.region}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <UserIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {tutorRequest.gender.length === 2
                ? "Any gender"
                : tutorRequest.gender.join(", ")}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <TagIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {tutorRequest.type.length === 3
                ? "All types"
                : tutorRequest.type.join(", ")}
            </div>
          </div>

          <div className="line-clamp-1">{`Availability: ${tutorRequest.availability}`}</div>
          <div className="line-clamp-2">{tutorRequest.description}</div>
        </p>
      </div>
      <div className="flex flex-1 items-end justify-between text-sm">
        <a
          className="flex-1 text-indigo-600 hover:text-indigo-500 cursor-pointer"
          href={`/request/tutor-view/${tutorRequest._id}`}
          target="_blank"
        >
          Open in new tab
        </a>

        <div className="flex">
          {tutorRequest.applied ? (
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex content-center group/apply"
              onClick={async () => {
                await withdrawApplication({ id: tutorRequest._id });
                refetch();
              }}
            >
              <div className="flex group-hover/apply:hidden">
                <ClipboardDocumentCheckIcon className="h-6 w-6 mr-1" />
                Applied
              </div>
              <div className="hidden group-hover/apply:flex">
                <XMarkIcon className="h-6 w-6 mr-1" />
                Withdraw
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex content-center"
              onClick={async () => {
                await applyToTutorRequest({ id: tutorRequest._id });
                refetch();
              }}
            >
              <ClipboardDocumentListIcon className="h-6 w-6 mr-1" />
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
