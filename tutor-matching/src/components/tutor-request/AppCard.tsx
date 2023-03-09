import {
  ClipboardDocumentCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { EyeSlashIcon as SolidEye } from "@heroicons/react/20/solid";
import { updateTutorApplicationState } from "@/services/tutorRequest";
import { ApplicationState } from "@/utils/enums";

interface TutorProfile {
  title: string;
  tutorName: string;
  qualifications: string;
  description: string;
  image: string;
}

export default ({
  tutorProfile,
  id,
  refetch,
  normal,
  shortlist,
  hidden,
}: {
  tutorProfile: TutorProfile;
  id: string;
  refetch: Function;
  normal?: boolean; // normal pending card
  shortlist?: boolean; // short list card type
  hidden?: boolean; // hidden card type
}) => {
  const updateState = async (applicationId: string, state: string) => {
    await updateTutorApplicationState({ applicationId, newState: state });
    refetch();
  };

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
              {shortlist && (
                <button
                  className="rounded-md transititext-primary"
                  data-te-toggle="tooltip"
                  title="Remove from shortlist"
                  onClick={() => {
                    updateState(id, ApplicationState.Pending);
                  }}
                >
                  <XCircleIcon className="h-6 w-6 text-indigo-600 hover:text-indigo-500" />
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
        <div className="flex flex-1 items-end justify-between text-sm">
          <a className="flex-1 text-indigo-600 hover:text-indigo-500" href="/">
            Read more
          </a>

          {normal && (
            <div className="flex">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500 flex content-center"
                onClick={() => {
                  updateState(id, ApplicationState.Shortlisted);
                }}
              >
                <ClipboardDocumentCheckIcon className="h-6 w-6 mr-1" />
                Shortlist
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};
