import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [handelCart, setHandelCart] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await accountService.GetProductsInCart();
        setCartItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token, handelCart]);

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  const updateQuantity = async (productId, newQty) => {
    if (!token || newQty < 1) return;

    const previousItems = cartItems;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item,
      ),
    );

    try {
      await accountService.UpdateCartQuantity(productId, newQty);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity on server:", error);
      setCartItems(previousItems);
      showError(error.response?.data || "Could not update quantity");
    }
  };

  const handleIncrease = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const handleDecrease = (productId, currentQty) => {
    if (currentQty > 1) updateQuantity(productId, currentQty - 1);
  };

  const handleDelete = async (productId) => {
    if (!token) return;

    try {
      await accountService.RemoveFromCart(productId);
      setHandelCart((prev) => prev + 1);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error deleting item from server:", error);
      showError(error.response?.data || "Could not remove item from cart");
    }
  };

  const DeleteAllProductsFromCart = async () => {
    if (!token) return;

    try {
      await accountService.RemoveAllProductsFromCart();
      setHandelCart((prev) => prev + 1);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart from server:", error);
      showError(error.response?.data || "Could not clear cart");
    }
  };

  const CartSkeleton = () => (
    <div className="checkout">
      <div className="ordersummary">
        <div className="skeleton-box" style={{ width: "180px", height: "30px", marginBottom: "20px" }} />
        <div className="items">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="skeleton-item">
              <div className="skeleton-left">
                <div className="skeleton-box skeleton-img" />
                <div className="skeleton-details">
                  <div className="skeleton-box skeleton-title" />
                  <div className="skeleton-box skeleton-price" />
                  <div className="skeleton-box skeleton-btn-group" />
                </div>
              </div>
              <div className="skeleton-box skeleton-delete" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <PageTransition>
        <CartSkeleton />
      </PageTransition>
    );
  }

  function ButtonOrder() {
    if (cartItems.length === 0) return showError("No products were found.");
    if (getSecureCookie("cth_1854")) return showError("Something went wrong");
  }

  return (
    <PageTransition>
      <title>Cart | Reda store</title>
      <div className="checkout">
        <div className="ordersummary">
          <h1>Order Summary</h1>

          {cartItems.length >= 2 && (
            <p
              onClick={DeleteAllProductsFromCart}
              className="delete-all-btn"
              style={{ textAlign: "right", color: "red", cursor: "pointer", textDecoration: "underline" }}
            >
              delete all
            </p>
          )}

          <div className="items">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                const qty = Number(item.quantity) || 1;
                const itemTotalPrice = Number(item.price || 0) * qty;

                return (
                  <div key={item.id || index} className="item-cart">
                    <div className="item-img">
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="content">
                        <h5 className="title">{item.title}</h5>
                        <p className="price">{itemTotalPrice.toFixed(2)}$</p>
                        <div className="control">
                          <button onClick={() => handleIncrease(item.id, qty)}>+</button>
                          <span className="quanty">{qty}</span>
                          <button
                            onClick={() => handleDecrease(item.id, qty)}
                            disabled={qty <= 1}
                            style={{ opacity: qty <= 1 ? 0.5 : 1, cursor: qty <= 1 ? "not-allowed" : "pointer" }}
                          >
                            -
                          </button>
                        </div>
                      </div>
                    </div>
                    <button className="delete-item" onClick={() => handleDelete(item.id)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                );
              })
            ) : (
              <h3 style={{ textAlign: "center", marginTop: "20px" }}>Your cart is empty 🛒</h3>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="order-table-container" style={{ marginTop: "30px", borderTop: "2px dashed #eee", paddingTop: "20px" }}>
              <h3>Order Details Table</h3>
              <table className="order-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Product</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "center" }}>Quantity</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "right" }}>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.id || index}>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{item.title}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "center" }}>{Number(item.quantity) || 1}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "right" }}>
                        {(Number(item.price || 0) * (Number(item.quantity) || 1)).toFixed(2)}$
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
            <Link to={getSecureCookie("cth_1854") || cartItems.length === 0 ? "/cart" : "/add-card"}>
              <button onClick={ButtonOrder} type="button">Place Order</button>
            </Link>
          </div>
        </div>
      </div>
      <ArrowUp />
    </PageTransition>
  );
}
