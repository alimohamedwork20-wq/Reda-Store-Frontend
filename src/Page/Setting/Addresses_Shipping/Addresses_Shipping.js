import React, { useEffect, useState, useCallback } from "react";
import "./Addresses_Shipping.css";
import { accountService } from "../../../Components/Apis/accountService";
import { showError, showSuccess } from "../../../Components/Helper/toastCustom";
import { getSecureCookie } from "../../../Components/Helper/cookieUtils";

export default function AddressesShipping() {
  const token = Number(getSecureCookie("tth_1854"));
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: "",
    city: "",
    details: "",
    phone: "",
    isDefault: false,
  });
  //------------------------- Get Addresses -------------------------//
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await accountService.GetAddresses();
      if (res && res.data) {
        let fetchedAddresses = res.data;
        if (fetchedAddresses.length === 1 && !fetchedAddresses[0].isDefault) {
          fetchedAddresses = fetchedAddresses.map((addr) => ({
            ...addr,
            isDefault: true,
          }));
        }
        setAddresses(fetchedAddresses);
      }
    } catch (error) {
      showError("Error fetching addresses");
    }
  }, [token]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  //------------------------- handle Input Change -------------------------//
  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  //------------------------- Add Address -------------------------//
  const handleAddAddress = async (e) => {
    e.preventDefault();
    const addressToAdd = {
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    try {
      await accountService.AddAddress(addressToAdd);

      // إعادة جلب البيانات لضمان الحصول على الـ ID الحقيقي من الـ Database
      await fetchAddresses();

      setNewAddress({
        title: "",
        city: "",
        details: "",
        phone: "",
        isDefault: false,
      });
      setShowForm(false);
      showSuccess("Address added successfully!");
    } catch (error) {
      showError("Error adding address");
    }
  };

  //------------------------- Delete Address -------------------------//
  const handleDelete = async (id) => {
    const previousAddresses = [...addresses];

    setAddresses((prev) => prev.filter((address) => address.id !== id));

    try {
      await accountService.DeleteAddress(id);
      await fetchAddresses();
      showSuccess("Address deleted!");
    } catch (error) {
      setAddresses(previousAddresses);
      showError("Error deleting address");
    }
  };

  //------------------------- Set Default Address -------------------------//
  const handleSetDefault = async (id) => {
    const previousAddresses = [...addresses];
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );

    try {
      await accountService.SetDefaultAddress(id);
      showSuccess("Default shipping address updated!");
    } catch (error) {
      // Rollback لو حصل خطأ
      setAddresses(previousAddresses);
      showError("Error setting default address");
    }
  };

  return (
    <div className="shipping-container">
      <div className="shipping-header">
        <div>
          <h2>Addresses / Shipping</h2>
          <p className="subtitle">
            Manage your shipping addresses for fast checkout
          </p>
        </div>
        <button
          className="add-address-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add New Address"}
        </button>
      </div>

      {/* ➕ فورمة إضافة عنوان جديد */}
      {showForm && (
        <form onSubmit={handleAddAddress} className="address-form-card">
          <h3>New Shipping Address</h3>
          <div className="inputs-grid">
            <div className="input-group">
              <label>Address Title (e.g., Home, Work)</label>
              <input
                type="text"
                name="title"
                value={newAddress.title}
                onChange={handleInputChange}
                placeholder="Enter address title"
                required
              />
            </div>
            <div className="input-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                placeholder="e.g., Tanta, Cairo"
                required
              />
            </div>
            <div className="input-group full-width">
              <label>Detailed Address</label>
              <input
                type="text"
                name="details"
                value={newAddress.details}
                onChange={handleInputChange}
                placeholder="Street name, Building number, Apartment..."
                required
              />
            </div>
            <div className="input-group">
              <label>Contact Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                placeholder="Phone number for delivery"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-address-btn">
              Save Address
            </button>
          </div>
        </form>
      )}

      {/* 🗺️ عرض العناوين الحالية */}
      <div className="addresses-grid">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`address-card ${address.isDefault ? "default" : ""}`}
          >
            {address.isDefault && (
              <span className="default-badge">Default</span>
            )}
            <div className="address-card-header">
              <h4>{address.title}</h4>
              <button
                className="delete-addr-btn"
                onClick={() => handleDelete(address.id)}
              >
                <i className="fa-solid fa-trash-can"></i> Delete
              </button>
            </div>
            <p className="addr-city">
              <strong>City:</strong> {address.city}
            </p>
            <p className="addr-details">
              <strong>Details:</strong> {address.details}
            </p>
            <p className="addr-phone">
              <strong>Phone:</strong> {address.phone}
            </p>

            {!address.isDefault && (
              <button
                className="set-default-btn"
                onClick={() => handleSetDefault(address.id)}
              >
                Set as Default
              </button>
            )}
          </div>
        ))}

        {addresses.length === 0 && !showForm && (
          <p className="no-addresses">
            No addresses found. Please add a shipping address.
          </p>
        )}
      </div>
    </div>
  );
}
