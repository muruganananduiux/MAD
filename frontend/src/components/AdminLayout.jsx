import React from "react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../lib/auth";

export default function AdminLayout({ title, children }) {
  const { user } = useAuth();
  return (
    <div style={{ display: "flex", background: "#f1f5f9" }} data-testid="admin-layout">
      <AdminSidebar />

      <div style={{ flex: 1, minHeight: "100vh" }}>
        <div
          style={{
            background: "#fff",
            padding: "18px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 data-testid="admin-page-title">{title}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
              }}
              data-testid="admin-user-badge"
            >
              {user ? `${user.name} · ${user.role}` : "Admin"}
            </div>
          </div>
        </div>

        <div style={{ padding: 30 }} data-testid="admin-page-content">{children}</div>
      </div>
    </div>
  );
}
