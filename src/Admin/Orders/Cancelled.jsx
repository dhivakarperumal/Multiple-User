import React from "react";
import OrdersTable from "../Orders/OrderTables";

const CancelledOrders = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cancelled Orders</h2>
      <OrdersTable status="cancelled" />
    </div>
  );
};

export default CancelledOrders;
