import {
  BookmarkIcon,
  BookmarkSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { updateTutorApplicationState } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";
import {
  CurrencyDollarIcon,
  MapPinIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import ContactModal from "./ContactModal";
import { useState } from "react";

export default ({
  tutorProfile,
  showDetails,
}: {
  tutorProfile: any;
  showDetails?: Function;
}) => {
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  // normal version
  return (
    <li className="flex py-6">
      <div className="h-16 w-16 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={
            tutorProfile.image
              ? tutorProfile.image
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{tutorProfile.tutorName}</h3>
            <div className="flex">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 flex content-center"
                onClick={() => {
                  setContactModalIsOpen(true);
                }}
                data-te-toggle="tooltip"
                title="Shortlist"
              >
                <PhoneIcon className="h-6 w-6" />
                Contact
              </button>
              <ContactModal
                contactInfo={tutorProfile.contactInfo}
                setOpen={setContactModalIsOpen}
                open={contactModalIsOpen}
              />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-4 mb-1">
            <div className="lg:flex lg:items-center lg:space-x-1">
              <div className="flex items-center text-sm text-gray-500">
                <UserIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorProfile.gender}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TagIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorProfile.type}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {tutorProfile.regions.length == 5
                  ? "All regions"
                  : tutorProfile.regions.join(", ")}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CurrencyDollarIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {tutorProfile.pricing.rate}/hr
            </div>
            {tutorProfile.title}
            <br />
            {tutorProfile.qualifications}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <a
            className="flex-1 text-indigo-600 hover:text-indigo-500 cursor-pointer"
            href={`/tutor-profile/${tutorProfile.id}`}
          >
            Read more
          </a>

          <div className="flex"></div>
        </div>
      </div>
    </li>
  );
};
