import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const ngoData = [
  {
    id: 1,
    name: "Helping Hands",
    email: "help@gmail.com",
    reg: "NGO001",
    status: "Pending",
  },
  {
    id: 2,
    name: "Smile Foundation",
    email: "smile@gmail.com",
    reg: "NGO002",
    status: "Approved",
  },
  {
    id: 3,
    name: "Hope Trust",
    email: "hope@gmail.com",
    reg: "NGO003",
    status: "Rejected",
  },
];

export default function AdminNGOs() {
  const [search, setSearch] = useState("");

  const ngos = ngoData.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="NGO Management">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search NGO..."
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
          + Add NGO
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
              <th style={{ padding: "14px" }}>NGO</th>
              <th>Email</th>
              <th>Registration</th>
              <th>Status</th>
              <th width="320">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ngos.map((ngo) => (
              <tr
                key={ngo.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={{ padding: "14px" }}>{ngo.name}</td>

                <td>{ngo.email}</td>

                <td>{ngo.reg}</td>

                <td>
                  <span
                    style={{
                      background:
                        ngo.status === "Approved"
                          ? "#16a34a"
                          : ngo.status === "Pending"
                          ? "#f59e0b"
                          : "#dc2626",
                      color: "#fff",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                    }}
                  >
                    {ngo.status}
                  </span>
                </td>

                <td>
                  <button style={viewBtn}>View</button>

                  <button style={approveBtn}>Approve</button>

                  <button style={rejectBtn}>Reject</button>

                  <button style={deleteBtn}>Delete</button>
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

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  marginRight: "8px",
  cursor: "pointer",
};

const rejectBtn = {
  background: "#f97316",
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