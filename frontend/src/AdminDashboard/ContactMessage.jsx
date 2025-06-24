import { useState, useEffect } from "react";
import {
  Trash2,
  Send,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Menu,
} from "lucide-react";
import { mycontext } from "../Context/ContextProvider";
import Notiflix from "notiflix";
import axios from "axios";

export default function ContactMessagesPage() {
  // Get context data with error handling
  const contextData = mycontext();
  const { contact } = contextData || {};

  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const messagesPerPage = 4;

  // Update messages when context data changes
  useEffect(() => {
    if (contact && Array.isArray(contact)) {
      // Ensure each message has the required properties
      const processedMessages = contact.map((message) => ({
        ...message,
        time: message.time || "Recently",
        description:
          message.description || message.message || "No description available",
      }));
      setMessages(processedMessages);
    }
  }, [contact]);

  // Delete message handler
  const handleDelete = (id) => {
    setMessages(messages.filter((message) => message.id !== id));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
  };

  // Update status handler
  const handleStatusChange = (id, newStatus) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, status: newStatus } : message
      )
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  };

  // Filter messages based on search term and status filter
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      (message.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || message.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // Status badge color mapping
  const statusColors = {
    unread: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
  };


  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async (id) => {
    Notiflix.Confirm.show(
      "Confirm delete message",
      "Do you agree with me?",
      "Yes",
      "No",
      async () => {
        try {
          setIsLoading(true);
          const res = await axios.delete(
            "/api/contacts/${id}",
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




  // Show loading state if context is not ready
  if (!contextData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50  rounded-2xl">
      <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              Contact Messages
            </h1>
            <div className="flex space-x-2">
              <button
                className="md:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
              <span className="hidden md:inline text-blue-600 hover:text-blue-800 cursor-pointer font-medium text-sm">
                View All
              </span>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col space-y-2">
                <button className="text-left text-blue-600 hover:text-blue-800 font-medium text-sm py-1">
                  View All Messages
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 font-medium text-sm py-1">
                  Export Data
                </button>
                <button className="text-left text-blue-600 hover:text-blue-800 font-medium text-sm py-1">
                  Settings
                </button>
              </div>
            </div>
          )}

          {/* Search and filter */}
          <div className="px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-3 border-b border-gray-200">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className="text-gray-500">
                <Filter size={18} />
              </span>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {currentMessages.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {currentMessages.map((message) => (
                  <div key={message.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {message.name || "Unknown"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {message.email || "No email"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          statusColors[message.status] || statusColors.unread
                        }`}
                      >
                        {(message.status || "unread").charAt(0).toUpperCase() +
                          (message.status || "unread").slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {message.description || "No description available"}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {message.time || "Recently"}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Reply"
                        >
                          <Send size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                          onClick={() => handleConfirmDelete(message._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                {messages.length === 0
                  ? "No messages available"
                  : "No messages found matching your criteria"}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMessages.length > 0 ? (
                  currentMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {message.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500 md:hidden">
                          {message.email || "No email"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <div className="text-sm text-gray-500">
                          {message.email || "No email"}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-sm font-semibold rounded-full">
                          {message.subject}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 flex items-center">
                          <span className="line-clamp-1 xl:line-clamp-2">
                            {message.description || "No description available"}
                          </span>
                          <button
                            className="ml-1 flex-shrink-0 text-sm text-blue-600 hover:text-blue-800"
                            title="View full description"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Reply"
                          >
                            <Send size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                            onClick={() => handleConfirmDelete(message._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {messages.length === 0
                        ? "No messages available"
                        : "No messages found matching your criteria"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredMessages.length > 0 && (
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing{" "}
                <span className="font-medium">{indexOfFirstMessage + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastMessage, filteredMessages.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredMessages.length}</span>{" "}
                results
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={16} />
                  </button>

                  {/* Show limited page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Message Details
                </h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="px-4 py-3 max-h-64 sm:max-h-96 overflow-y-auto">
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-500">From</p>
                  <p className="text-sm text-gray-900">
                    {selectedMessage.name || "Unknown"} (
                    {selectedMessage.email || "No email"})
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-500">Time</p>
                  <p className="text-sm text-gray-900">
                    {selectedMessage.time || "Recently"}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[selectedMessage.status] ||
                        statusColors.unread
                      }`}
                    >
                      {(selectedMessage.status || "unread")
                        .charAt(0)
                        .toUpperCase() +
                        (selectedMessage.status || "unread").slice(1)}
                    </span>
                    <select
                      className="text-xs border border-gray-300 rounded-md px-2 py-1"
                      value={selectedMessage.status || "unread"}
                      onChange={(e) =>
                        handleStatusChange(selectedMessage.id, e.target.value)
                      }
                    >
                      <option value="unread">Unread</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Message</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedMessage.description || "No description available"}
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-end space-x-3">
                <button
                  className="py-1.5 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setSelectedMessage(null)}
                >
                  Close
                </button>
                <button className="py-1.5 px-3 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
