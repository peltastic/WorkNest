import React from "react";
import { Dropzone } from "@mantine/dropzone";
import { AspectRatio, FileButton } from "@mantine/core";
import { FaArrowRight, FaPlus } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IRegisterArtisanPayload } from "@/lib/features/auth/auth";
import Image from "next/image";
import Spinner from "@/components/Spinner";

type Props = {
  next: () => void;
  back: () => void;
  updateFileFields: (key: string, value: File) => void;
  data: IRegisterArtisanPayload;
  picPreview: string;
  updatePicPreview: (val: string) => void;
  isLoading?: boolean;
};

const Verification = ({
  back,
  data,
  next,
  picPreview,
  updateFileFields,
  updatePicPreview,
  isLoading,
}: Props) => {
  return (
    <div className="">
      <h2 className="font-semibold  mt-10">Verifcation</h2>
      <h3 className="font-light">
        Upload the followoing document for identity verification
      </h3>
      <div className="mt-10">
        <p className="text-[0.88rem] mb-2 text-gray-500">
          Upload profile picture
        </p>
        <FileButton
          onChange={(file) => {
            if (file) {
              const objectUrl = URL.createObjectURL(file);
              updatePicPreview(objectUrl);
              updateFileFields("profilePicture", file);
            }
          }}
          accept="image/png,image/jpeg"
        >
          {(props) => (
            <button {...props}>
              <div className="bg-[#0000000d] h-[8rem] w-[8rem] rounded-full relative flex items-center justify-center">
                {picPreview ? (
                  <AspectRatio ratio={1800 / 1800}>
                    <Image
                      src={picPreview}
                      alt="pic-preview"
                      width={100}
                      height={100}
                      className="h-full w-full rounded-full"
                    />
                  </AspectRatio>
                ) : (
                  <FaUser className="text-gray-400 text-5xl" />
                )}
                <div className="absolute bottom-0 right-6 bg-secondary py-1 px-1 text-white rounded-full w-fit">
                  <FaPlus />
                </div>
              </div>
            </button>
          )}
        </FileButton>
      </div>
      <div className="mt-8">
        <p className="text-[0.88rem] mb-2 text-gray-500">
          Upload a means of identification -{" "}
          <span className="font-semibold"> NIN</span>,{" "}
          <span className="font-semibold">Drivers' Lisensce</span> or{" "}
          <span className="font-semibold">Voters card</span>
        </p>
        <Dropzone
          accept={["application/pdf"]}
          onDrop={(files) => {
            if (files) {
              updateFileFields("meansOfId", files[0]);
            }
          }}
        >
          <div className="h-[10rem] flex items-center justify-center">
            {data.meansOfId ? data.meansOfId.name : null}
          </div>
        </Dropzone>
      </div>
      <div className="mt-8 flex">
        <button
          className="border-gray-500 border rounded-md py-2 px-4 mr-auto"
          onClick={() => {
            back();
          }}
        >
          back
        </button>
        <button
          onClick={next}
          disabled={isLoading}
          className="bg-primary disabled:opacity-50 w-[6rem] justify-center disabled:cursor-not-allowed text-white ml-auto py-2 px-4 rounded-md flex items-center"
        >
          {isLoading ? (
            <div className="py-1 w-[1rem]">
              <Spinner />
            </div>
          ) : (
            <div className="flex items-center">
              <p className="mr-2">Next</p>
              <FaArrowRight />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Verification;
