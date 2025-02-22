"use client";
import InfoBox from "@/components/InfoBox";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { useCreateBookingMutation } from "@/lib/features/booking";
import { useLazyGetSingleServiceQuery } from "@/lib/features/services";
import { notify } from "@/utils/notification";
import { getCookie } from "@/utils/storage";
import { AspectRatio, Progress, Rating } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const InfoPage = (props: Props) => {
  const router = useRouter();
  const param = useParams<{ id: string }>();
  const [getSingleArtisanInfo, { isFetching, data }] =
    useLazyGetSingleServiceQuery();

  const [createBooking, result] = useCreateBookingMutation();

  useEffect(() => {
    if (param.id) {
      console.log(param.id);
      getSingleArtisanInfo(param.id);
    }
  }, [param.id]);

  useEffect(() => {
    if (result.isError) {
      nprogress.complete();
      notify(
        "error",
        "",
        (result.error as any).data?.message || "An Error Occured"
      );
    }
    if (result.isSuccess) {
      notify("success", "successful!");
      nprogress.start();
      nprogress.complete();
      router.push("/user/success/booking");
    }
  }, [result.isError, result.isSuccess]);

  const bookingHandler = () => {
    const token = getCookie("token");
    if (!token) {
      notify("message", "Please login to book a service");
      router.push("/user/auth/login");
    } else {
      if (data) {
        createBooking({
          artisanId: data.artisan.user._id,
          serviceId: data.artisan._id,
        });
      }
    }
  };
  return (
    <Layout>
      {isFetching ? (
        <div className="w-[4rem]">
          <Spinner dark />
        </div>
      ) : (
        <section className="mt-10 w-[70%] mx-auto mb-12">
          <div className="">
            {data?.artisan && (
              <div className="w-[15rem] h-[15rem] mx-auto mb-6">
                <AspectRatio ratio={1800 / 1800}>
                  <img
                    src={data?.artisan.profilePicture}
                    alt="artisan-profile-picture"
                    className="w-full rounded-full h-full"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="text-center">
              <h2 className="text-center text-2xl font-semibold">
                {data?.artisan.user.fname} {data?.artisan.user.lname}
              </h2>
              <h3>{data?.artisan.skills}</h3>
            </div>
            <button
              disabled={result.isLoading}
              onClick={bookingHandler}
              className="text-center mx-auto block bg-tertiary w-[30rem] py-3 rounded-md mt-6"
            >
              {result.isLoading ? (
                <div className="w-[1rem] py-1">
                  <Spinner />
                </div>
              ) : (
                <p>Book now</p>
              )}
            </button>
            <div className="flex items-center mx-auto justify-center  mt-10 gap-x-8">
              <InfoBox title="3.0" body="ratings" />
              <InfoBox title="+3000" body="Jobs completed" />
            </div>
            <h2 className="text-xl mt-20 font-medium">
              About {data?.artisan.user.fname}
            </h2>

            <p className="font-light mt-4">
              I'm a professional house cleaner with over 8 years of experience.
              I'm detail oriented and thorough and take pride in my work.
            </p>

            <h2 className="text-xl mt-10 font-medium">Photo of Jobs</h2>
            <div className="grid grid-cols-3 mt-6 gap-9">
              {data?.artisan.images.map((el) => (
                <div className="bg-tertiary py-8 flex items-center rounded-xl">
                  <img
                    src={el}
                    alt="photos"
                    key={el}
                    className="w-[80%] mx-auto"
                  />
                </div>
              ))}
            </div>
            <h2 className="text-xl mt-10 font-medium">Reviews</h2>
            <div className="flex items-start mt-6">
              <div className="mr-6">
                <p className="text-3xl font-semibold mb-2 mr-16">3.0</p>
                <Rating defaultValue={3.0} color="#ED802B" />
                <p className="mt-3 text-[0.88rem] font-medium">+3000 jobs</p>
              </div>
              <div className="mt-1">
                <div className="flex items-center space-x-2 mb-3">
                  <p className="text-primary">5</p>
                  <div className="w-[25rem]">
                    <Progress value={70} color="#ED802B" />
                  </div>
                  <p>70%</p>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <p className="text-primary">4</p>
                  <div className="w-[25rem]">
                    <Progress value={90} color="#ED802B" />
                  </div>
                  <p>90%</p>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <p className="text-primary">3</p>
                  <div className="w-[25rem]">
                    <Progress value={20} color="#ED802B" />
                  </div>
                  <p>20%</p>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <p className="text-primary">2</p>
                  <div className="w-[25rem]">
                    <Progress value={20} color="#ED802B" />
                  </div>
                  <p>20%</p>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <p className="text-primary">1</p>
                  <div className="w-[25rem]">
                    <Progress value={10} color="#ED802B" />
                  </div>
                  <p>10%</p>
                </div>
              </div>
            </div>
            <button className="underline mt-10">Write a review</button>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default InfoPage;
