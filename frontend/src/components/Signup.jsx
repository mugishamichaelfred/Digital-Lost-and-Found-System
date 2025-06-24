import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import comput from "../assets/image1.jpg";

const Link = ({ to, children, className }) => (
  <a href={to} className={className}>
    {children}
  </a>
);

export default function Signup() {
  const navigate = useNavigate();
  const svgBackground = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2378b0a0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E")`;
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    country: "",
    gender: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Using Vite dev server proxy (recommended)
  const API_ENDPOINT = "/api/auth/signup";

  // Fallback to direct API call (will fail due to CORS)
  // const API_ENDPOINT = "https://lostandfoundapi.onrender.com/auth/signup";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Using Vite proxy - requests to /api/* will be forwarded to your backend
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          location: formData.country,
          gender: formData.gender,
          phoneNumber: formData.city,
          password: formData.password,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, try to get text response
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        );
      }

      if (response.ok) {
        // Success toast notification
        toast.success("Account created successfully! 🎉", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form
        setFormData({
          username: "",
          email: "",
          country: "",
          gender: "",
          city: "",
          password: "",
          confirmPassword: "",
        });

        // Navigate to login page after 2.5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        // Error toast notification
        toast.error(data.message || "Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      // More specific error handling with toast
      if (error.message.includes("non-JSON response")) {
        toast.error(
          "Server error: Invalid response format. Please contact support.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        toast.error(
          "Connection error: Please check if the server is running and try again.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        toast.error(error.message || "Network error. Please try again.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    // Set the height of the container to the viewport height
    const setHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Initial set
    setHeight();

    // Update on resize
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[95vh] mx-auto mt-4 max-w-[750px] rounded-lg bg-white shadow-md">
      {/* Brand side */}
      <div
        className="bg-[#003366] bg-opacity-85 bg-cover bg-center w-full md:w-1/2 flex flex-col items-center justify-center rounded-t-lg md:rounded-l-xl md:rounded-tr-none text-white p-8 md:p-10 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url(${comput})`,
        }}
      >
        <div className="mb-8 md:mb-10">
          <div className="w-[70px] h-[80px] mx-auto mb-4 rounded-full flex items-center justify-center relative">
            <div
              className="w-[60px] h-[60px]  bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: svgBackground }}
            ></div>
          </div>
          <h3 className="text-[22px] font-medium">
            Digital Lost and Found System
          </h3>
        </div>
        <p className="mb-5 text-base">Already have an account?</p>
        <Link
          to={"/login"}
          className="px-8 py-2 bg-transparent text-white border-2 border-white rounded-md text-base transition-all hover:bg-white/10"
        >
          Sign In
        </Link>
      </div>

      {/* Form side */}
      <div className="flex-1 px-6 md:px-10 py-5 flex flex-col">
        <h1 className="text-3xl font-medium mb-1">Hello!</h1>
        <p className="text-gray-500 mb-1">Please signup to continue</p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent focus:outline-none focus:border-[#78b0a0] placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent focus:outline-none focus:border-[#78b0a0] placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent focus:outline-none focus:border-[#78b0a0] placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <div className="relative">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent appearance-none focus:outline-none focus:border-[#78b0a0]"
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent focus:outline-none focus:border-[#78b0a0] placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent focus:outline-none focus:border-[#78b0a0] placeholder-gray-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showPassword ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                )}
              </svg>
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full py-3 border-b border-gray-300 text-base text-gray-800 bg-transparent focus:outline-none focus:border-[#78b0a0] placeholder-gray-400"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showConfirmPassword ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                )}
              </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#003366] text-white rounded text-base cursor-pointer transition-colors hover:bg-[#669e8d] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="relative text-center my-1">
            <div
              className="before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[calc(50%-20px)] before:h-px before:bg-gray-300 
                          after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-[calc(50%-20px)] after:h-px after:bg-gray-300"
            >
              <span className="bg-white px-2 text-sm text-gray-500 relative z-10">
                or
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            I'm already a member!{" "}
            <Link
              to="/login"
              className="text-[#78b0a0] font-medium no-underline hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
