import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Guest Pages/Home";
import Login from "./pages/Guest Pages/Login";
import Register from "./pages/Guest Pages/Register";
import Navbar from "./components/Pages Components/Navbar";
import Footer from "./components/Pages Components/Footer";
import AboutUs from "./pages/Guest Pages/AboutUs";
import GeneratingPage from "./components/Pages Components/GeneratingPage";
import ProjectDetail from "./pages/User Pages/ProjectDetail";
import Dashboard from "./pages/Admin Pages/Dashboard";
import Reports from "./pages/Admin Pages/Reports";
import AdminLayout from "./pages/Admin Pages/AdminLayout";
import ProjectManagement from "./pages/Admin Pages/ProjectManagement";
import UserManagement from "./pages/Admin Pages/UserManagement";
import ProjectResult from "./pages/User Pages/projectResult";
import EmailVerify from "./components/Auth Components/EmailVerify";
import ResetPassord from "./components/Auth Components/ResetPassword";
import ModelGenerator from "./pages/User Pages/ModelGenerator";
import ParentProfile from "./pages/User Pages/Profile Components/ParentProfile";
import UserLayout from "./pages/User Pages/UserLayout";
import UserHome from "./pages/User Pages/UserHome";
import UserProjects from "./pages/User Pages/UserProjects";
import Help from "./pages/User Pages/Help";
import SampleProjects from "./pages/User Pages/SampleProjects";
import Testimony from "./pages/Guest Pages/Testimony";
import Projects from "./pages/Guest Pages/Projects";
import HouseModelViewer from "./pages/User Pages/HouseModelViewer";


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
                <Route path="/email-verify" element={<EmailVerify />} />
                <Route path="/reset-password" element={<ResetPassord />} />

                <Route path="/project-detail" element={<ProjectDetail />} />
                <Route path="/profile" element={<ParentProfile/>} />
                
                <Route path="/projects" element={<Projects />} />
                <Route path="/testimony" element={<Testimony />} />
                <Route path="/about-us" element={<AboutUs />} />

                <Route path="/loading" element={<GeneratingPage />} />
                <Route path="/model-generator" element={<ModelGenerator />} />
                <Route path="/house-model-viewer" element={<HouseModelViewer />}/>
              </Routes>
              <Footer />
            </>
          }
        />
        {/* User Interface */}
        <Route path="/user/*" element={<UserLayout />}>
          <Route path="home" element={<UserHome />} />
          <Route path="project-detail" element={<ProjectDetail />} />
          <Route path="sample-projects" element={<SampleProjects />} />
          <Route path="project-result" element={<ProjectResult />} />
          <Route path="user-projects" element={<UserProjects />} />
          <Route path="help" element={<Help />} />
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
