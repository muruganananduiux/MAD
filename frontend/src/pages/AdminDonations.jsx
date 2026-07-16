import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const donationData = [
  {
    id: 1,
    donor: "Murugan",
    campaign: "Flood Relief",
    amount: "₹500",
    payment: "Success",
    date: "12-06-2025",
    txn: "TXN1001",
  },
  {
    id: 2,
    donor: "Rahul",
    campaign: "Food Drive",
    amount: "₹1000",
    payment: "Success",
    date: "13-06-2025",
    txn: "TXN1002",
  },
  {
    id: 3,
    donor: "Priya",
    campaign: "Education Fund",
    amount: "₹250",
    payment: "Pending",
    date: "14-06-2025",
    txn: "TXN1003",
  },
];

export default function AdminDonations() {
  const [search, setSearch] = useState("");

  const donations = donationData.filter(
    (d) =>
      d.donor.toLowerCase().includes(search.toLowerCase()) ||
      d.campaign.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Donation Management">

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <Card title="Total Amount" value="₹12,50,000" />
        <Card title="Today's Donation" value="₹8,500" />
        <Card title="Monthly Donation" value="₹2,35,000" />
        <Card title="Transactions" value="254" />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search Donation..."
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
          Export CSV
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
              <th style={{ padding: "14px" }}>Donor</th>
              <th>Campaign</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Transaction</th>
              <th>Date</th>
              <th width="180">Action</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((item) => (
              <tr
                key={item.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <td style={{ padding: "14px" }}>{item.donor}</td>
                <td>{item.campaign}</td>
                <td>{item.amount}</td>

                <td>
                  <span
                    style={{
                      background:
                        item.payment === "Success"
                          ? "#16a34a"
                          : "#f59e0b",
                      color: "#fff",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                    }}
                  >
                    {item.payment}
                  </span>
                </td>

                <td>{item.txn}</td>

                <td>{item.date}</td>

                <td>
                  <button style={viewBtn}>Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <h4>{title}</h4>
      <h2 style={{ color: "#2563eb" }}>{value}</h2>
    </div>
  );
}

const viewBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};