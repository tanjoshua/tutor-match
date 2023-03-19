import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const selectedPageClasses =
  "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer";
const nonSelectedPageClasses =
  "relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex cursor-pointer";

const getPageArray = (page: number, maxPage: number) => {
  const result = [page];
  for (let i = 0; i < 2; i++) {
    if (result[0] > 1) {
      result.unshift(result[0] - 1);
    } else if (result[result.length - 1] < maxPage) {
      result.push(result[result.length - 1] + 1);
    }
  }
  for (let i = 0; i < 2; i++) {
    if (result[result.length - 1] < maxPage) {
      result.push(result[result.length - 1] + 1);
    } else if (result[0] > 1) {
      result.unshift(result[0] - 1);
    }
  }
  return result;
};

export default function PaginateFooter({
  page,
  limit,
  total,
  setPage,
}: {
  page: number;
  limit: number;
  total: number;
  setPage: Function;
}) {
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, total);
  const maxPage = Math.ceil(total / limit);
  const pages = getPageArray(page, maxPage);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          Previous
        </a>
        <a
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => {
            if (page < maxPage) setPage(page + 1);
          }}
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              onClick={() => {
                if (page > 1) setPage(page - 1);
              }}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            {pages.map((p, i) => (
              <a
                className={
                  p === page ? selectedPageClasses : nonSelectedPageClasses
                }
                onClick={() => {
                  setPage(p);
                }}
              >
                {p}
              </a>
            ))}

            <a
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer"
              onClick={() => {
                if (page < maxPage) setPage(page + 1);
              }}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
