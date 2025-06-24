import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  // Function to check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Function to get link classes with active state
  const getLinkClasses = (path) => {
    const baseClasses =
      "px-4 py-2 block md:inline-block rounded text-base transition-colors duration-200";
    const activeClasses = "text-yellow-400 bg-white/20 font-semibold";
    const inactiveClasses = "text-white hover:bg-white/10";

    return `${baseClasses} ${
      isActiveLink(path) ? activeClasses : inactiveClasses
    }`;
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled ? "bg-[#003366] shadow-lg" : "bg-[#003366] shadow-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-white no-underline">
            <span className="text-xl font-bold">
              {" "}
              Digital Lost and Found System
            </span>
          </Link>
        </div>

        {/* Hamburger Menu */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            className="flex flex-col justify-between h-6 w-8 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span
              className={`bg-white h-0.5 w-full rounded transition-all duration-300 ${
                menuOpen ? "transform rotate-45 translate-y-2.5" : ""
              }`}
            ></span>
            <span
              className={`bg-white h-0.5 w-full rounded transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`bg-white h-0.5 w-full rounded transition-all duration-300 ${
                menuOpen ? "transform -rotate-45 -translate-y-2.5" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <div
          className={`fixed md:static top-0 ${
            menuOpen ? "right-0" : "-right-full"
          } md:right-auto h-screen md:h-auto w-4/5 md:w-auto max-w-sm md:max-w-none bg-blue-900 md:bg-transparent md:flex items-center transition-all duration-300 z-50 md:z-auto
          pt-20 md:pt-0 px-6 md:px-0 overflow-y-auto md:overflow-visible shadow-lg md:shadow-none`}
        >
          <ul className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-1 list-none p-0 m-0 w-full">
            <li>
              <Link
                to="/"
                className={getLinkClasses("/")}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/lost"
                className={getLinkClasses("/lost")}
                onClick={() => setMenuOpen(false)}
              >
                Lost Items
              </Link>
            </li>
            <li>
              <Link
                to="/found"
                className={getLinkClasses("/found")}
                onClick={() => setMenuOpen(false)}
              >
                Found Items
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className={getLinkClasses("/contact")}
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div></div>
            ) : (
              <div className="md:ml-4 mt-6 md:mt-0 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2">
                <li>
                  <Link
                    to="/login"
                    className={`block w-full md:w-auto text-center border border-white px-6 py-2 rounded transition-colors duration-200 ${
                      isActiveLink("/login")
                        ? "bg-white text-blue-900 font-semibold"
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`block w-full md:w-auto text-center font-medium px-6 py-2 rounded transition-colors duration-200 ${
                      isActiveLink("/register")
                        ? "bg-yellow-500 text-blue-900 font-bold"
                        : "bg-yellow-400 text-blue-900 hover:bg-yellow-300"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
