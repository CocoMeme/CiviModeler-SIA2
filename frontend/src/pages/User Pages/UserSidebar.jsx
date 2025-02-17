import { NavLink, Link } from "react-router-dom"; 
import { FaPlus } from "react-icons/fa";
import { LuFolderOpen } from "react-icons/lu";
import { RiFolder3Fill } from "react-icons/ri";
import { BiSolidDashboard } from "react-icons/bi";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";
import RecentProjectSidebar from "../../components/Project Components/RecentProjectSidebar";


const UserSidebar = () => {
  return (
    <div className="min-h-full p-5 flex flex-col justify-between bg-slate-200 rounded-lg m-3">
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
        <div className="bg-white py-0.5 mb-2 rounded-md">
          <ul className="flex justify-evenly my-4">
            <li className="flex items-center justify-center">
              <NavLink
                to="/user/home"
                className={({ isActive }) =>
                  `w-full p-1 flex justify-center items-center  hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
                }
              >
                <BiSolidDashboard className="text-xl sm:text-2xl" />
              </NavLink>
            </li>
            <li className="flex items-center justify-center">
              <NavLink
                to="/user/user-projects"
                className={({ isActive }) =>
                  `w-full p-1 flex justify-center items-center  hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
                }
              >
                <RiFolder3Fill className="text-xl sm:text-2xl" />
              </NavLink>
            </li>
            <li className="flex items-center justify-center">
              <NavLink
                to="/user/settings"
                className={({ isActive }) =>
                  `w-full p-1 flex justify-center items-center  hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
                }
              >
                <FaGear className="text-xl sm:text-2xl" />
              </NavLink>
            </li>
            <li className="flex items-center justify-center">
              <NavLink
                to="/user/help"
                className={({ isActive }) =>
                  `w-full p-1 flex justify-center items-center hover:bg-slate-300 rounded ${isActive ? "ring-2 ring-purple-500" : ""}`
                }
              >
                <BsFillQuestionSquareFill className="text-xl sm:text-2xl" />
              </NavLink>
            </li>
          </ul>
        </div>


        {/* Menus & Option Part */}
        <ul>
          <li className="mb-2">
            <Link to="/user/project-detail" className="flex items-center justify-center text-white p-2 bg-purple-700 hover:bg-purple-600 rounded">
              <FaPlus className="inline mr-3" /> Create Project
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/user/sample-projects" className="flex items-center justify-center p-2 bg-slate-50 hover:bg-purple-200 rounded">
              <LuFolderOpen className="inline mr-3" /> Sample Project
            </Link>
          </li>

          {/* List of the recent projects */}
          <li className="mt-4 mb-2 block p-2 text-sm">
            Recent Projects
          </li>
          <RecentProjectSidebar/>

        </ul>

      </div>
      <button className="hover:bg-purple-200 p-2 rounded text-center ring-2 ring-purple-300">
        Logout
      </button>
    </div>
  );
};

export default UserSidebar;
