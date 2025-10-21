import React from "react";
import OrdersTable from "../Orders/OrderTables";

const DeliveredOrders = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Delivered Orders</h2>
      <OrdersTable status="delivered" />
    </div>
  );
};

export default DeliveredOrders;
