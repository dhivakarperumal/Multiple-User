import React from "react";
import OrdersTable from "../Orders/OrderTables";

const ReturnedOrders = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Return Orders</h2>
      <OrdersTable status="returned" />
    </div>
  );
};

export default ReturnedOrders;
