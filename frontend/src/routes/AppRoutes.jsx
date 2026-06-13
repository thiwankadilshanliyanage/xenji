import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/public/Home";
import LoginRegister from "../pages/public/LoginRegister";
import ForgotPassword from "../pages/public/ForgotPassword";
import ResetPassword from "../pages/public/ResetPassword";
import GoogleCallback from "../pages/public/GoogleCallback";
import ListPage from "../pages/public/ListPage";
import DetailPage from "../pages/public/DetailPage";
import Contact from "../pages/public/Contact";
import StaticPage from "../pages/public/StaticPage";
import VerifyEmail from "../pages/public/VerifyEmail";

import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import Bookmarks from "../pages/user/Bookmarks";
import Notifications from "../pages/user/Notifications";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageGeneric from "../pages/admin/ManageGeneric";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageContactMessages from "../pages/admin/ManageContactMessages";
import ManageReports from "../pages/admin/ManageReports";
import AdminSettings from "../pages/admin/AdminSettings";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          <Route path="/services" element={<ListPage type="services" />} />
          <Route path="/services/:slug" element={<DetailPage type="services" />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/about" element={<StaticPage title="About Xenji" />} />
          <Route path="/privacy" element={<StaticPage title="Privacy Policy" />} />
          <Route path="/terms" element={<StaticPage title="Terms and Conditions" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<ManageGeneric type="services" />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="messages" element={<ManageContactMessages />} />
            <Route path="reports" element={<ManageReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}