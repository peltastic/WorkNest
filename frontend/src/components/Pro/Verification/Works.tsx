import { IRegisterArtisanPayload } from "@/lib/features/auth/auth";
import { AspectRatio, FileButton } from "@mantine/core";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowRight, FaPlus } from "react-icons/fa6";

type Props = {
  next: () => void;
  back: () => void;
  updateImages: (images: File[]) => void;
  data: IRegisterArtisanPayload;
  imagePreviews: string[];
  saveImagePreviews: (images: string[]) => void;
};

const Works = (props: Props) => {
  // const [previewUrls, setPreviewUrls] = useState<string>
  const [files, setFiles] = useState<
    {
      id: string;
      file: File | null;
      imageUrl: string | null;
    }[]
  >([
    {
      id: "1",
      file: null,
      imageUrl: null,
    },
    {
      id: "2",
      file: null,
      imageUrl: null,
    },
    {
      id: "3",
      file: null,
      imageUrl: null,
    },
    {
      id: "4",
      file: null,
      imageUrl: null,
    },
    {
      id: "5",
      file: null,
      imageUrl: null,
    },
    {
      id: "6",
      file: null,
      imageUrl: null,
    },
    {
      id: "7",
      file: null,
      imageUrl: null,
    },
    {
      id: "8",
      file: null,
      imageUrl: null,
    },
  ]);
  useEffect(() => {
    if (props.data.images) {
      const files: {
        id: string;
        file: File | null;
        imageUrl: string | null;
      }[] = props.data.images.map((el, index) => {
        return {
          id: (index + 1).toString(),
          file: el || null,
          imageUrl: props.imagePreviews[index],
        };
      });
      if (files.length < 8) {
        for (let index = 0; index <= 8 - files.length; index++) {
          files.push({
            id: (files.length + index + 1).toString(),
            file: null,
            imageUrl: null,
          });
        }
      }
      setFiles(files);
    }
  }, [props.data]);
  const updateFile = (id: string, index: number, file: File, url: string) => {
    const fileCopy = [...files];
    console.log(fileCopy);
    fileCopy.splice(index, 1, {
      id,
      file,
      imageUrl: url,
    });
    setFiles(fileCopy);
  };

  const updateFileStateHandler = () => {
    const imagesFiles = [];
    const imagesPreview = [];
    for (const el of files) {
      if (el.file) {
        imagesFiles.push(el.file);
      }
      if (el.imageUrl) {
        imagesPreview.push(el.imageUrl);
      }
    }
    props.updateImages(imagesFiles);
    props.saveImagePreviews(imagesPreview);
  };
  return (
    <div className="">
      <h2 className="font-semibold mt-10">Jobs done </h2>
      <h3 className="font-light">
        Upload at least <span className="font-bold">6</span> pictures of
        previous work done or service rendered
      </h3>
      <div className="grid grid-cols-4 gap-8 mt-16">
        {files.map((el, index) => (
          <FileButton
            key={el.id}
            onChange={(file) => {
              if (file) {
                const objectUrl = URL.createObjectURL(file);
                updateFile((index + 1).toString(), index, file, objectUrl);
              }
            }}
            accept="image/png,image/jpeg"
          >
            {(props) => (
              <button {...props}>
                <div className="bg-[#0000000d] rounded-md h-[10rem] flex items-center justify-center  px-2">
                  {el.imageUrl ? (
                    <AspectRatio ratio={1800 / 1080}>
                      <Image
                        src={el.imageUrl}
                        alt="image-url"
                        width={100}
                        height={100}
                        className="w-[90%]"
                      />
                    </AspectRatio>
                  ) : (
                    <FaPlus className="text-2xl text-gray-500" />
                  )}
                </div>
              </button>
            )}
          </FileButton>
        ))}
      </div>
      <div className="mt-8 flex">
        <button
          className="border-gray-500 border rounded-md py-2 px-4 mr-auto"
          onClick={() => {
            updateFileStateHandler();
            props.back();
          }}
        >
          back
        </button>
        <button
          onClick={() => {
            updateFileStateHandler();
            props.next();
          }}
          className="bg-primary text-white ml-auto py-2 px-4 rounded-md flex items-center"
        >
          <p className="mr-2">Next</p>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Works;
