import React from "react";
import MockImage from "../../public/mock-image.jpg";
import Image from "next/image";
import { AspectRatio } from "@mantine/core";
import { useRouter } from "next/navigation";

type Props = {
  data: {
    name: string;
    rating: number;
    reviews: number;
    service: string;
    id: string;
    profilePic: string
  };
};

const ServiceCard = ({ data }: Props) => {
  const router = useRouter()
  return (
    <div className="">
      <div onClick={() => router.push(`/feed/info/${data.id}`)} className="cursor-pointer bg-tertiary py-10 px-4 h-[12rem] flex items-center rounded-md">
        <div className="">
          <AspectRatio ratio={1800 / 1800}>
            <img src={data.profilePic} width={100} height={100} alt="mock-image" />
          </AspectRatio>
        </div>
      </div>
      <div className="text-[0.88rem] font-medium mt-4">
        <p>{data.name}</p>
        <p className="text-gray-600">{data.service}</p>
      </div>
      <div className="flex text-[0.88rem] text-primary ">
        <p className="mr-2">{data.rating}</p>
        <p>({data.reviews} reviews)</p>
      </div>
    </div>
  );
};

export default ServiceCard;
