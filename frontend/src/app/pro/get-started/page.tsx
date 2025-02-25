"use client";
import ProLayout from "@/components/Pro/ProLayout";
import PersonalInformation from "@/components/Pro/Verification/PersonalInformation";
import Verification from "@/components/Pro/Verification/Verification";
import Works from "@/components/Pro/Verification/Works";
import {
  IRegisterArtisanPayload,
  useRegisterArtisansMutation,
} from "@/lib/features/auth/auth";
import { notify } from "@/utils/notification";
import { nprogress } from "@mantine/nprogress";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};
export interface IRegisterArtisansTextField {
  fname: string;
  lname: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  email: string;
  skills: string;
}

const GetStarted = (props: Props) => {
  const router = useRouter()
  const [activePage, setActivePage] = useState<number>(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [payload, setPayload] = useState<IRegisterArtisanPayload>({
    address: "",
    city: "",
    email: "",
    fname: "",
    images: null,
    lname: "",
    meansOfId: null,
    phone: "",
    profilePicture: null,
    role: "artisan",
    state: "",
    skills: "",
  });
  const [registerArtisan, {isLoading, isError, isSuccess, data, error}] = useRegisterArtisansMutation();
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");

  const updateTextFields = (value: IRegisterArtisansTextField) => {
    setPayload({
      ...payload,
      ...value,
    });
  };

  const updateImages = (images: File[]) => {
    setPayload({
      ...payload,
      images,
    });
  };

  const updateFileFields = (key: string, value: File) => {
    setPayload({
      ...payload,
      [key]: value,
    });
  };

  const registerArtisanHandler = () => {
    registerArtisan(payload);
  };

  useEffect(() => {
    if (isError) {
      nprogress.complete();
      notify("error", "", (error as any).data?.message || "An Error Occured");
    }

    if (isSuccess) {
      nprogress.start();
      notify("success", "Information saved successfully");
      nprogress.complete();
      router.push("/pro/success/reg");
    }
  }, [isError, isSuccess]);

  return (
    <ProLayout type="login">
      <section className="">
        <div className="text-center">
          <h1 className="font-semibold text-3xl pt-10">
            Become an Artisan a Worknest
          </h1>
          <p className="font-light mt-2 text-lg">
            Join our network of trusted pros and start growing your business
            today
          </p>
        </div>
        <div className="w-[50%] mx-auto">
          {activePage === 1 ? (
            <PersonalInformation
              data={payload}
              updateField={updateTextFields}
              next={() => setActivePage(2)}
            />
          ) : activePage === 2 ? (
            <Works
              imagePreviews={imageUrls}
              saveImagePreviews={(val) => setImageUrls(val)}
              updateImages={updateImages}
              data={payload}
              back={() => setActivePage(1)}
              next={() => setActivePage(3)}
            />
          ) : (
            <Verification
              back={() => setActivePage(2)}
              data={payload}
              picPreview={profilePicPreview}
              updateFileFields={updateFileFields}
              next={registerArtisanHandler}
              isLoading={isLoading}
              updatePicPreview={(val) => setProfilePicPreview(val)}
            />
          )}
        </div>
      </section>
    </ProLayout>
  );
};

export default GetStarted;
