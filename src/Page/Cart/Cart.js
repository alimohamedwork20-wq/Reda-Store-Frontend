import React, { useContext, useEffect, useState } from "react";
import "./cart.css";
import PageTransition from "../../Components/Helper/PageTransition";
import ArrowUp from "../../Components/Helper/ArrowUp";
import { accountService } from "../../Components/Apis/accountService";
import toast from "react-hot-toast";
import { getSecureCookie } from "../../Components/Helper/cookieUtils";
import { Link } from "react-router-dom";
import { showError } from "../../Components/Helper/toastCustom";

export default function Cart() {
  const token = getSecureCookie("tth_1854");
  const userId = getSecureCookie("ith_1854");
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [handelCart, setHandelCart] = useState(0);

  //------------------- Get Product To Cart -------------------//
  useEffect(() => {
    const fetchCartItems = async () => {
      if (token && userId) {
        try {
          setLoading(true);
          const response = await accountService.GetProductsInCart(userId);
          setCartItems(response.data);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCartItems();
  }, [token, userId, handelCart]);

  //------------------- Total Price -------------------//
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );

  //------------------- Update Quantity Functions -------------------//
  const handleIncrease = async (productId, currentQty) => {
    const newQty = currentQty + 1;
    updateQuantity(productId, newQty);
  };

  const handleDecrease = async (productId, currentQty) => {
    // يمنع النقصان إذا كانت الكمية 1 أو أقل
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    updateQuantity(productId, newQty);
  };

  const updateQuantity = async (productId, newQty) => {
    // 1. تحديث الـ State محلياً لسرعة الاستجابة (Optimistic Update)
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item,
      ),
    );

    // 2. إرسال التحديث للـ Backend إذا كان لديك API مخصص لتحديث الكمية
    if (token && userId) {
      try {
        if (accountService.UpdateCartQuantity) {
          await accountService.UpdateCartQuantity(userId, productId, newQty);
        }
      } catch (error) {
        console.error("Error updating quantity on server:", error);
      }
    }
  };

  //------------------- Delete Product From Cart -------------------//
  const handleDelete = async (productId) => {
    if (token && userId) {
      try {
        await accountService
          .RemoveFromCart(userId, productId)
          .then(() => setHandelCart((prev) => prev + 1))
          .then(() => window.dispatchEvent(new Event("cartUpdated")));
        toast.success("Item removed from cart");
      } catch (error) {
        console.error("Error deleting item from server:", error);
      }
    }
  };

  //------------------- Delete All Product From Cart -------------------//
  const DeleteAllProductsFromCart = async () => {
    if (token && userId) {
      try {
        await accountService
          .RemoveAllProductsFromCart(userId)
          .then(() => setHandelCart((prev) => prev + 1))
          .then(() => window.dispatchEvent(new Event("cartUpdated")));
        toast.success("Cart cleared");
      } catch (error) {
        console.error("Error clearing cart from server:", error);
      }
    }
  };

  //------------------- Loading -------------------//
  if (loading && cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading Cart...
      </div>
    );
  }
  //------------------- Handel Order -------------------//

  function ButtonOrder() {
    if (cartItems.length == 0) {
      return showError("No products were found.");
    }
    if (getSecureCookie("cth_1854")) {
      return showError("Something went wrong");
    }
  }
  return (
    <PageTransition>
      <div className="checkout">
        <div className="ordersummary">
          <h1>Order Summary</h1>

          {cartItems.length >= 2 && (
            <p
              onClick={DeleteAllProductsFromCart}
              className="delete-all-btn"
              style={{
                textAlign: "right",
                color: "red",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              delete all
            </p>
          )}

          <div className="items">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                const qty = item.quantity || 1;
                const itemTotalPrice = item.price * qty;

                return (
                  <div key={item.id || index} className="item-cart">
                    <div className="item-img">
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="content">
                        <h5 className="title">{item.title}</h5>
                        <p className="price">{itemTotalPrice.toFixed(2)}$</p>
                        <div className="control">
                          <button onClick={() => handleIncrease(item.id, qty)}>
                            +
                          </button>
                          <span className="quanty">{qty}</span>
                          <button
                            onClick={() => handleDecrease(item.id, qty)}
                            disabled={qty <= 1}
                            style={{
                              opacity: qty <= 1 ? 0.5 : 1,
                              cursor: qty <= 1 ? "not-allowed" : "pointer",
                            }}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="delete-item"
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                );
              })
            ) : (
              <h3 style={{ textAlign: "center", marginTop: "20px" }}>
                Your cart is empty 🛒
              </h3>
            )}
          </div>

          {cartItems.length > 0 && (
            <div
              className="order-table-container"
              style={{
                marginTop: "30px",
                borderTop: "2px dashed #eee",
                paddingTop: "20px",
              }}
            >
              <h3>Order Details Table</h3>
              <table
                className="order-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      Product
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        textAlign: "center",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        textAlign: "right",
                      }}
                    >
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.id || index}>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {item.title}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity || 1}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        {(item.price * (item.quantity || 1)).toFixed(2)}$
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="btn-summary" style={{ marginTop: "20px" }}>
            <div className="shop-table">
              <p>Grand Total:</p>
              <span className="total-checkout">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="btn-order">
            <Link
              to={
                getSecureCookie("cth_1854") || cartItems.length == 0
                  ? "/cart"
                  : "/add-card"
              }
            >
              <button onClick={ButtonOrder} type="button">
                Place Order
              </button>
            </Link>
          </div>
        </div>
      </div>
      <ArrowUp />
    </PageTransition>
  );
}
