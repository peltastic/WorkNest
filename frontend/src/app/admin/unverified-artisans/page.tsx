"use client";
import AdminLayout from "@/components/Admin/AdminLayout";
import {
  IUnverifiedArtisans,
  unverified_columns,
} from "@/components/Admin/UnverifiedArtisansColumn";
import { DataTable } from "@/components/DataTable";
import { useLazyGetUnverifiedArtisansQuery } from "@/lib/features/admin/users";
import React, { useEffect, useState } from "react";

type Props = {};

const UnverifiedArtisans = (props: Props) => {
  const [unverifiedData, setUnVerifiedData] = useState<IUnverifiedArtisans[]>(
    []
  );
  const [
    getUnverifiedArtisans,
    { isError, isFetching, isLoading, isSuccess, data, error },
  ] = useLazyGetUnverifiedArtisansQuery();

  useEffect(() => {
    getUnverifiedArtisans()
  }, []);

  useEffect(() => {
    if (data) {
      const unverified: IUnverifiedArtisans[] = data.data.map((el) => {
        return {
          city: el.user.city,
          fullname: `${el.user.fname} ${el.user.lname}`,
          id: el.user._id,
          means_of_id: el.meansOfId[0],
          profile_pic: el.profilePicture,
          email: el.user.email,
          skills: el.skills,
          state: el.user.state,
        };
      });
      setUnVerifiedData(unverified);
    }
  }, [data]);

  return (
    <AdminLayout>
      <div className=" pt-20">
        <DataTable
          columns={unverified_columns}
          data={unverifiedData}
          isFetching={isFetching}
          loaderLength={10}
          title="Unverified artisans"
        />
      </div>
    </AdminLayout>
  );
};

export default UnverifiedArtisans;
