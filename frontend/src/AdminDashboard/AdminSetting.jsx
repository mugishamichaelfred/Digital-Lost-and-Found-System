import { useState, useEffect } from 'react';
import { User, Save, Camera } from 'lucide-react';

// Mock user data - in a real application this would come from an API
const initialUserData = {
  name: "John Doe",
  email: "a12345@siswa.ukm.edu.my",
  matricNumber: "A12345",
  faculty: "Fakulti Teknologi dan Sains Maklumat",
  phone: "012-3456789",
  profilePicture: null
};

export default function AdminSetting() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on component mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    // In a real application, this would be an API call to update the profile
    console.log("Saving profile data:", userData);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setUserData(initialUserData);
    setIsEditing(false);
  };
  
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // In a real application, you would upload this to a server
      // For now, just create a local URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData(prev => ({
          ...prev,
          profilePicture: event.target.result
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white py-4 px-6">
          <h1 className="text-xl font-bold">Profile Settings</h1>
        </div>
        
        <div className="md:flex">
          {/* Sidebar with profile picture (visible on desktop) */}
          <div className="md:w-1/3 bg-gray-50 p-8 hidden md:block">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userData.profilePicture ? (
                    <img 
                      src={userData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label 
                    htmlFor="profile-picture" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
                  >
                    <Camera size={20} />
                    <input 
                      type="file" 
                      id="profile-picture" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{userData.matricNumber}</p>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <button 
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile picture for mobile view */}
          <div className="p-6 md:hidden">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {userData.profilePicture ? (
                    <img 
                      src={userData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={36} className="text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label 
                    htmlFor="profile-picture-mobile" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
                  >
                    <Camera size={16} />
                    <input 
                      type="file" 
                      id="profile-picture-mobile" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-lg font-bold mb-1">{userData.name}</h2>
              <p className="text-gray-600 text-xs mb-4">{userData.matricNumber}</p>
            </div>
          </div>
          
          {/* Form content */}
          <div className="md:w-2/3 p-6">
            <div className="mb-6 md:hidden">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  UKM Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matricNumber">
                  Matric Number
                </label>
                <input
                  id="matricNumber"
                  name="matricNumber"
                  type="text"
                  value={userData.matricNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="faculty">
                  Faculty
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  value={userData.faculty}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <option value="Fakulti Teknologi dan Sains Maklumat">Fakulti Teknologi dan Sains Maklumat</option>
                  <option value="Fakulti Ekonomi dan Pengurusan">Fakulti Ekonomi dan Pengurusan</option>
                  <option value="Fakulti Kejuruteraan dan Alam Bina">Fakulti Kejuruteraan dan Alam Bina</option>
                  <option value="Fakulti Pendidikan">Fakulti Pendidikan</option>
                  <option value="Fakulti Sains dan Teknologi">Fakulti Sains dan Teknologi</option>
                  <option value="Fakulti Sains Sosial dan Kemanusiaan">Fakulti Sains Sosial dan Kemanusiaan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}