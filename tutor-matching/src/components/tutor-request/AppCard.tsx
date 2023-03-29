import {
  BookmarkIcon,
  BookmarkSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { updateTutorApplicationState } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";
import { PhoneIcon } from "@heroicons/react/20/solid";

interface TutorProfile {
  id: string;
  title: string;
  tutorName: string;
  qualifications: string;
  description: string;
  image: string;
  contactInfo: any;
  profilePic: { location: string };
}

export default ({
  tutorProfile,
  id,
  normal,
  shortlist,
  hidden,
  showDetails,
  updateState,
  showContact,
}: {
  tutorProfile: TutorProfile;
  id: string;
  normal?: boolean; // normal pending card
  shortlist?: boolean; // short list card type
  hidden?: boolean; // hidden card type
  showDetails: Function;
  updateState: (applicationId: string, state: string) => void;
  showContact: Function;
}) => {
  // normal version
  return (
    <li className="flex py-6">
      <div className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-md ">
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
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{tutorProfile.tutorName}</h3>
            <div className="flex">
              {normal && (
                <button
                  className="rounded-md transititext-primary"
                  data-te-toggle="tooltip"
                  title="Hide"
                  onClick={() => {
                    updateState(id, ApplicationState.Hidden);
                  }}
                >
                  <EyeSlashIcon className="h-6 w-6 text-indigo-600 hover:text-indigo-500" />
                </button>
              )}
              {hidden && (
                <button
                  className="rounded-md transititext-primary"
                  data-te-toggle="tooltip"
                  title="Unhide"
                  onClick={() => {
                    updateState(id, ApplicationState.Pending);
                  }}
                >
                  <EyeIcon className="h-6 w-6 text-indigo-600 hover:text-indigo-500" />
                </button>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-4 mb-1">
            {tutorProfile.title}
            <br />
            {tutorProfile.qualifications}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm mt-2">
          <a
            className="flex-1 text-indigo-600 hover:text-indigo-500 cursor-pointer"
            onClick={() => {
              showDetails(id);
            }}
          >
            Read more
          </a>

          <div className="flex space-x-4">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              onClick={() => {
                showContact({
                  ...tutorProfile.contactInfo,
                  profileId: tutorProfile.id,
                });
              }}
              data-te-toggle="tooltip"
              title="Contact"
            >
              <PhoneIcon className="h-6 w-6" />
              <div className="hidden sm:block">Contact</div>
            </button>
            {!shortlist && (
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                onClick={() => {
                  updateState(id, ApplicationState.Shortlisted);
                }}
                data-te-toggle="tooltip"
                title="Shortlist"
              >
                <BookmarkIcon className="h-6 w-6" />
                <div className="hidden sm:block">Shortlist</div>
              </button>
            )}
            {shortlist && (
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center "
                data-te-toggle="tooltip"
                title="Remove from shortlist"
                onClick={() => {
                  updateState(id, ApplicationState.Pending);
                }}
              >
                <BookmarkSlashIcon className="h-6 w-6 " />
                <div className="hidden sm:block">Remove</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};
