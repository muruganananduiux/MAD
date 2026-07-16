import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const userData = [
  {
    id: 1,
    name: "Murugan",
    email: "murugan@gmail.com",
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Rahul",
    email: "rahul@gmail.com",
    role: "NGO",
    status: "Pending",
  },
  {
    id: 3,
    name: "Admin",
    email: "admin@gmail.com",
    role: "Admin",
    status: "Active",
  },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");

  const users = userData.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Users Management">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search User..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          + Add User
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#2563eb",
                color: "#fff",
              }}
            >
              <th style={{ padding: "14px" }}>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th width="260">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={{ padding: "14px" }}>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.role}</td>

                <td>
                  <span
                    style={{
                      background:
                        user.status === "Active"
                          ? "#16a34a"
                          : "#f59e0b",
                      color: "#fff",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                    }}
                  >
                    {user.status}
                  </span>
                </td>

                <td>

                  <button style={viewBtn}>
                    View
                  </button>

                  <button style={editBtn}>
                    Edit
                  </button>

                  <button style={deleteBtn}>
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
}

const viewBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
};

const editBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};