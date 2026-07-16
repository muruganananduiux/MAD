import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const campaignData = [
  {
    id: 1,
    title: "Flood Relief",
    ngo: "Helping Hands",
    goal: "₹5,00,000",
    status: "Pending",
  },
  {
    id: 2,
    title: "Education Fund",
    ngo: "Smile Foundation",
    goal: "₹2,00,000",
    status: "Approved",
  },
  {
    id: 3,
    title: "Medical Support",
    ngo: "Hope Trust",
    goal: "₹1,50,000",
    status: "Rejected",
  },
];

export default function AdminCampaigns() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const campaigns = campaignData.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.ngo.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      status === "All" ? true : item.status === status;

    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout title="Campaign Approval">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Search Campaign..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 10,
            width: 300,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 8,
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 10,
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
              <th style={{ padding: 15 }}>Campaign</th>
              <th>NGO</th>
              <th>Goal</th>
              <th>Status</th>
              <th width="320">Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((item) => (
              <tr
                key={item.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={{ padding: 15 }}>{item.title}</td>

                <td>{item.ngo}</td>

                <td>{item.goal}</td>

                <td>{item.status}</td>

                <td>

                  <Link
                    to={`/admin/campaign/${item.id}`}
                    style={viewBtn}
                  >
                    View
                  </Link>

                  <button style={approveBtn}>
                    Approve
                  </button>

                  <button style={rejectBtn}>
                    Reject
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
  padding: "8px 14px",
  textDecoration: "none",
  borderRadius: 6,
  marginRight: 8,
};

const approveBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  marginRight: 8,
  cursor: "pointer",
};

const rejectBtn = {
  background: "#f97316",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  marginRight: 8,
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};