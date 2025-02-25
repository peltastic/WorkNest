"use client";
import InfoBox from "@/components/InfoBox";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import {
  useCreateBookingMutation,
  usePostServiceFeedbackMutation,
} from "@/lib/features/booking";
import { useCreateChatRoomMutation } from "@/lib/features/chat";
import { useLazyGetSingleServiceQuery } from "@/lib/features/services";
import { hastoken } from "@/utils/helperFunction";
import { notify } from "@/utils/notification";
import { getCookie } from "@/utils/storage";
import { AspectRatio, Modal, Progress, Rating } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const InfoPage = (props: Props) => {
  const router = useRouter();
  const param = useParams<{ id: string }>();
  const [getSingleArtisanInfo, { isFetching, data }] =
    useLazyGetSingleServiceQuery();

  const [sendfeedback, feedback] = usePostServiceFeedbackMutation();
  const [createBooking, result] = useCreateBookingMutation();
  const [createChatRoom, res] = useCreateChatRoomMutation();

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

  useEffect(() => {
    if (res.isSuccess) {
      router.push("/user/chats");
    }
  }, [res.data]);

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

  const messageActionHandler = () => {
    const token = getCookie("token");
    if (!token) {
      notify("message", "Please login to book a service");
      router.push("/user/auth/login");
    } else {
      if (data) {
        createChatRoom({
          artisanId: data.artisan._id,
          artisanRoomName: `${data.artisan.user.fname} ${data.artisan.user.lname} `,
          roomId: data.artisan._id,
        });
      }
    }
  };
  const [opened, { close, open }] = useDisclosure();
  const [title, setFeedback] = useState<string>("");
  const [value, setValue] = useState(0);

  const sendFeedbackHandler = () => {
    if (data) {
      sendfeedback({
        artisanId: data?.artisan._id,
        feedback: title,
        rating: value,
      });
    }
  };

  useEffect(() => {
    if (feedback.isError) {
      nprogress.complete();
      notify(
        "error",
        "",
        (feedback.error as any).data?.message || "An Error Occured"
      );
    }
    if (feedback.isSuccess) {
      notify("success", "Feedback sent successfully");
      close();
    }
  }, [feedback.isSuccess, feedback.isError]);
  return (
    <>
      <Modal opened={opened} onClose={close} title="Give Feedback" size={"lg"}>
        <textarea
          className="h-[15rem] border w-full"
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>

        <p className="my-5 text-gray-600">Give artisan a rating (optional)</p>

        <Rating value={value} onChange={setValue} size={"xl"} />

        <div className="flex mt-10">
          <button
            onClick={sendFeedbackHandler}
            disabled={!title}
            className="disabled:cursor-not-allowed disabled:opacity-40 bg-black1 text-white text-[0.88rem] rounded-md py-2 px-3 mt-4"
          >
            {feedback.isLoading ? (
              <div className="w-[1rem] py-1">
                <Spinner />
              </div>
            ) : (
              <p>Send feedback</p>
            )}
          </button>
        </div>
      </Modal>
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
              <div className="flex mt-6 w-fit mx-auto">
                <button
                  disabled={result.isLoading}
                  onClick={bookingHandler}
                  className="text-center  block bg-tertiary w-[15rem] py-3 rounded-md "
                >
                  {result.isLoading ? (
                    <div className="w-[1rem] py-1">
                      <Spinner />
                    </div>
                  ) : (
                    <p>Book now</p>
                  )}
                </button>

                <button
                  onClick={messageActionHandler}
                  className="w-[15rem] ml-10 bg-gray-100 rounded-md"
                >
                  {res.isLoading ? (
                    <div className="w-[1rem] py-1">
                      <Spinner />
                    </div>
                  ) : (
                    <p>Message</p>
                  )}
                </button>
              </div>
              <div className="flex items-center mx-auto justify-center  mt-10 gap-x-8">
                {data && (
                  <InfoBox
                    title={data?.artisan.rating.toString()}
                    body="ratings"
                  />
                )}
                <InfoBox title="+3000" body="Jobs completed" />
              </div>
              <h2 className="text-xl mt-20 font-medium">
                About {data?.artisan.user.fname}
              </h2>

              <p className="font-light mt-4">
                I'm a professional house cleaner with over 8 years of
                experience. I'm detail oriented and thorough and take pride in
                my work.
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
                  <p className="text-3xl font-semibold mb-2 mr-16">
                    {data?.artisan.rating}
                  </p>
                  {data && (
                    <Rating
                      defaultValue={data.artisan.rating}
                      color="#ED802B"
                    />
                  )}
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
              <button
                onClick={() => {
                  const hasToken = hastoken("token");
                  if (!hasToken) {
                    notify(
                      "message",
                      "You need to be logged in to give a review"
                    );
                    router.push("/user/auth/login");
                  } else {
                    open();
                  }
                }}
                className="underline mt-10"
              >
                Write a review
              </button>

              <div className="">
                <h1 className="text-2xl my-10">Feedbacks</h1>
                {data && (
                  <>
                    {data?.artisan.feedbacks.length > 0 ? (
                      <div className="">
                        {data.artisan.feedbacks.map((el) => (
                          <div className="mb-10" key={el._id}>
                            <h1 className="font-semibold">
                              {el.customer_name}
                            </h1>
                            <p className="font-light">{el.feedback}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="">No feebacks</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
};

export default InfoPage;
