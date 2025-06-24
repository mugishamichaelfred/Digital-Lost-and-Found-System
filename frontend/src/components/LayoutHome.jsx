import { Route } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Outlet} from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
// Removed the CSS import since we're using Tailwind now

function LayoutHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={user} logout={logout} />

      <main className="flex-1 w-full mx-auto">
        <div>
        <Outlet/>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LayoutHome;
