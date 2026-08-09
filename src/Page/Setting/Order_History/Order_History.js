import React, { useState } from "react";
import "./Order_History.css";

export default function Order_History() {
  // داتا وهمية لسجل الطلبات
  const [orders] = useState([
    {
      id: "ORD-9582",
      date: "June 25, 2026",
      total: "$120.00",
      status: "Delivered",
      items: [
        { name: "Wireless Gaming Mouse", qty: 1, price: "$50.00" },
        { name: "Mechanical Keyboard", qty: 1, price: "$70.00" },
      ],
    },
    {
      id: "ORD-4104",
      date: "June 28, 2026",
      total: "$45.00",
      status: "Processing",
      items: [{ name: "RGB Mouse Pad XL", qty: 1, price: "$45.00" }],
    },
    {
      id: "ORD-1299",
      date: "May 12, 2026",
      total: "$310.00",
      status: "Cancelled",
      items: [{ name: "HyperX Cloud II Headset", qty: 2, price: "$155.00" }],
    },
  ]);

  // الـ State لمعرفة الأوردر اللي العميل فاتح تفاصيله حالياً
  const [activeOrderId, setActiveOrderId] = useState(null);

  const toggleOrderDetails = (id) => {
    if (activeOrderId === id) {
      setActiveOrderId(null); // يقفله لو ضغط تاني
    } else {
      setActiveOrderId(id); // يفتحه
    }
  };

  // دالة مساعدة عشان ندي لون لكل حالة للطلب
  const getStatusClass = (status) => {
    switch (status) {
      case "Processing":
        return "status-processing";
      case "Delivered":
        return "status-delivered";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="orders-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Order History</h2>{" "}
        <p
          style={{
            color: "white",
            background: "#1f8aee",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          Just for experience
        </p>
      </div>

      <p className="subtitle">
        Track your recent orders and view their detailed status
      </p>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item-card">
            {/* الجزء الرئيسي للكارت */}
            <div
              className="order-main-info"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div className="info-group">
                <span className="info-label">Order ID</span>
                <span className="info-value font-bold">{order.id}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Date Placed</span>
                <span className="info-value">{order.date}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Total Amount</span>
                <span className="info-value price-text">{order.total}</span>
              </div>
              <div className="info-group">
                <span className="info-label">Status</span>
                <span
                  className={`status-badge ${getStatusClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="info-group action-group">
                <button className="view-details-btn">
                  {activeOrderId === order.id
                    ? "Hide Details ▲"
                    : "View Details ▼"}
                </button>
              </div>
            </div>

            {/* 👇 تفاصيل المنتجات المنسدلة (تظهر بالشرط) 👇 */}
            {activeOrderId === order.id && (
              <div className="order-details-dropdown">
                <h5>Items in this Order</h5>
                <div className="details-table-wrapper">
                  <table className="details-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Qty</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="product-name-td">{item.name}</td>
                          <td>{item.qty}</td>
                          <td className="font-bold">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <p className="no-orders">You haven't placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}
