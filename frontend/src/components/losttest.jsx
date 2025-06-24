import { useState } from "react";
import comput from "../assets/image1.jpg";
import ReportItemForm from "./ReportLostItemForm";
import bluebag from "../assets/bluebag.jpg";
import iphone from "../assets/iphone.jpg";  
import carkey from "../assets/carkeys.jpg";
import silverwatch from "../assets/silverwatch.jpg";
import laptop from "../assets/laptop.jpg";
import laptopcharger from "../assets/laptopcharger.jpg";
import Wallet from "../assets/wallet.jpg";

// Pagination component
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page numbers array
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8">
      <nav>
        <ul className="flex space-x-1">
          {/* Previous button */}
          <li>
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              &laquo;
            </button>
          </li>

          {/* Page numbers */}
          {pageNumbers.map((number) => {
            // Show current page, first, last and pages +/- 1 from current
            if (
              number === 1 ||
              number === totalPages ||
              (number >= currentPage - 1 && number <= currentPage + 1)
            ) {
              return (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number
                        ? "bg-[#003366] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                </li>
              );
            }

            // Show ellipsis for gaps
            if (number === currentPage - 2 || number === currentPage + 2) {
              return (
                <li key={`ellipsis-${number}`}>
                  <span className="px-3 py-1">...</span>
                </li>
              );
            }

            return null;
          })}

          {/* Next button */}
          <li>
            <button
              onClick={() =>
                currentPage < totalPages && paginate(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default function LostItems() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const lostItems = [
    {
      id: 1,
      title: "Blue Backpack",
      date: "April 23, 2025",
      status: "Unclaimed",
      imageUrl: bluebag,
    },
    {
      id: 2,
      title: "iPhone 17 Pro",
      date: "April 25, 2025",
      status: "Unclaimed",
      imageUrl: iphone,
    },
    {
      id: 3,
      title: "Car Keys",
      date: "April 22, 2025",
      status: "Unclaimed",
      imageUrl: carkey,
    },
    {
      id: 4,
      title: "Reading Glasses",
      date: "April 20, 2025",
      status: "Unclaimed",
      imageUrl: comput,
    },
    {
      id: 5,
      title: "Silver Watch",
      date: "April 19, 2025",
      status: "Unclaimed",
      imageUrl: silverwatch,
    },
    {
      id: 6,
      title: "Wallet",
      date: "April 24, 2025",
      status: "Unclaimed",
      imageUrl: Wallet,
    },
    {
      id: 7,
      title: "Laptop Charger",
      date: "April 26, 2025",
      status: "Unclaimed",
      imageUrl: laptopcharger,
    },
    {
      id: 12,
      title: "Laptop",
      date: "April 15, 2025",
      status: "Unclaimed",
      imageUrl: laptop,
    },
    {
      id: 8,
      title: "Umbrella",
      date: "April 21, 2025",
      status: "Unclaimed",
      imageUrl: "/api/placeholder/400/320",
    },
    {
      id: 9,
      title: "Water Bottle",
      date: "April 18, 2025",
      status: "Unclaimed",
      imageUrl: "/api/placeholder/400/320",
    },
    {
      id: 10,
      title: "Student ID Card",
      date: "April 17, 2025",
      status: "Unclaimed",
      imageUrl: "/api/placeholder/400/320",
    },
    {
      id: 11,
      title: "Wireless Earbuds",
      date: "April 16, 2025",
      status: "Unclaimed",
      imageUrl: "/api/placeholder/400/320",
    },
  ];

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lostItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleReportSubmit = (formData) => {
    console.log("Report submitted:", formData);
    closeReportModal();
    alert("Your lost item report has been submitted successfully!");
  };

  return (
    <div className="font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] bg-[#f5f5f5] w-full min-h-screen m-0 overflow-x-hidden pb-12">
      {/* Header Section with Wave */}
      <header
        className="relative pt-16 pb-24 px-5 bg-[#003366] bg-opacity-85 bg-cover bg-center text-center text-white mb-16"
        style={{
          background: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url(${comput})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">Lost Items</h1>
          <p className="font-light text-lg max-w-lg mx-auto">
            Found something? Lost something? We're here to help reconnect people
            with their belongings.
          </p>
          <button
            className="mt-6 bg-white text-[#003366] border-none py-2 px-5 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1"
            onClick={openReportModal}
          >
            Report Lost Item
          </button>
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#f5f5f5"
            ></path>
          </svg>
        </div>
      </header>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[90%] mx-auto">
        {currentItems.map((property) => (
          <div
            key={property.id}
            className="h-64 w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg bg-cover bg-center"
          >
            <div className="w-full h-40 overflow-hidden">
              <img
                src={property.imageUrl}
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white text-black flex flex-col justify-end">
              <div className="p-4 mt-auto">
                <h3 className="text-lg font-semibold mb-1 uppercase">
                  {property.title}
                </h3>
                <div className="flex mb-2">
                  <span className="text-sm">{property.date}</span>
                </div>
                <div className="text-xs opacity-75 mb-3">{property.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={lostItems.length}
        currentPage={currentPage}
        paginate={paginate}
      />

      {/* Report Item Form Modal */}
      <ReportItemForm
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
