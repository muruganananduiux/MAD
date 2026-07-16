import React from "react";
import AdminLayout from "../components/AdminLayout";

export default function AdminCampaignDetails() {
  return (
    <AdminLayout title="Campaign Details">

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,.08)"
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "30px"
          }}
        >

          <img
            src="https://images.unsplash.com/photo-1469571486292-b53601020f1f?w=700"
            alt="campaign"
            style={{
              width: "100%",
              borderRadius: "10px"
            }}
          />

          <div>

            <h2>Flood Relief Campaign</h2>

            <hr />

            <p><b>NGO :</b> Helping Hands Foundation</p>

            <p><b>Category :</b> Disaster Relief</p>

            <p><b>Goal :</b> ₹5,00,000</p>

            <p><b>Raised :</b> ₹2,10,000</p>

            <p><b>Status :</b> Pending</p>

            <p><b>Created :</b> 18 July 2025</p>

          </div>

        </div>

        <br />

        <h3>Description</h3>

        <p>
          This campaign is created for helping flood affected families by
          providing food, shelter and medical support.
        </p>

        <br />

        <h3>Uploaded Documents</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >

          <thead>

            <tr
              style={{
                background: "#2563eb",
                color: "#fff"
              }}
            >

              <th style={{padding:"12px"}}>Document</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td style={{padding:"12px"}}>NGO Registration.pdf</td>

              <td>Verified</td>

              <td>

                <button style={viewBtn}>
                  View
                </button>

              </td>

            </tr>

            <tr>

              <td style={{padding:"12px"}}>80G Certificate.pdf</td>

              <td>Pending</td>

              <td>

                <button style={viewBtn}>
                  View
                </button>

              </td>

            </tr>

          </tbody>

        </table>

        <br />

        <div
          style={{
            display:"flex",
            gap:"20px"
          }}
        >

          <button style={approveBtn}>
            Approve Campaign
          </button>

          <button style={rejectBtn}>
            Reject Campaign
          </button>

          <button style={deleteBtn}>
            Delete Campaign
          </button>

        </div>

      </div>

    </AdminLayout>
  );
}

const approveBtn={
background:"#16a34a",
color:"#fff",
padding:"12px 22px",
border:"none",
borderRadius:"8px",
cursor:"pointer"
};

const rejectBtn={
background:"#f97316",
color:"#fff",
padding:"12px 22px",
border:"none",
borderRadius:"8px",
cursor:"pointer"
};

const deleteBtn={
background:"#dc2626",
color:"#fff",
padding:"12px 22px",
border:"none",
borderRadius:"8px",
cursor:"pointer"
};

const viewBtn={
background:"#2563eb",
color:"#fff",
padding:"8px 15px",
border:"none",
borderRadius:"6px",
cursor:"pointer"
};