import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ClaimForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    itemName: "",
    itemImage: null,
    itemSerial: "",
    location: "",
    description: "",
    date: "",
    status: "lost",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ownerName: "",
        ownerEmail: "",
        itemName: "",
        itemImage: null,
        itemSerial: "",
        location: "",
        description: "",
        date: "",
        status: "lost",
      });
      setImagePreview(null);
      setFormErrors({});
      setIsSubmitting(false);
      setSubmitError(null);
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

    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    if (!formData.itemSerial.trim())
      errors.itemSerial = "Serial/id number is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.date.trim()) errors.date = "Date is required";

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

    if (isSubmitting) return;

    // Clear previous errors
    setSubmitError(null);
    setFormErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call or use actual endpoint
      if (typeof onSubmit === "function") {
        // If onSubmit is provided, use it (for parent component handling)
        await onSubmit(formData);
        onClose();
      } else {
        // Otherwise, make API call
        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            submitData.append(key, formData[key]);
          }
        });

        const response = await fetch("/api/notify-owner", {
          method: "POST",
          body: submitData,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Form submitted successfully:", result);
        onClose();
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setSubmitError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error.message.includes("HTTP")) {
        setSubmitError(
          `Server error: ${error.message}. Please try again later.`
        );
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
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
          type="button"
          className="absolute right-0 top-0 z-20 flex items-center justify-center h-8 w-8 bg-[#53d397] text-white hover:bg-blue-800 transition-colors -mt-2 -mr-2 rounded-md shadow-lg"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-2xl"
        >
          <div className="space-y-0.5 sm:space-y-1">
            {/* Header */}
            <div className="text-center mb-2 sm:mb-3">
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Claim Your Item
              </h4>
            </div>

            {/* Submit Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-3">
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            {/* Name and Email */}
            <div className="flex flex-col md:flex-row gap-0.5 md:gap-1">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Your Name *
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
                  Email Address *
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

            {/* Item Name */}
            <div className="space-y-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Item Name *
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

            {/* Serial Number and Location */}
            <div className="flex flex-col md:flex-row gap-0.5 md:gap-1">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Serial Number/ID Number *
                </label>
                <input
                  type="text"
                  name="itemSerial"
                  value={formData.itemSerial}
                  onChange={handleChange}
                  className={`w-full px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    formErrors.itemSerial ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Serial number or unique identifier"
                />
                {formErrors.itemSerial && (
                  <p className="text-red-500 text-xs">
                    {formErrors.itemSerial}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Location Lost *
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

            {/* Date and Image Upload */}
            <div className="flex flex-col md:flex-row gap-0.5 md:gap-1">
              <div className="flex-1 space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Date Lost *
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
                  Upload Image (Optional)
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
                Description (Optional)
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
          <div className="flex flex-col sm:flex-row gap-2 pt-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium py-2 sm:py-2.5 px-2 rounded-lg transition-colors order-2 sm:order-1 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:flex-1 font-medium py-2 sm:py-2.5 px-2 rounded-lg transition-colors order-1 sm:order-2 text-sm ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed text-white"
                  : "bg-[#53d397] hover:bg-[#51eaea] hover:text-black text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
