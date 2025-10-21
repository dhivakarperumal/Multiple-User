import React, { useEffect, useState } from "react";
import { db } from "../../Componets/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";

const ORDER_STATUSES = [
  "orderplaced",
  "packing",
  "shipping",
  "outfordelivery",
  "delivered",
  "cancelled",
];

const OrdersTable = ({ status, todayOnly = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelInputId, setCancelInputId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    let q;

    if (status === "all") {
      q = query(ordersRef, orderBy("createdAt", "desc"));
    } else {
      q = query(ordersRef, where("status", "==", status), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (todayOnly) {
          const today = new Date();
          ordersData = ordersData.filter((order) => {
            const created = order.createdAt?.toDate?.();
            return (
              created?.getDate() === today.getDate() &&
              created?.getMonth() === today.getMonth() &&
              created?.getFullYear() === today.getFullYear()
            );
          });
        }

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [status, todayOnly]);

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === "cancelled") {
      setCancelInputId(orderId);
      setCancelReason("");
    } else {
      updateStatus(orderId, newStatus);
    }
  };

  const updateStatus = async (orderId, newStatus, reason = "") => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        cancelReason: reason || "",
        updatedAt: serverTimestamp(),
      });
      toast.success(`Order status updated to ${newStatus}`);
      setCancelInputId(null);
      setCancelReason("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleCancelSubmit = (orderId) => {
    if (!cancelReason.trim()) {
      toast.error("Please enter a cancellation reason");
      return;
    }
    updateStatus(orderId, "cancelled", cancelReason);
  };

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found for today.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 border">Order ID</th>
            <th className="py-2 px-4 border">Customer</th>
            <th className="py-2 px-4 border">Items</th>
            <th className="py-2 px-4 border">Total</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center border-b">
              <td className="py-2 px-4 border">{order.orderId || order.id}</td>
              <td className="py-2 px-4 border">{order.customer?.name || order.userId}</td>
              <td className="py-2 px-4 border">{order.cartItems?.length || 0}</td>
              <td className="py-2 px-4 border">₹{order.totalPrice || 0}</td>
              <td className="py-2 px-4 border">
                {cancelInputId === order.id ? (
                  <div className="flex flex-col items-center">
                    <input
                      type="text"
                      placeholder="Enter cancel reason"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="border px-2 py-1 rounded mb-1"
                    />
                    <button
                      onClick={() => handleCancelSubmit(order.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <select
                    className="border px-2 py-1 rounded"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
                {order.status === "cancelled" && order.cancelReason && (
                  <p className="text-xs text-red-600 mt-1">Reason: {order.cancelReason}</p>
                )}
              </td>
              <td className="py-2 px-4 border">
                {order.createdAt?.toDate?.().toLocaleString() || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
