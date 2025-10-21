import React from "react";
import OrdersTable from "../Orders/OrderTables";

const AllOrders = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <OrdersTable status="all" />
    </div>
  );
};

export default AllOrders;
