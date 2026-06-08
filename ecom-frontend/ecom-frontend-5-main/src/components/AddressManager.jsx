import React, { useState, useEffect, useContext } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  isDefault: false,
};

const AddressManager = () => {
  const { isLoggedIn, addToast } = useContext(AppContext);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("/address");
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`/address/${editingId}`, form);
        addToast("Address updated successfully!", "success");
      } else {
        await axios.post("/address", form);
        addToast("Address added successfully!", "success");
      }
      setForm({ ...emptyForm });
      setShowForm(false);
      setEditingId(null);
      fetchAddresses();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Failed to save address";
      addToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (addr) => {
    setForm({
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      country: addr.country,
      pincode: addr.pincode,
      isDefault: addr.default || addr.isDefault || false,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/address/${id}`);
      addToast("Address deleted", "info");
      fetchAddresses();
    } catch (error) {
      addToast("Failed to delete address", "error");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axios.put(`/address/default/${id}`);
      addToast("Default address updated", "success");
      fetchAddresses();
    } catch (error) {
      addToast("Failed to set default address", "error");
    }
  };

  const handleCancel = () => {
    setForm({ ...emptyForm });
    setShowForm(false);
    setEditingId(null);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ marginTop: "80px", padding: "20px", textAlign: "center" }}>
        <i className="bi bi-geo-alt" style={{ fontSize: "3rem", color: "#999" }}></i>
        <h4 style={{ marginTop: "1rem" }}>Please login to manage addresses</h4>
        <a href="/login" className="btn btn-primary mt-3">Login</a>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "80px", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
            <i className="bi bi-geo-alt-fill" style={{ color: "#6366f1" }}></i>
            My Addresses
          </h2>
          {!showForm && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setForm({ ...emptyForm });
                setEditingId(null);
                setShowForm(true);
              }}
            >
              <i className="bi bi-plus-lg me-1"></i>Add Address
            </button>
          )}
        </div>

        {/* Address Form */}
        {showForm && (
          <div style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            background: "#fafafa",
          }}>
            <h5 style={{ marginBottom: "16px" }}>
              {editingId ? "Edit Address" : "Add New Address"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isDefault"
                      checked={form.isDefault}
                      onChange={handleChange}
                      id="isDefaultCheck"
                    />
                    <label className="form-check-label" htmlFor="isDefaultCheck">
                      Set as default address
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update" : "Save Address"}
                </button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <i className="bi bi-geo-alt" style={{ fontSize: "3rem", color: "#ccc" }}></i>
            <h5 style={{ marginTop: "1rem", color: "#666" }}>No addresses saved</h5>
            <p style={{ color: "#999" }}>Add an address for faster checkout</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  border: `2px solid ${(addr.default || addr.isDefault) ? "#6366f1" : "#e0e0e0"}`,
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#fff",
                  position: "relative",
                }}
              >
                {(addr.default || addr.isDefault) && (
                  <span style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "#6366f1",
                    color: "#fff",
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}>
                    Default
                  </span>
                )}
                <strong>{addr.fullName}</strong>
                <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "#555" }}>
                  {addr.addressLine1}
                  {addr.addressLine2 && `, ${addr.addressLine2}`}
                  <br />
                  {addr.city}, {addr.state} - {addr.pincode}
                  <br />
                  {addr.country}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: "#888" }}>
                  <i className="bi bi-telephone me-1"></i>{addr.phoneNumber}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(addr)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(addr.id)}>
                    <i className="bi bi-trash3 me-1"></i>Delete
                  </button>
                  {!(addr.default || addr.isDefault) && (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleSetDefault(addr.id)}>
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManager;
