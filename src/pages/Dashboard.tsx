import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card, CardType } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { Sidebar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";

// Define content interface
interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  userId: string;
}

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { contents, refresh } = useContent();

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [modalOpen]);

  // Handle responsive sidebar for mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteCard = (_id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setIsLoading(true);
      axios
        .delete(`${BACKEND_URL}/api/v1/content/${_id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("Content deleted:", response.data.message);
          refresh();
        })
        .catch((error) => {
          console.error(
            "Error deleting content:",
            error.response?.data?.message || error.message
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleShareBrain = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        {
          share: true,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const url = `http://localhost:5173/brain/share/${response.data.hash}`;
      setSharedUrl(url);
      setShowShareModal(true);
    } catch (error) {
      console.error("Error sharing brain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContents = contents
    ? (contents as Content[]).filter((content) => {
        const matchesSearch = content.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter
          ? content.type === activeFilter
          : true;
        return matchesSearch && matchesFilter;
      })
    : [];

  const contentTypes = contents
    ? Array.from(
        new Set((contents as Content[]).map((content) => content.type))
      )
    : [];

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`md:block ${showMobileSidebar ? "block" : "hidden"} z-30`}
      >
        <Sidebar
          onToggleCollapse={(collapsed) => setSidebarCollapsed(collapsed)}
        />
      </div>

      <div
        className={`flex-1 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-72"
        } ml-0 overflow-hidden flex flex-col transition-all duration-300`}
      >
        {/* Header with search and actions */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                onClick={toggleMobileSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                My Content
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center w-full">
              <div className="relative w-full md:w-96 mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto ">
                <Button
                  onClick={() => setModalOpen(true)}
                  variant="primary"
                  text="Add Content"
                  startIcon={<PlusIcon />}
                  fullWidth
                />
                <Button
                  onClick={handleShareBrain}
                  variant="secondary"
                  text="Share Brain"
                  startIcon={<ShareIcon />}
                  loading={isLoading}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          {contentTypes.length > 0 && (
            <div className="flex flex-wrap items-center mt-4 gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-4 py-1 text-sm rounded-full transition-all whitespace-nowrap ${
                  activeFilter === null
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {contentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-1 text-sm rounded-full capitalize transition-all whitespace-nowrap ${
                    activeFilter === type
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Main content area with cards */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <CreateContentModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredContents.map(({ type, link, title, _id }) => (
                <Card
                  key={_id}
                  type={type as CardType}
                  link={link}
                  title={title}
                  onDelete={() => handleDeleteCard(_id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {searchQuery || activeFilter
                  ? "No matching content found"
                  : "No content available"}
              </p>
              <p className="text-gray-400 mt-2 max-w-md">
                {searchQuery || activeFilter
                  ? "Try adjusting your search or filters"
                  : "Click the 'Add Content' button to get started"}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Share URL Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Share Your Brain
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Share this link with others to give them access to your brain:
            </p>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sharedUrl);
                  alert("Link copied to clipboard!");
                }}
                className="bg-purple-600 px-4 text-white rounded-r-md hover:bg-purple-700"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
