import React from "react";
import { RiSearchLine } from "react-icons/ri";

type Props = {};

const CustomSearch = (props: Props) => {
  return (
    <div className="w-full relative h-fit  mt-6">
      <div className="absolute left-4 top-[50%] -translate-y-1/2">
        <RiSearchLine className="text-primary" />
      </div>
      <input
        type="text"
        placeholder="Search for services"
        className="py-3 px-10 bg-tertiary w-full outline-none placeholder:text-primary rounded-lg"
      />
    </div>
  );
};

export default CustomSearch;
