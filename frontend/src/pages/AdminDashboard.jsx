import React from "react";
import AdminLayout from "../components/AdminLayout";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const donationData = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 18000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 24000 },
  { month: "May", amount: 30000 },
  { month: "Jun", amount: 22000 },
];

const Card = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    }}
  >
    <h4 style={{ color: "#666", marginBottom: "10px" }}>{title}</h4>

    <h2 style={{ color: "#2563eb", margin: 0 }}>{value}</h2>
  </div>
);

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
        }}
      >
        <Card title="Total Users" value="120" />
        <Card title="Total NGOs" value="18" />
        <Card title="Campaigns" value="42" />
        <Card title="Donations" value="₹4,25,000" />
      </div>

    <div
  style={{
    background: "#fff",
    marginTop: "30px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 10px rgba(0,0,0,.08)",
  }}
>
  <h3>Monthly Donations</h3>

  <div style={{ width: "100%", height: "300px" }}>
    <ResponsiveContainer>
      <BarChart data={donationData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      <div
        style={{
          marginTop: "30px",
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 3px 10px rgba(0,0,0,.08)",
        }}
      >
        <h3>Recent Campaigns</h3>

        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#2563eb", color: "#fff" }}>
              <th style={{ padding: "12px" }}>Campaign</th>
              <th>NGO</th>
              <th>Status</th>
              <th>Goal</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ padding: "12px" }}>Flood Relief</td>
              <td>Helping Hands</td>
              <td>Pending</td>
              <td>₹5,00,000</td>
            </tr>

            <tr>
              <td style={{ padding: "12px" }}>Food Drive</td>
              <td>Smile Foundation</td>
              <td>Approved</td>
              <td>₹2,50,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}