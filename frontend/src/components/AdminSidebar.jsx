import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Megaphone,
  HeartHandshake,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { LOGOUT } from "../constants/testIds/auth";

const menus = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin", testId: "admin-nav-dashboard" },
  { name: "Users", icon: <Users size={18} />, path: "/admin/users", testId: "admin-nav-users" },
  { name: "NGOs", icon: <Building2 size={18} />, path: "/admin/ngos", testId: "admin-nav-ngos" },
  { name: "Campaigns", icon: <Megaphone size={18} />, path: "/admin/campaigns", testId: "admin-nav-campaigns" },
  { name: "Donations", icon: <HeartHandshake size={18} />, path: "/admin/donations", testId: "admin-nav-donations" },
  { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings", testId: "admin-nav-settings" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      style={{
        width: "250px",
        background: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        padding: "25px 15px",
      }}
      data-testid="admin-sidebar"
    >
      <h2 style={{ textAlign: "center", marginBottom: "35px", color: "#38bdf8" }}>MAD Admin</h2>

      {menus.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          data-testid={item.testId}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "13px",
            marginBottom: "10px",
            borderRadius: "10px",
            textDecoration: "none",
            color: "#fff",
            background: location.pathname === item.path ? "#2563eb" : "transparent",
            transition: "0.3s",
          }}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}

      <div style={{ marginTop: "40px" }}>
        <button
          onClick={handleLogout}
          data-testid={LOGOUT.button}
          style={{
            width: "100%",
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
