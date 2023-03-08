import {
  ClipboardDocumentCheckIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { EyeSlashIcon as SolidEye } from "@heroicons/react/20/solid";

interface TutorProfile {
  title: string;
  tutorName: string;
  qualifications: string;
  description: string;
  image: string;
}

export default ({ tutorProfile }: { tutorProfile: TutorProfile }) => {
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
                className="rounded-md hover:bg-gray-50 transititext-primary"
                data-te-toggle="tooltip"
                title="Hide"
              >
                <EyeSlashIcon className="h-6 w-6" />
              </button>
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

          <div className="flex">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex content-center"
            >
              <ClipboardDocumentCheckIcon className="h-6 w-6 mr-1" />
              Shortlist
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
