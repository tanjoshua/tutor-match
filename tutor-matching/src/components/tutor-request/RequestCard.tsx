import { BookmarkIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface TutorRequest {}

export default ({
  tutorRequest,
  showDetails,
}: {
  tutorRequest: TutorRequest;
  showDetails: Function;
}) => {
  // normal version
  return (
    <li className="flex py-6">
      <div className="h-16 w-16 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img src={""} className="h-full w-full object-cover object-center" />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>Title</h3>
            <div className="flex">
              <button
                className="rounded-md transititext-primary"
                data-te-toggle="tooltip"
                title="Apply"
              >
                <EyeSlashIcon className="h-6 w-6 text-indigo-600 hover:text-indigo-500" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-4 mb-1">
            Title
            <br />
            Other information
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <a
            className="flex-1 text-indigo-600 hover:text-indigo-500 cursor-pointer"
            onClick={() => {}}
          >
            Read more
          </a>

          <div className="flex">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex content-center"
              onClick={() => {}}
            >
              <BookmarkIcon className="h-6 w-6 mr-1" />
              Action
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
