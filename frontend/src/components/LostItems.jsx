// File: components/LostItems.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import comput from "../assets/image1.jpg";
import ReportItemForm from "./ReportLostItemForm";

// Helper function to format dates
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Pagination component
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8">
      <nav>
        <ul className="flex space-x-1">
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
          {pageNumbers.map((number) => {
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
            if (number === currentPage - 2 || number === currentPage + 2) {
              return (
                <li key={`ellipsis-${number}`}>
                  <span className="px-3 py-1">...</span>
                </li>
              );
            }
            return null;
          })}
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

const LostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const response = await axios.get("/api/lostItems");
        setLostItems(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lost items:", error);
        setLoading(false);
      }
    };
    fetchLostItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(lostItems);
    } else {
      const filtered = lostItems.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.itemName?.toLowerCase().includes(searchLower) ||
          item.ownerName?.toLowerCase().includes(searchLower) ||
          item.location?.toLowerCase().includes(searchLower) ||
          item.serialNumber?.toLowerCase().includes(searchLower) ||
          item._id?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredItems(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, lostItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const handleReportSubmit = (formData) => {
    console.log("Report submitted:", formData);
    closeReportModal();
    alert("Your lost item report has been submitted successfully!");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] bg-[#f5f5f5] w-full min-h-screen m-0 overflow-x-hidden pb-12">
      {/* Header */}
      <header
        className="relative pt-16 pb-24 px-5 bg-[#003366] bg-opacity-85 bg-cover bg-center text-center text-white mb-16"
        style={{
          background: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url(${comput})`,
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">Lost Items</h1>
          <p className="font-light text-lg max-w-lg mx-auto">
            Found something? Lost something? We're here to help reconnect people
            with their belongings.
          </p>
          <button
            className="mt-6 bg-white text-[#003366] py-2 px-5 rounded-lg font-semibold text-base cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1"
            onClick={openReportModal}
          >
            Report Lost Item
          </button>
        </div>

        {/* Wave SVG */}
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

      {/* Search Section */}
      <div className="max-w-[90%] mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Search Lost Items
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by item name, owner name, location, serial number, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              {filteredItems.length === 0 ? (
                <span className="text-red-500">
                  No items found matching "{searchTerm}"
                </span>
              ) : (
                <span>
                  Showing {filteredItems.length} result
                  {filteredItems.length !== 1 ? "s" : ""} for "{searchTerm}"
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-[90%] mx-auto">
        {loading ? (
          <p className="text-center col-span-full text-gray-500">
            Loading lost items...
          </p>
        ) : currentItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            {searchTerm ? (
              <div>
                <p className="text-gray-500 text-lg mb-4">
                  No items found matching your search.
                </p>
                <button
                  onClick={clearSearch}
                  className="text-[#003366] hover:underline font-medium"
                >
                  Clear search to view all items
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No lost items found.</p>
            )}
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={item.itemImage}
                alt={item.itemName}
                loading="lazy"
                className="w-full h-48 object-cover object-center rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.itemName}
                </h3>
                <p className="text-sm text-gray-500">
                  Reported on: {formatDate(item.date)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Owner: {item.ownerName}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Location: {item.location}
                </p>
              
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredItems.length > itemsPerPage && (
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredItems.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      )}

      {/* Modal */}
      <ReportItemForm
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default LostItems;
