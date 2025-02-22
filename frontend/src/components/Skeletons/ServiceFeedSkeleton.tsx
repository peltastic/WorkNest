import React from "react";
import { Skeleton } from "@mantine/core";

type Props = {};

const ServiceFeedSkeleton = (props: Props) => {
  return (
    <div className="">
      <div className="w-full">
        <Skeleton height={100} />
        <div className="w-[4rem] mt-3">
          <Skeleton height={10} />
        </div>
        <div className="w-[4rem] mt-3">
          <Skeleton height={7} />
        </div>
        <div className="w-[90%] mt-3">
          <Skeleton height={7} />
        </div>
      </div>
    </div>
  );
};

export default ServiceFeedSkeleton;
