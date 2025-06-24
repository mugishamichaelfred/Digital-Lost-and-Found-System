import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const ReportFoundItem = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    itemName: "",
    itemImage: null,
    itemSerial: "",
    location: "",
    description: "", // fixed typo here
    date: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ownerName: "",
        ownerEmail: "",
        ownerPhone: "",
        itemName: "",
        itemImage: null,
        itemSerial: "",
        location: "",
        description: "",
        date: "",
      });
      setImagePreview(null);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size before setting (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        itemImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear previous image error if any
      if (formErrors.itemImage) {
        setFormErrors((prev) => ({
          ...prev,
          itemImage: null,
        }));
      }
    }
  };

  // Validate form fields before submit
  const validateForm = () => {
    const errors = {};
    if (!formData.ownerName.trim()) errors.ownerName = "Your name is required";
    if (!formData.itemName.trim()) errors.itemName = "Item name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.date.trim()) errors.date = "Date found is required";

    if (!formData.ownerEmail.trim()) {
      errors.ownerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      errors.ownerEmail = "Please enter a valid email address";
    }

    // Image size limit 5MB
    if (formData.itemImage && formData.itemImage.size > 5 * 1024 * 1024) {
      errors.itemImage = "Image size must be less than 5MB";
    }

    return errors;
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submits

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields correctly", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Submitting found item report...");

    try {
      const submitData = new FormData();
      for (const key in formData) {
        submitData.append(key, formData[key]);
      }

      const response = await fetch("/api/foundItems", {
        method: "POST",
        body: submitData,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const responseData = await response.json();

        toast.success(
          "Found item reported successfully! Thank you for helping reunite lost items with their owners.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        onSubmit(submitData);
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || `Failed to submit report (${response.status})`;

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      toast.error(
        "Network error occurred. Please check your connection and try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(49,49,49,0.8)] bg-opacity-80 flex justify-center items-start sm:items-center z-1000 p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-[320px] xs:max-w-[380px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[450px] min-h-fit my-2 sm:my-0">
        {/* Close button */}
        <button
          className="absolute right-0 top-0 z-20 flex items-center justify-center h-8 w-8 bg-blue-700 text-white hover:bg-blue-800 transition-colors -mt-2 -mr-2 rounded-md shadow-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Form card */}
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-2xl">
          <div className="space-y-2 sm:space-y-3">
            {/* Header */}
            <div className="text-center mb-2 sm:mb-3">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Report Found Item
              </h4>
            </div>

            {/* Name and Email */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className={`w-full px-1.5 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.ownerName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {formErrors.ownerName && (
                  <p className="text-red-500 text-xs">{formErrors.ownerName}</p>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  className={`w-full px-1.5 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.ownerEmail ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your.email@example.com"
                />
                {formErrors.ownerEmail && (
                  <p className="text-red-500 text-xs">
                    {formErrors.ownerEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Phone and Item Name */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  className="w-full px-1.5 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0789488837"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className={`w-full px-1.5 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.itemName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="iPhone"
                />
                {formErrors.itemName && (
                  <p className="text-red-500 text-xs">{formErrors.itemName}</p>
                )}
              </div>
            </div>

            {/* Serial Number and Location */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="itemSerial"
                  value={formData.itemSerial}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Serial number or unique identifier"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Location Found
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Location area"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-xs">{formErrors.location}</p>
                )}
              </div>
            </div>

            {/* Date Found and Image Upload */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Date Found
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-xs">{formErrors.date}</p>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-2 py-1 sm:px-2 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-1 file:py-0.5 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formErrors.itemImage && (
                  <p className="text-red-500 text-xs">{formErrors.itemImage}</p>
                )}
                {imagePreview && (
                  <div className="mt-1">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-[100px] h-12 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical min-h-[50px]"
                placeholder="Describe the item in detail (color, brand, condition, etc.)"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 sm:py-2.5 px-2 rounded-lg transition-colors order-2 sm:order-1 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full sm:flex-1 font-medium py-2 sm:py-2.5 px-2 rounded-lg transition-colors order-1 sm:order-2 text-sm ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundItem;
