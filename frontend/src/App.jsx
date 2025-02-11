import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import GeneratingPage from "./pages/GeneratingPage";
import ProjectDetail from "./pages/User Pages/ProjectDetail";
import Dashboard from "./pages/Admin Pages/Dashboard";
import Reports from "./pages/Admin Pages/Reports";
import AdminLayout from "./pages/Admin Pages/AdminLayout";
import ProjectManagement from "./pages/Admin Pages/ProjectManagement";
import UserManagement from "./pages/Admin Pages/UserManagement";
import ProjectResult from "./pages/User Pages/projectResult";
import EmailVerify from "./components/EmailVerify";
import ResetPassord from "./components/ResetPassword";
// React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParentProfile from "./pages/User Pages/Profile Components/ParentProfile";


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/email-verify" element={<EmailVerify />} />
                <Route path="/reset-password" element={<ResetPassord />} />
                <Route path="/loading" element={<GeneratingPage />} />
                <Route path="/project-detail" element={<ProjectDetail />} />
                <Route path="/project-result" element={<ProjectResult />} />

                <Route path="/profile" element={<ParentProfile/>} />
              </Routes>
              <Footer />
            </>
          }
        />

        {/* Admin Pages with Sidebar (No Navbar & Footer) */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="project-management" element={<ProjectManagement />} />
          <Route path="user-management" element={<UserManagement />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
