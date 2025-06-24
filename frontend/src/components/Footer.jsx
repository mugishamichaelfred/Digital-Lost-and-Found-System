import { useState } from "react";
import ReportFoundItem from "./ReportFoundItem";
import ReportLostItem from "./ReportLostItemForm";
import { Link } from "react-router-dom";

// Component to simulate react-icons
const Icons = () => {
  // These are simple SVG implementations to replace the react-icons
  // In a real project, you would import the actual icons
  const IoLocationOutline = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon-location w-5 h-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const HiOutlineMail = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon-email w-5 h-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const IoIosPhonePortrait = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon-phone w-5 h-5 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );

  const MdFacebook = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );

  const BsTwitterX = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
  );

  const BsInstagram = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  const FaLinkedinIn = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
    </svg>
  );

  return {
    IoLocationOutline,
    HiOutlineMail,
    IoIosPhonePortrait,
    MdFacebook,
    BsTwitterX,
    BsInstagram,
    FaLinkedinIn,
  };
};

// CTA Section Component
const CTASection = () => {
  const [isReportLostModalOpen, setIsReportLostModalOpen] = useState(false);

  const [isReportFoundModal, setIsReportFoundModal] = useState(false);

  const openReportLostModal = () => {
    setIsReportLostModalOpen(true);
  };

  const closeReportLostModal = () => {
    setIsReportLostModalOpen(false);
  };

  
  const openReportFoundModal = () => {
    setIsReportFoundModal(true);
  };

  const closeReportFoundModal = () => {
    setIsReportFoundModal(false);
  };
  return (
    <section
      className="py-16 text-white text-center relative bg-gradient-to-r from-blue-900 to-blue-800 bg-opacity-85"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.85)), url('/api/placeholder/1200/600')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-2xl md:text-xl font-bold mb-4 tracking-tight">
          Find What You've Lost or Help Others Find Theirs
        </h2>
        <p className="mb-8 text-sm opacity-90">
          Join our community and make a difference by connecting lost items with
          their owners.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <a
            onClick={openReportLostModal}
            className="inline-block px-8 py-3 bg-white text-blue-900 border-2 border-white rounded font-semibold transition-all duration-300 min-w-40 hover:bg-transparent hover:text-white transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Report Lost Item
          </a>
          <a
            onClick={openReportFoundModal}
            className="inline-block px-8 py-3 bg-transparent text-white border-2 border-white rounded font-semibold transition-all duration-300 min-w-40 hover:bg-white/10 transform hover:-translate-y-1 hover:shadow-md"
          >
            Report Found Item
          </a>
        </div>
      </div>
      <ReportLostItem
        isOpen={isReportLostModalOpen}
        onClose={closeReportLostModal}
      />

      {/* report found item */}
      <ReportFoundItem isOpen={isReportFoundModal} onClose={closeReportFoundModal} />
    </section>
  );
};

// Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const {
    IoLocationOutline,
    HiOutlineMail,
    IoIosPhonePortrait,
    MdFacebook,
    BsTwitterX,
    BsInstagram,
    FaLinkedinIn,
  } = Icons();

  return (
    <footer className="bg-[#003366]  text-white pt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between">
        {/* About Section */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-10 px-4">
          <h3 className="text-xl mb-5 pb-3 text-yellow-400 font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-yellow-400">
            FoundeLost
          </h3>
          <p className="mb-3 text-base leading-relaxed text-white/85">
            An effective lost and found system for university campus.
          </p>
          <p className="mb-3 text-base leading-relaxed text-white/85">
            Helping students and staff find their lost belongings since 2023.
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-10 px-4">
          <h3 className="text-xl mb-5 pb-3 text-yellow-400 font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-yellow-400">
            Quick Links
          </h3>
          <ul>
            <li className="mb-3">
              <a
                href="/"
                className="text-white/85 text-base hover:text-yellow-400 transition-colors duration-300 relative inline-block hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-px hover:after:bg-yellow-400"
              >
                Home
              </a>
            </li>
            <li className="mb-3">
              <Link to={"/lost"}
                href="/lost-items"
                className="text-white/85 text-base hover:text-yellow-400 transition-colors duration-300 relative inline-block hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-px hover:after:bg-yellow-400"
              >
                Lost Items
              </Link>
            </li>
            <li className="mb-3">
              <Link to={"/found"}
                className="text-white/85 text-base hover:text-yellow-400 transition-colors duration-300 relative inline-block hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-px hover:after:bg-yellow-400"
              >
                Found Items
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-10 px-4">
          <h3 className="text-xl mb-5 pb-3 text-yellow-400 font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-yellow-400">
            Contact
          </h3>
          <p className="mb-3 text-base text-white/85 flex items-center">
            <IoLocationOutline /> Kigali, Rwanda
          </p>
          <p className="mb-3 text-base text-white/85 flex items-center">
            <HiOutlineMail /> vkubwimana20@gmail.com
          </p>
          <p className="mb-3 text-base text-white/85 flex items-center">
            <IoIosPhonePortrait /> +250789466837
          </p>
        </div>

        {/* Connect With Us */}
        <div className="w-full md:w-1/2 lg:w-1/4 mb-10 px-4">
          <h3 className="text-xl mb-5 pb-3 text-yellow-400 font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-yellow-400">
            Connect With Us
          </h3>
          <div className="flex gap-4 mt-5">
            <a
              href="https://facebook.com"
              className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white hover:bg-yellow-400 hover:text-blue-900 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <MdFacebook />
            </a>
            <a
              href="https://X.com"
              className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white hover:bg-yellow-400 hover:text-blue-900 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <BsTwitterX />
            </a>
            <a
              href="https://instagram.com"
              className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white hover:bg-yellow-400 hover:text-blue-900 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <BsInstagram />
            </a>
            <a
              href="https://linkedin.com"
              className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full text-white hover:bg-yellow-400 hover:text-blue-900 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className=" bg-[#002244] py-5 px-4 text-center">
        <p className="my-2 text-sm text-white/70">
          &copy; {currentYear} The Best Ever Group. All rights reserved.
        </p>
        <p className="my-2 text-sm">
          <a
            href="/privacy-policy"
            className="text-white/80 hover:text-yellow-400 mx-2 transition-colors duration-300"
          >
            Privacy Policy
          </a>{" "}
          |
          <a
            href="/terms-of-service"
            className="text-white/80 hover:text-yellow-400 mx-2 transition-colors duration-300"
          >
            Terms of Service
          </a>{" "}
          |
          <a
            href="/contact"
            className="text-white/80 hover:text-yellow-400 mx-2 transition-colors duration-300"
          >
            Contact Us
          </a>
        </p>
      </div>
    </footer>
  );
};

// Main App Component to display both
const FooterAndCTA = () => {
  return (
    <div className="font-sans">
      <CTASection />
      <Footer />
    </div>
  );
};

export default FooterAndCTA;
