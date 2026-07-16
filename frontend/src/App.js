import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from './lib/auth';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnnouncementBar from './components/layout/AnnouncementBar';
import ScrollToTop from './components/layout/ScrollToTop';

// Admin
import AdminDashboard from './pages/AdminDashboard';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminCampaignDetails from './pages/AdminCampaignDetails';
import AdminUsers from './pages/AdminUsers';
import AdminNGOs from './pages/AdminNGOs';
import AdminDonations from './pages/AdminDonations';
import AdminSettings from './pages/AdminSettings';

// Public
import Home from './pages/Home';
import Causes from './pages/Causes';
import HowItWorks from './pages/HowItWorks';
import WaysToGive from './pages/WaysToGive';
import Stories from './pages/Stories';
import TrustSafety from './pages/TrustSafety';
import AllCauses from './pages/AllCauses';
import LiveCampaigns from './pages/LiveCampaigns';
import CorporateCSR from './pages/CorporateCSR';
import NGOPartnerships from './pages/NGOPartnerships';
import About from './pages/About';
import OurImpact from './pages/OurImpact';
import Careers from './pages/Careers';
import HelpCenter from './pages/HelpCenter';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StartFundraiser from './pages/StartFundraiser';
import Donate from './pages/Donate';
import Payment from './pages/Payment';
import MonthlyDonation from './pages/MonthlyDonation';
import CampaignDetail from './pages/CampaignDetail';
import NotFound from './pages/NotFound';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />

      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Navbar />}

      <Routes>
        {/* Admin routes — protected, admin-only */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/campaign/:id" element={<AdminCampaignDetails />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/ngos" element={<AdminNGOs />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Auth-required user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/start-fundraiser" element={<StartFundraiser />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/:id" element={<Donate />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/ways-to-give" element={<WaysToGive />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/trust-safety" element={<TrustSafety />} />
        <Route path="/all-causes" element={<AllCauses />} />
        <Route path="/live-campaigns" element={<LiveCampaigns />} />
        <Route path="/corporate-csr" element={<CorporateCSR />} />
        <Route path="/ngo-partnerships" element={<NGOPartnerships />} />
        <Route path="/about" element={<About />} />
        <Route path="/our-impact" element={<OurImpact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/monthly-donation" element={<MonthlyDonation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdmin && <Footer />}

      <Toaster position="top-right" richColors />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
