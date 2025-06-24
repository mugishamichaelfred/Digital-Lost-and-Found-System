import { useState } from "react";
import axios from "axios";
import comput from "../assets/image1.jpg";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useAuth } from "./AuthoContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isAuthenticated, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination
  const from = location.state?.from?.pathname;

  // Redirect if already logged in
  if (isAuthenticated) {
    if (from) {
      return <Navigate to={from} replace />;
    }
    return <Navigate to={isAdmin ? "/admin" : "/userdash"} replace />;
  }

  const svgBackground = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2378b0a0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E")`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Logging in...");

    try {
      const res = await axios.post("/api/auth/login", formData);
      const token = res.data.token;
      const decoded = jwtDecode(token);

      // Update auth context
      login(decoded, token);

      toast.dismiss(loadingToast);
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        if (from) {
          navigate(from, { replace: true });
        } else {
          if (decoded.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/userdash");
          }
        }
      }, 1500);
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);
      toast.error(
        error?.response?.data?.message || error.message || "Login failed",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const Link = ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  );

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#f5f5f5] font-sans p-5 box-border">
      <div className="flex flex-col md:flex-row justify-between w-full md:w-4/5 max-w-[700px] min-h-[60px] my-8 mx-auto rounded-xl bg-white shadow-md overflow-hidden">
        {/* Left side - Brand container */}
        <div
          className="bg-[#003366] bg-opacity-85 bg-cover bg-center w-full md:w-1/2 flex flex-col items-center justify-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none text-white p-10 text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url(${comput})`,
          }}
        >
          <div className="mb-8 flex flex-col items-center">
            <div
              className="w-[60px] h-[60px] bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: svgBackground }}
            ></div>
            <h3 className="mt-4 text-2xl font-semibold">
              Digital Lost and Found System
            </h3>
          </div>
          <p>Don't have an account?</p>
          <Link to="/register" className="no-underline">
            <button className="bg-transparent border-2 border-white text-white py-2 px-8 rounded mt-4 text-base cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#003366]">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Right side - Form container */}
        <div className="w-full md:w-[55%] p-10 flex flex-col justify-center">
          <h1 className="text-gray-800 mb-2 text-4xl">Welcome Back!</h1>
          <p className="text-gray-500 mb-8">Please login to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="w-full">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div className="w-full">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded text-base focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div className="text-right -mt-2">
              <Link
                to="/forgot-password"
                className="text-[#003366] no-underline text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-[#003366] text-white border-none p-3 rounded text-base cursor-pointer transition-all duration-300 hover:bg-[#004c99] mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
