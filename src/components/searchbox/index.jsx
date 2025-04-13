import React, { memo } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBox = memo(
  ({ onKeyDown }) => {
    return (
      <div className="flex h-full items-center rounded-full bg-lightPrimary pb-4 pt-4 text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[250px]">
        <p className="pl-3 pr-2 text-xl">
          <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
        </p>
        <input
          type="text"
          placeholder="Search..."
          className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          onKeyDown={onKeyDown}
        />
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.onKeyDown === nextProps.onKeyDown
);

export default SearchBox;
