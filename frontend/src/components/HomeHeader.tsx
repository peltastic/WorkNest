import React from "react";
import Image from "next/image";
import HeroImg from "../../public/hero-img.svg";
import DesignBg1 from "../../public/design-bg1.svg";
import DesignBg2 from "../../public/design-bg2.svg";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import Link from "next/link";

type Props = {};

const HomeHeader = (props: Props) => {
  return (
    <header className="h-[100vh] bg-bg1 px-10 relative overflow-hidden">
      <div className="w-fit absolute -top-[80rem] -left-[50rem] opacity-45 ">
        <Image src={DesignBg2} alt="design-bg" className="w-[100rem]" />
      </div>
      <section className="flex text-black1 items-center h-full w-full ">
        <section className="w-[50%]">
          <h1 className="leading-[1.2] text-[5rem] font-light">
            Find & Book Artisans Book Near You!
          </h1>
          <button className="mt-10 text-white bg-black1 px-4 py-2 rounded-md">
            Find now
          </button>
          <div className="flex mt-10 gap-x-8">
            <div className=" bg-[#ed7f2b3c] rounded-xl w-[15rem] px-6 py-6">
              <h2 className=" text-lg">For Customer</h2>
              <p className="font-light mt-6">
                Create an account to be able to book a service, track orders,
                message artisan professional and lot more
              </p>
              <div className="flex">
                <Link
                  className="w-fit ml-auto cursor-pointer"
                  href={"/user/auth/register"}
                >
                  <div>
                    <BsArrowUpRightCircleFill className="text-white text-3xl ml-auto mt-5" />
                  </div>
                </Link>
              </div>
            </div>
            <div className="bg-[#F2EDE8] w-[15rem] px-6 py-6 rounded-xl">
              <h2 className="text-lg">For Pro</h2>
              <p className="font-light mt-6">
                Go through our screening process, and be able to register and
                showcase your services to a wide range of customers.
              </p>
              <div className="flex mt-5">
                <Link href={"/pro/get-started"} className="w-fit ml-auto cursor-pointer">
                  <div className="">
                    <BsArrowUpRightCircleFill className="text-white text-3xl ml-auto" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="h-full w-[50%] relative z-10">
          <Image src={HeroImg} alt="hero-img" className="w-[50rem]" />
        </section>
      </section>
      <div className="w-fit absolute -bottom-[50rem] -right-[40rem] opacity-45 ">
        <Image src={DesignBg1} alt="design-bg" className="w-[100rem]" />
      </div>
    </header>
  );
};

export default HomeHeader;
