import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import { mycontext } from "../Context/ContextProvider";
import Notiflix from "notiflix";
import axios from "axios";
import ReportLostItem from "../components/ReportLostItemForm";

const EditModal = ({ item, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    location: "",
    date: "",
    itemSerial: "",
    descrption: "", // Fixed: Changed from 'descrption' to 'descrption'
    itemImage: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert datetime to date format
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD part
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Initialize form data when item changes
  useEffect(() => {
    if (item && isOpen) {
      // Added isOpen check to prevent unnecessary updates
      setFormData({
        itemName: item.itemName || "",
        ownerName: item.ownerName || "",
        ownerEmail: item.ownerEmail || "",
        ownerPhone: item.ownerPhone || "",
        location: item.location || "",
        date: formatDateForInput(item.date || item.date),
        itemSerial: item.itemSerial || item.itemSerial || "",
        descrption: item.descrption || item.descrption || "", // Handle both field names
        itemImage: item.itemImage || "",
      });
      setErrors({});
    }
  }, [item, isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          itemImage: "File size must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          itemImage: "Please select a valid image file",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          itemImage: e.target.result,
        }));
        // Clear any previous image errors
        setErrors((prev) => ({
          ...prev,
          itemImage: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Check if fields exist and are not empty
    if (!formData.itemName || !formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.location || !formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.date || !formData.date.trim()) {
      newErrors.date = "Date found is required";
    }

    if (!formData.itemSerial || !formData.itemSerial.trim()) {
      newErrors.itemSerial = "Serial number is required";
    }

    if (!formData.descrption || !formData.descrption.trim()) {
      newErrors.descrption = "Description is required";
    }

    // Validate email format if provided
    if (formData.ownerEmail && formData.ownerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Fixed: Properly access the item ID
    const itemId = item?._id || item?.id;

    if (!item || !itemId) {
      console.error("Item ID is required for editing. Item:", item);
      setErrors((prev) => ({
        ...prev,
        general: "Unable to identify item for editing. Please try again.",
      }));
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API call
      const updateData = {
        itemName: formData.itemName,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        location: formData.location,
        date: formData.date,
        itemSerial: formData.itemSerial,
        descrption: formData.descrption, // Fixed: Use correct field name
        itemImage: formData.itemImage,
      };

      // Make API call to update the item using axios
      const response = await axios.put(
        `/api/lostItems/${itemId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      // Call the onSave callback with updated data
      onSave(response.data);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);

      let errorMessage = "Failed to update item. Please try again.";

      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.code === "ECONNABORTED") {
        // Request timeout
        errorMessage = "Request timeout. Please try again.";
      }

      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and close modal
  const handleClose = () => {
    setFormData({
      itemName: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      location: "",
      date: "",
      itemSerial: "",
      descrption: "", // Fixed: Use correct field name
      itemImage: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(49,49,49,0.8)] bg-opacity-80 flex justify-center items-start sm:items-center z-1000 p-2 sm:p-2 overflow-y-auto">
      <div className=" relative flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Found Item
              </h3>
              <button
                onClick={handleClose}
                className="flex items-center justify-center h-8 w-8 bg-blue-700 text-white hover:bg-blue-800 transition-colors rounded-md shadow-lg"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white">
            <div className="px-4 py-5 sm:p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Item Image */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.itemImage && (
                      <img
                        src={formData.itemImage}
                        alt="Item preview"
                        className="h-16 w-16 rounded-md object-cover border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                  {errors.itemImage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.itemImage}
                    </p>
                  )}
                </div>

                {/* Item Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.itemName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter item name"
                  />
                  {errors.itemName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.itemName}
                    </p>
                  )}
                </div>

                {/* Founder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter founder name"
                  />
                </div>

                {/* Founder Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founder Email
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ownerEmail ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter founder email"
                  />
                  {errors.ownerEmail && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ownerEmail}
                    </p>
                  )}
                </div>

                {/* Founder Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founder Phone
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter founder phone"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Found *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter location where item was found"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Date Found */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Found *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    name="itemSerial"
                    value={formData.itemSerial}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.itemSerial ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter serial number"
                  />
                  {errors.itemSerial && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.itemSerial}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="descrption"
                    value={formData.descrption}
                    onChange={handleInputChange}
                    rows={3}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.descrption ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter detailed descrption of the item"
                  />
                  {errors.descrption && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.descrption}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={item.itemImage}
            alt={item.itemName}
            className="w-12 h-12 rounded-md object-cover mr-4"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {item.itemName}
            </h3>
            <p className="text-xs text-gray-500">{item.ownerName}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Location:</p>
          <p className="font-medium">{item.location}</p>
        </div>
        <div>
          <p className="text-gray-500">Date Found:</p>
          <p className="font-medium">{item.dateFound || item.date}</p>
        </div>
        <div>
          <p className="text-gray-500">Found By:</p>
          <p className="font-medium">{item.foundBy || item.ownerName}</p>
        </div>
        <div>
          <p className="text-gray-500">Contact:</p>
          <p className="font-medium truncate">
            {item.contact || item.ownerPhone}
          </p>
        </div>
      </div>

      <div className="mt-2 text-xs">
        <p className="text-gray-500">Description:</p>
        <p className="font-medium text-gray-900">{item.descrption}</p>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default function LostItemDash() {
  // Get data from context with safe destructuring
  const { tour } = mycontext();
  const allItems = Array.isArray(tour) ? tour : tour?.allItems || []; // Provide fallback empty array

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItemId, setExpandedItemId] = useState(null);

  // Modal and form state
  const [selected, setSelected] = useState({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);

  // Filter items based on search term - now safe because allItems is always an array
  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foundBy?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  // Form handling

  // Edit handler
  const handleEditClick = (item) => {
    setSelected(item);
    setOpen(true);
  };

  // Delete handlers
  const handleConfirmDelete = async (id) => {
    Notiflix.Confirm.show(
      "Confirm delete tour",
      "Do you agree with me?",
      "Yes",
      "No",
      async () => {
        try {
          setIsLoading(true);
          const res = await axios.delete(
            `/api/lostItems/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsLoading(false);
          window.location.reload();
        } catch (error) {
          setIsLoading(false);
          console.log(error);
          // Show error message to user
          Notiflix.Notify.failure("Failed to delete item");
        }
      },
      () => {
        console.log("Delete cancelled");
      },
      {}
    );
  };

  const handleDeleteClick = (item) => {
    if (item && item._id) {
      handleConfirmDelete(item._id);
    } else {
      console.error("Item or item ID is missing");
      Notiflix.Notify.failure("Cannot delete item - ID is missing");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setTourToDelete(null);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedItem) => {
    console.log("Saving updated item:", updatedItem);
    setShowEditModal(false);
    setItemToEdit(null);
  };
  // Form submission

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-2">
        Lost Items Dashboard
      </h1>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search items, locations, or finders..."
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>

        <div className="flex flex-row gap-2 sm:gap-4">
          <button
            onClick={openReportModal}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#55e0a3] hover:bg-[#80ffdb] hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" />
            Add Lost Item
          </button>
        </div>
      </div>

      {/* Desktop view - Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Lost
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lost By
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => (
                <tr key={item._id || item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={item.itemImage}
                          alt={item.itemName}
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkMyMC40MTgzIDE2IDI0IDE5LjU4MTcgMjQgMjRDMjQgMjguNDE4MyAyMC40MTgzIDMyIDE2IDMyQzExLjU4MTcgMzIgOCAyOC40MTgzIDggMjRDOCAxOS41ODE3IDExLjU4MTcgMTYgMTYgMTZaIiBmaWxsPSIjOUM5Qzk3Ii8+CjxwYXRoIGQ9Ik0yMS4zMzMzIDIxLjMzMzNWMjIuNjY2N0gyMi42NjY3VjI0SDIxLjMzMzNWMjUuMzMzM0gyMFYyNEgxOC42NjY3VjIyLjY2NjdIMjBWMjEuMzMzM0gyMS4zMzMzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.itemName}
                        </div>
                        <div className="text-sm w-0.5 text-gray-500">
                          {item.ownerEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {item.descrption}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.location}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.date}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.ownerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.ownerPhone}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="Edit item"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet view - Cards */}
      <div className="hidden sm:block lg:hidden">
        <div className="grid gap-4">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-md object-cover"
                        src={item.itemImage}
                        alt={item.itemName}
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAyNkMzNC44MzY2IDI2IDQyIDMzLjE2MzQgNDIgNDJDNDIgNTAuODM2NiAzNC44MzY2IDU4IDI2IDU4QzE3LjE2MzQgNTggMTAgNTAuODM2NiAxMCA0MkMxMCAzMy4xNjM0IDE3LjE2MzQgMjYgMjYgMjZaIiBmaWxsPSIjOUM5Qzk3Ii8+CjxwYXRoIGQ9Ik0zNC4xMzMzIDM0LjEzMzNWMzYuMjY2N0gzNi4yNjY3VjM4LjRIMzQuMTMzM1Y0MC41MzMzSDMzLjA2NjdWMzguNEgzMC40VjM2LjI2NjdIMzMuMDY2N1YzNC4xMzMzSDM0LjEzMzNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.itemName}
                          </h3>
                          <p className="text-sm  text-gray-500">
                            {item.ownerEmail}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 ml-2">
                          {item.date}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {item.descrption}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="text-gray-900">{item.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Found by:</span>
                          <p className="text-gray-900">{item.foundBy}</p>
                          <p className="text-gray-500 text-xs">
                            {item.ownerPhone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                      title="Edit item"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500">
              No items found matching your search criteria
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {currentItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleConfirmDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white pt-3 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`relative ml-3 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {filteredItems.length > 0 ? indexOfFirstItem + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredItems.length)}
              </span>{" "}
              of <span className="font-medium">{filteredItems.length}</span>{" "}
              results
            </p>
          </div>

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1 || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md text-gray-400
                  ${
                    currentPage === 1 || totalPages === 0
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 border border-gray-300"
                  }`}
                title="First Page"
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1 || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 text-gray-400
                  ${
                    currentPage === 1 || totalPages === 0
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 border border-gray-300"
                  }`}
                title="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold bg-white border border-gray-300">
                Page {totalPages > 0 ? currentPage : 0} of {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 text-gray-400
                  ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 border border-gray-300"
                  }`}
                title="Next Page"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md text-gray-400
                  ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white hover:bg-gray-50 border border-gray-300"
                  }`}
                title="Last Page"
              >
                <ChevronsRight size={18} />
              </button>
            </nav>
          </div>
        </div>
      </div>

      <ReportLostItem isOpen={isReportModalOpen} onClose={closeReportModal} />

      {/* Edit Modal */}
      {/* Edit Modal */}
      <EditModal
        item={itemToEdit}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setItemToEdit(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
