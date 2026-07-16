import React from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminSettings() {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <h2>Settings</h2>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <h3>Admin Profile</h3>

          <br />

          <label>Name</label>

          <input
            type="text"
            defaultValue="Admin"
            style={input}
          />

          <label>Email</label>

          <input
            type="email"
            defaultValue="admin@gmail.com"
            style={input}
          />

          <label>New Password</label>

          <input
            type="password"
            placeholder="********"
            style={input}
          />

          <button style={saveBtn}>
            Save Changes
          </button>

          <button style={logoutBtn}>
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "6px"
};

const saveBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: "6px",
  marginRight: "15px",
  cursor: "pointer"
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "12px 25px",
  borderRadius: "6px",
  cursor: "pointer"
};