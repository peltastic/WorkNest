"use client";
import Layout from "@/components/Layout";
import { Select } from "@mantine/core";
import { IoIosArrowDown } from "react-icons/io";

import classes from "@/app/styles/Select.module.css";

import React, { useEffect, useState } from "react";
import CustomSearch from "@/components/CustomSearch";
import {
  useFetchServicesQuery,
  useLazyFetchServicesQuery,
} from "@/lib/features/services";
import ServiceFeedSkeleton from "@/components/Skeletons/ServiceFeedSkeleton";
import ServiceCard from "@/components/ServiceCard";
import { RiSearchLine } from "react-icons/ri";

type Props = {};

const icon = <IoIosArrowDown />;

const ServiceFeedPage = (props: Props) => {
  const [search, setSearch] = useState<string>("");
  const [getServices, { isFetching, data }] = useLazyFetchServicesQuery();
  const [dataVal, setDataVal] = useState<
    {
      name: string;
      rating: number;
      reviews: number;
      service: string;
      id: string;
      profilePic: string;
    }[]
  >([]);

  useEffect(() => {
    getServices({
      limit: 10,
    });
  }, []);

  useEffect(() => {
    if (search) {
      getServices({
        skills: search,
        limit: 10,
      });
    } else {
      getServices({
        limit: 0,
      });
    }
  }, [search]);

  useEffect(() => {
    if (data) {
      setDataVal(
        data.artisans.map((el) => {
          return {
            id: el._id,
            name: `${el.user.fname} ${el.user.lname}`,
            rating: 0,
            reviews: 0,
            service: el.skills,
            profilePic: el.profilePicture,
          };
        })
      );
    }
  }, [data]);

  return (
    <Layout>
      <section className="max-w-[70rem] mx-auto">
        <div className="flex gap-4">
          <div className="w-[6rem]">
            <Select
              classNames={{ input: classes.input }}
              label
              placeholder="Rating"
              data={[
                {
                  label: "1",
                  value: "1",
                },
                {
                  label: "2",
                  value: "2",
                },
                {
                  label: "3",
                  value: "3",
                },
                {
                  label: "4",
                  value: "4",
                },
                {
                  label: "5",
                  value: "5",
                },
                {
                  label: "All",
                  value: "all",
                },
              ]}
              onChange={(val) => {
                if (val) {
                  if (val === "all") {
                    getServices({ limit: 10 });
                  } else {
                    getServices({ limit: 10, rating: val });
                  }
                }
              }}
              rightSection={icon}
            />
          </div>
          {/* <div className="">
            <Select
              classNames={{ input: classes.input }}
              label
              placeholder="Service"
              data={[]}
              rightSection={icon}
            />
          </div> */}
          <div className="">
            <Select
              classNames={{ input: classes.input }}
              label
              placeholder="Location"
              data={[
                {
                  label: "Magbodo",
                  value: "Magbodo",
                },
                {
                  label: "Eleyele",
                  value: "Eleyele",
                },
                {
                  label: "All",
                  value: "All"
                }
              ]}
              onChange={(val) => {
                if (val) {
                  if (val === "all") {
                    getServices({ limit: 10 });
                  } else {
                    getServices({ limit: 10, location: val });
                  }
                }
              }}
              rightSection={icon}
            />
          </div>
          <div className="">
            <Select
              classNames={{ input: classes.input }}
              label
              placeholder="Reviews"
              data={[]}
              rightSection={icon}
            />
          </div>
        </div>
        <div className="w-full relative h-fit  mt-6">
          <div className="absolute left-4 top-[50%] -translate-y-1/2">
            <RiSearchLine className="text-primary" />
          </div>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for services"
            className="py-3 px-10 bg-tertiary w-full outline-none placeholder:text-primary rounded-lg"
          />
        </div>
        {/* <CustomSearch /> */}
        <h1 className="mt-10 text-2xl font-semibold">Featured artisans</h1>
        <div className="grid grid-cols-5 gap-10 mt-10">
          {isFetching ? (
            <>
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
              <ServiceFeedSkeleton />
            </>
          ) : (
            <>
              {dataVal.map((el) => (
                <ServiceCard data={el} key={el.id} />
              ))}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ServiceFeedPage;

// const data = [
//   {
//     name: "James Oni",
//     rating: 4.2,
//     reviews: 59,
//     service: "Plumber",
//     id: "1",
//   },
//   {
//     name: "Esther Ebube",
//     rating: 4.1,
//     reviews: 141,
//     service: "Catering services",
//     id: "2",
//   },
//   {
//     name: "Ikechukwu Jeremiah",
//     rating: 2.7,
//     reviews: 99,
//     service: "Phone repairs",
//     id: "3",
//   },
//   {
//     name: "Gift Chekube",
//     rating: 4.2,
//     reviews: 90,
//     service: "Phone & Laptop repairs",
//     id: "4",
//   },
//   {
//     name: "Ayomide Richards",
//     rating: 4.5,
//     reviews: 80,
//     service: "Electonics repairs",
//     id: "5",
//   },
//   {
//     name: "Florence Sowore",
//     rating: 4.1,
//     reviews: 34,
//     service: "Hairdresser",
//     id: "6",
//   },
//   {
//     name: "Mohammed Ja",
//     rating: 4.4,
//     reviews: 30,
//     service: "Plumber",
//     id: "7",
//   },
//   {
//     name: "Kelvin Chidera",
//     rating: 2.9,
//     reviews: 500,
//     service: "Painter",
//     id: "8",
//   },
//   {
//     name: "Praise Johns",
//     rating: 3.5,
//     reviews: 20,
//     service: "Painter",
//     id: "9",
//   },
//   {
//     name: "Solomon Oyeleye",
//     rating: 4.4,
//     reviews: 91,
//     service: "Dispatch rider",
//     id: "10",
//   },
//   {
//     name: "Fasolate",
//     rating: 4.3,
//     reviews: 49,
//     service: "Catering services",
//     id: "11",
//   },
//   {
//     name: "Drew Cleaners",
//     rating: 3.7,
//     reviews: 74,
//     service: "Dry cleaning services",
//     id: "12",
//   },
//   {
//     name: "Mariana Jesutomiwa",
//     rating: 3,
//     reviews: 80,
//     service: "Furniture",
//     id: "13",
//   },
//   {
//     name: "Jesica Maweri",
//     rating: 4.5,
//     reviews: 90,
//     service: "Photographer",
//     id: "14",
//   },
//   {
//     name: "Jesu Saka",
//     rating: 4.3,
//     reviews: 21,
//     service: "Car repairs",
//     id: "15",
//   },
//   {
//     name: "James Oni",
//     rating: 3.3,
//     reviews: 40,
//     service: "Make up artist",
//     id: "16",
//   },
//   {
//     name: "Tolu Jesufemi",
//     rating: 4.1,
//     reviews: 89,
//     service: "Catering services",
//     id: "17",
//   },
//   {
//     name: "Sodiq Bello",
//     rating: 3.9,
//     reviews: 100,
//     service: "Plumber",
//     id: "18",
//   },
//   {
//     name: "Tajudeen Abiodun",
//     rating: 4,
//     reviews: 120,
//     service: "Photographer",
//     id: "19",
//   },
//   {
//     name: "Iyanu Bello",
//     rating: 4.5,
//     reviews: 2,
//     service: "Welder",
//     id: "20",
//   },
// ];
