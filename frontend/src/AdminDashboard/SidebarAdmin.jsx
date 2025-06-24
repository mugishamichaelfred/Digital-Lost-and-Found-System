import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart2, FileText, Users, Settings } from "lucide-react";
import { IoMdClock, IoMdSettings } from "react-icons/io";
import { FaChartLine, FaUserDoctor, FaUsers } from "react-icons/fa6";
import {
  MdOutlineAppSettingsAlt,
  MdPayment,
  MdSupportAgent,
} from "react-icons/md";

const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <IoMdClock className="h-5 w-5 mr-3" />,
    },
    {
      name: "Users",
      path: "user",
      icon: <FaUsers className="h-5 w-5 mr-3" />,
    },
    {
      name: "Messages",
      path: "contact",
      icon: <FaUserDoctor className="h-5 w-5 mr-3" />,
    },
    {
      name: "Found Items",
      path: "founditem",
      icon: <MdOutlineAppSettingsAlt className="h-5 w-5 mr-3" />,
    },
    {
      name: "Lost Items",
      path: "lostitem",
      icon: <MdPayment className="h-5 w-5 mr-3" />,
    },
    {
      name: "Settings",
      path: "adminsetting",
      icon: <IoMdSettings className="h-5 w-5 mr-3" />,
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);

    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`bg-white w-50 shadow-md flex-shrink-0 transition-all duration-300 ease-in-out fixed md:relative h-full z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      }`}
    >
      <nav className="p-4 h-full overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            // Check if current path includes this item's path for more reliable active state
            const isActive =
              (currentPath === "/admin" && item.path === "/admin") ||
              (item.path !== "/admin" && currentPath.includes(item.path));

            return (
              <li key={index}>
                <div
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center px-4 py-2 rounded-md w-full text-left cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "bg-[#EFF6FF] text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
