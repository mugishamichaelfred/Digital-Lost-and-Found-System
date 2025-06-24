import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import comput from "../assets/image1.jpg";
import axios from "axios";
import { toast } from "react-toastify";

export default function Contactus() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(formData);
      // Use proxy endpoint instead of direct API call
      await axios.post("/api/contacts", formData);
      toast.success("Message sent successfully!");

      // Reset form after successful submission
      setFormData({
        email: "",
        name: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        toast.error(
          `Error: ${error.response.data?.message || "Failed to send message"}`
        );
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans bg-gray-100 w-full min-h-screen m-0 overflow-x-hidden">
      <header
        className="relative pt-16 pb-24 px-5 bg-opacity-85 bg-cover bg-center text-center text-white mb-16"
        style={{
          background: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url(${comput})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="font-light text-lg max-w-lg mx-auto">
            Have questions about our Lost and Found system? Reach out to our
            team using the information below or send us a message.
          </p>
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

      {/* Google Map - Full width */}
      <div className="w-full h-96 overflow-hidden mb-0">
        <iframe
          className="w-full h-full border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.487182995609!2d30.061640873592147!3d-1.9586919980235638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5d5b9897711%3A0x34e7b1e5cded7867!2sUR%20College%20of%20Science%20and%20Technology!5e0!3m2!1sen!2srw!4v1750436683438!5m2!1sen!2srw"
          loading="lazy"
          title="Google Maps"
        ></iframe>
      </div>

      {/* Contact Info and Form - Full width container with centered content */}
      <div className="w-full bg-white shadow-md py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Contact Information */}
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-900/10 p-3 rounded-full mr-4">
                    <MapPin className="text-blue-900 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600 mt-1">
                      University Campus, Main Building
                      <br />
                      123 University Avenue
                      <br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/10 p-3 rounded-full mr-4">
                    <Phone className="text-blue-900 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600 mt-1">
                      Main Office: (123) 456-7890
                      <br />
                      Support: (123) 456-7891
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/10 p-3 rounded-full mr-4">
                    <Mail className="text-blue-900 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">
                      info@lostandfound.edu
                      <br />
                      support@lostandfound.edu
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-900/10 p-3 rounded-full mr-4">
                    <Clock className="text-blue-900 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Office Hours</h3>
                    <p className="text-gray-600 mt-1">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 2:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Send us a Message
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="Subject of your message"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#003366] text-white font-medium py-3 px-6 rounded-md hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
