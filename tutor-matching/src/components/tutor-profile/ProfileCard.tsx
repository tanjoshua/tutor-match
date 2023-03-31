import {
  BookmarkIcon,
  BookmarkSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
  PhoneIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { updateTutorApplicationState } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";
import { MapPinIcon, TagIcon, UserIcon } from "@heroicons/react/20/solid";
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
      <div className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={
            tutorProfile.profilePic?.location ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base text-gray-900 items-start">
            <div>
              <div className="text-sm">{tutorProfile.tutorName}</div>
              <h1 className="text-lg font-medium">{tutorProfile.title}</h1>
            </div>
            <div className="flex">
              <div className="flex items-center font-medium">
                ${tutorProfile.pricing.rate}/hr
              </div>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500 line-clamp-4 mb-1">
            <div className="sm:flex sm:items-center sm:space-x-1">
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
            {tutorProfile.qualifications}
          </div>
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
