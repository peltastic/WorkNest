"use client"
import { IOrders, orders_columns } from "@/components/Admin/Orders";
import ProLayout from "@/components/Pro/ProLayout";
import { useLazyGetArtisanBookingQuery } from "@/lib/features/pro/booking";
import React, { useEffect, useState } from "react";
import moment from "moment"
import { DataTable } from "@/components/DataTable";

type Props = {};

const OrdersPage = (props: Props) => {
  const [ordersData, setOrdersData] = useState<IOrders[]>([]);
  const [
    getOrders,
    { isError, isFetching, isLoading, isSuccess, data, error },
  ] = useLazyGetArtisanBookingQuery();

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (data) {
      const orders: IOrders[] = data.bookings.map((el) => {
        return {
          customer: `${el.customer.fname} ${el.customer.lname}`,
          date: moment(el.createdAt).format("ll"),
          phone: el.customer.phone,
          status: el.customer.phone
        };
      });
      setOrdersData(orders);
    }
  }, [data]);

  return (
    <ProLayout>
        <div className=" pt-20">
        <DataTable
          columns={orders_columns}
          data={ordersData}
          isFetching={isFetching}
          loaderLength={10}
          title="Your Orders"
          emptyHeader="No orders"
        />
      </div>
    </ProLayout>
  );
};

export default OrdersPage;
