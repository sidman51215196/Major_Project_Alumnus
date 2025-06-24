import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBill,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Sidebar = () => {

  const {user} = useAuth()
  
  return (
    <aside className="bg-gray-900 text-gray-200 h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="bg-teal-500 h-14 flex items-center justify-center">
        <h3 className="text-black font-bold text-lg tracking-wide">
          EMPLOYEE HUB
        </h3>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavLink
          to="/employee-dashboard"
          end
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white" : "hover:bg-gray-800"} 
            flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200`
          }
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/profile/${user._id}`}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white" : "hover:bg-gray-800"} 
            flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200`
          }
        >
          <FaUser />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/leaves/${user._id}`}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white" : "hover:bg-gray-800"} 
            flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200`
          }
        >
          <FaBuilding />
          <span>Leaves</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/salary/${user._id}`}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white" : "hover:bg-gray-800"} 
            flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200`
          }
        >
          <FaCalendarAlt />
          <span>Salary</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/setting"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white" : "hover:bg-gray-800"} 
            flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200`
          }
        >
          <FaCogs />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
