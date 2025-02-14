import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import GeneratingPage from "./components/GeneratingPage";
import ProjectDetail from "./pages/User Pages/ProjectDetail";
import Dashboard from "./pages/Admin Pages/Dashboard";
import Reports from "./pages/Admin Pages/Reports";
import AdminLayout from "./pages/Admin Pages/AdminLayout";
import ProjectManagement from "./pages/Admin Pages/ProjectManagement";
import UserManagement from "./pages/Admin Pages/UserManagement";
import ProjectResult from "./pages/User Pages/projectResult";
import EmailVerify from "./components/EmailVerify";
import ResetPassord from "./components/ResetPassword";
import ModelGenerator from "./pages/User Pages/ModelGenerator";
// React Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ParentProfile from "./pages/User Pages/Profile Components/ParentProfile";
import UserLayout from "./pages/User Pages/UserLayout";
import UserHome from "./pages/User Pages/UserHome";


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
                <Route path="/model-generator" element={<ModelGenerator />} />
              </Routes>
              <Footer />
            </>
          }
        />
        {/* User Interface */}
        <Route path="/user/*" element={<UserLayout />}>
          <Route path="home" element={<UserHome />} />
          <Route path="project-detial" element={<ProjectDetail />} />
        </Route>

        {/* Admin Interface */}
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
