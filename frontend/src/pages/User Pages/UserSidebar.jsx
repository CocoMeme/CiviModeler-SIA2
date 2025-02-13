import { NavLink, Link } from "react-router-dom"; // added NavLink
import { FaPlus, FaHome, FaQuestionCircle } from "react-icons/fa";
import { LuFolderOpen } from "react-icons/lu";

const UserSidebar = () => {
  return (
    <div className="w-1/6 p-5 flex flex-col justify-between bg-slate-200">
      <div>
        {/* Top Part */}
        <div className="flex justify-center items-center mb-5">
          <Link to="/">
            <img src="/images/CiviModeler - NBG.png" alt="Logo" className="size-8 mr-3" />
          </Link>
          <Link to="/">
            <h3 className="font-extrabold text-gradient">CIVIMODELER</h3>
          </Link>
        </div>

        {/* Navigation Part */}
        <ul className="flex justify-between my-4">
          <li className="flex items-center">
            <NavLink
              to="/user/home"
              className={({ isActive }) =>
                `min-w-full p-2 flex items-center bg-slate-50 hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
              }
            >
              <FaHome className="inline mr-2" /> Home
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink
              to="/user/projects"
              className={({ isActive }) =>
                `p-2 flex items-center bg-slate-50 hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
              }
            >
              <LuFolderOpen className="inline mr-2" /> Projects
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink
              to="/user/help"
              className={({ isActive }) =>
                `p-2 flex items-center bg-slate-50 hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
              }
            >
              <FaQuestionCircle className="inline mr-2" /> Help
            </NavLink>
          </li>
        </ul>

        {/* Menus & Option Part */}
        <ul>
          <li className="mb-2">
            <Link to="/user/project-detial" className="flex items-center justify-center text-white p-2 bg-purple-700 hover:bg-purple-400 rounded">
              <FaPlus className="inline mr-3" /> Create Project
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/user/project-detial" className="flex items-center justify-center p-2 bg-slate-50 hover:bg-purple-200 rounded">
              <LuFolderOpen className="inline mr-3" /> Sample Project
            </Link>
          </li>
          {/* <li className="mb-2">
            <Link to="/user/home" className="block p-2 hover:bg-gray-400 rounded">
              <FaHome className="inline mr-1" /> Home
            </Link>
          </li> */}

          {/* List of the recent projects */}
          <li className="mt-4 mb-2 block p-2 text-sm">
            Recent Projects
          </li>

        </ul>

      </div>
      <button className="bg-slate-400 hover:bg-slate-300 p-2 rounded text-center">
        Logout
      </button>
    </div>
  );
};

export default UserSidebar;
