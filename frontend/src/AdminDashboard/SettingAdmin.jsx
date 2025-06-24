import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [publicProfile, setPublicProfile] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user ID from localStorage or your authentication state
        const storedUser = localStorage.getItem("loggedUser");
        let userId;

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId = parsedUser.id || parsedUser.userId;
          } catch (parseError) {
            console.error("Error parsing stored user:", parseError);
            throw new Error("Invalid user data in localStorage");
          }
        }

        if (!userId) {
          throw new Error("No user ID found. Please log in again.");
        }

        // Fetch user data from your API endpoint
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data: ${response.status} ${response.statusText}`
          );
        }

        const userData = await response.json();

        // Set the fetched user data
        setLoggedUser(userData);
        setPublicProfile(userData.publicProfile || false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);

        // Fallback to sample data for demonstration
        const sampleUser = {
          id: "12345",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          city: "New York",
          country: "United States",
          password: "mypassword123",
          age: 30,
          bio: "Software developer passionate about React",
          publicProfile: false,
        };
        setLoggedUser(sampleUser);
        setPublicProfile(sampleUser.publicProfile || false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = () => {
    setPublicProfile(!publicProfile);
    // Here you could also update the backend
    // updateUserProfile({ publicProfile: !publicProfile });
  };

  const renderUserField = (label, value, icon = "👤") => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center min-w-0 flex-1">
        <span className="mr-2">{icon}</span>
        <span className="text-sm font-medium text-gray-700 ml-2 min-w-0">
          {label}:
        </span>
      </div>
      <div className="ml-4 text-right min-w-0 flex-1">
        <span className="text-sm text-gray-900 break-words">
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen rounded-2xl flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="mx-auto h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Loading User Data...
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your profile
          </p>
        </div>
      </div>
    );
  }

  if (error && !loggedUser) {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen rounded-2xl flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="mx-auto h-16 w-16 text-red-400 mb-4 text-6xl">❌</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loggedUser) {
    return (
      <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen rounded-2xl flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4 text-6xl">
            👤
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No User Logged In
          </h3>
          <p className="text-gray-600">Please log in to view profile details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Warning: Using fallback data due to API error: {error}
            </p>
          </div>
        )}
      </div>

      {/* Complete User Information Display */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 mr-6">
              {loggedUser.profilePicture ||
              loggedUser.avatar ||
              loggedUser.photo ? (
                <img
                  src={
                    loggedUser.profilePicture ||
                    loggedUser.avatar ||
                    loggedUser.photo
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}
            </div>
            <div>
              <h6 className="text-xl font-bold text-gray-800 mb-1">
                {loggedUser.name ||
                  loggedUser.fullName ||
                  loggedUser.email?.split("@")[0] ||
                  "Unknown User"}
              </h6>
              <p className="text-gray-600 text-lg">
                {loggedUser.email || "No email provided"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                User ID: {loggedUser.userId || loggedUser.id || "Not assigned"}
              </p>
            </div>
          </div>

          {/* All User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                <span className="mr-2">👤</span>
                Personal Information
              </h4>

              {renderUserField(
                "Full Name",
                loggedUser.name || loggedUser.fullName,
                "👤"
              )}
              
              {renderUserField("Email", loggedUser.email, "📧")}
              {renderUserField(
                "Phone",
                loggedUser.phone || loggedUser.phoneNumber,
                "📱"
              )}
              {renderUserField("Gender", loggedUser.gender, "⚥")}
              
            </div>

            {/* Location Information */}
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
                <span className="mr-2">📍</span>
                Location & Additional Info
              </h4>

              {renderUserField("City", loggedUser.city, "🏙️")}
              {renderUserField("Country", loggedUser.country, "🌍")}

              {renderUserField(
                "Join Date",
                loggedUser.createdAt
                  ? new Date(loggedUser.createdAt).toLocaleDateString()
                  : loggedUser.joinDate,
                "📅"
              )}

            </div>
          </div>

          {/* Security Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center text-lg">
              <span className="mr-2">🔒</span>
              Security
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                {renderUserField(
                  "Password",
                  showPassword ? loggedUser.password || "••••••••" : "••••••••",
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none hover:text-blue-600 transition-colors text-lg"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                )}
            
                {renderUserField(
                  "Role",
                  loggedUser.role || loggedUser.userRole || "User",
                  "🎭"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
