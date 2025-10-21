import React from "react";
import OrdersTable from "../Orders/OrderTables";

const NewOrders = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">New Orders</h2>
      <OrdersTable status="new" />
    </div>
  );
};

export default NewOrders;
