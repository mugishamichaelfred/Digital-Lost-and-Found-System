import React, { useState } from "react";
import keyboard from "../assets/keyboard.jpg";
import comput from "../assets/comput.jpg";
import homei from "../assets/image1.jpg";
import { mycontext } from "../Context/ContextProvider";
import ReportFoundItem from "./ReportFoundItem";
import ClaimForm from "./ClaimForm";


const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const stats = {
    itemsFound: 532,
    itemsReturned: 489,
    activeUsers: 1250,
    successRate: 92,
  };
  const { booking, tour } = mycontext();

  // Mock data for recent items
  const recentItems = booking.slice(0, 4);
  const Lostitems = tour.slice(0, 4);


  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative py-20 px-4 md:px-16 lg:px-60 text-center text-white flex-1"
        style={{
          background: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url(${homei})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight">
            Digital Lost and Found System
          </h2>

          <div className="rounded-lg py-8 px-6 mb-10 backdrop-blur-sm">
            <p className="leading-7 w-full text-base md:text-base text-left">
              Our Lost and Found System provides a centralized platform for
              Every one to report and search for lost items. Simply register on
              Digital Lost and Found System with your email, then you can report
              lost items or items you've found on Every Where. When reporting,
              include detailed descriptions, Date, Few Personal Information,
              location you Found or Lost item.
            </p>
          </div>

          <div className="w-full md:w-3/5 mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex shadow-lg rounded-lg overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search for lost or found items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-white py-3 px-5 text-base outline-none text-gray-700"
              />
              <button
                type="submit"
                className="bg-[#006699] hover:bg-[#00557a] text-white px-6 py-3 font-bold text-base transition-colors duration-200"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#f1f5f9"
            ></path>
          </svg>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#f5f7fa] to-white">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold text-[#003366]">How It Works</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex-1 min-w-[220px] max-w-[280px] text-center p-8 bg-white rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-[60px] h-[60px] bg-[#003366] text-[#ffd700] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl mb-3 text-[#003366]">Register</h3>
              <p className="text-gray-600 text-sm">
                Sign up using your UKM email to access all features
              </p>
            </div>
            <div className="flex-1 min-w-[220px] max-w-[280px] text-center p-8 bg-white rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-[60px] h-[60px] bg-[#003366] text-[#ffd700] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl mb-3 text-[#003366]">Report</h3>
              <p className="text-gray-600 text-sm">
                Submit details about lost or found items with photos
              </p>
            </div>
            <div className="flex-1 min-w-[220px] max-w-[280px] text-center p-8 bg-white rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-[60px] h-[60px] bg-[#003366] text-[#ffd700] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl mb-3 text-[#003366]">Connect</h3>
              <p className="text-gray-600 text-sm">
                Get notified when a matching item is found or claimed
              </p>
            </div>
            <div className="flex-1 min-w-[220px] max-w-[280px] text-center p-8 bg-white rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <div className="w-[60px] h-[60px] bg-[#003366] text-[#ffd700] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl mb-3 text-[#003366]">Retrieve</h3>
              <p className="text-gray-600 text-sm">
                Verify ownership and safely retrieve your belongings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-20 px-6 bg-[#f5f7fa]">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold text-[#003366]">Recent Items</h2>
            <a
              href="/all-items"
              className="text-[#003366] hover:text-[#0055b3] font-medium"
            >
              View All Items
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Lostitems.map((item) => (
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100">
                {/* Status Badge */}
                <div
                  className={`absolute top-3 left-3 py-1 px-3 rounded-full text-xs font-semibold z-10 ${
                    item.type === "found"
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {item.type === "found" ? "Found" : "Found"}
                </div>

                {/* Image Container with Overlay */}
                <div className="relative w-full h-40 overflow-hidden">
                  <img src={item.itemImage} alt={item.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <p size={16} className="mr-2 text-indigo-600">
                        Location:
                      </p>
                      {item.location}
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                      <p size={16} className="mr-2 text-indigo-600">
                        Date:{" "}
                      </p>
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    onClick={openReportModal}
                    className="mt-2 inline-flex items-center justify-center w-full py-2 px-4 bg-[#003366] hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Claim Item
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100">
                {/* Status Badge */}
                <div
                  className={`absolute top-3 left-3 py-1 px-3 rounded-full text-xs font-semibold z-10 ${
                    item.type === "found"
                      ? "bg-emerald-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {item.type === "found" ? "Found" : "Lost"}
                </div>

                {/* Image Container with Overlay */}
                <div className="relative w-full h-40 overflow-hidden">
                  <img src={item.itemImage} alt={item.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <p size={16} className="mr-2 text-indigo-600">
                        Location:
                      </p>
                      {item.location}
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                      <p size={16} className="mr-2 text-indigo-600">
                        Date:{" "}
                      </p>
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Button */}
                  <a className="mt-2 inline-flex items-center justify-center w-full py-2 px-4 bg-[#003366] hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200">
                    Claim Item
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-[#f5f7fa]">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-bold text-[#003366]">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg text-[#003366] mb-3">
                How long are items kept before disposal?
              </h3>
              <p className="text-gray-600">
                Items are kept for 30 days before they are considered for
                disposal or donation, according to university policy.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg text-[#003366] mb-3">
                How do I prove an item belongs to me?
              </h3>
              <p className="text-gray-600">
                You will need to correctly answer security questions set by the
                finder and may need to provide specific details about the item
                that only the owner would know.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg text-[#003366] mb-3">
                Who can use this platform?
              </h3>
              <p className="text-gray-600">
                This platform is primarily for UKM students, faculty, and staff.
                Registration requires a valid UKM email address.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg text-[#003366] mb-3">
                What information should I include when reporting?
              </h3>
              <p className="text-gray-600">
                Include clear photos, detailed description, location where the
                item was lost/found, date and time, and any identifying
                features.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="/faq"
              className="inline-block py-2 px-6 border border-[#003366] rounded-md text-[#003366] hover:bg-[#003366] hover:text-white transition-colors"
            >
              View All FAQs
            </a>
          </div>
        </div>
      </section>
      <ClaimForm isOpen={isReportModalOpen} onClose={closeReportModal} />
    </div>
  );
};

export default Home;
