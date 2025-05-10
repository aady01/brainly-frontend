import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { Logo } from "../icons/Logo";
import { TagIcon } from "../icons/TagIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";
import { useState, useEffect } from "react";
import axios from "axios";

interface SidebarProps {
  onToggleCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ onToggleCollapse }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string>("X");
  const [username, setUsername] = useState<string>("Guest");
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/api/v1/me", {
          headers: {
            Authorization: token,
          },
        });

        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Check for mobile view on initial load
    const checkMobileView = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        if (onToggleCollapse) onToggleCollapse(true);
      }
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => window.removeEventListener("resize", checkMobileView);
  }, [onToggleCollapse]);

  // Get user's first initial for the avatar
  const userInitial = username ? username.charAt(0).toUpperCase() : "G";

  const handleToggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    }
  };

  return (
    <div
      className={`h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 fixed left-0 top-0 shadow-sm flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-72"
      } z-30`}
    >
      {/* Toggle button */}
      <button
        className="absolute -right-3 top-12 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors hidden md:block"
        onClick={handleToggleCollapse}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 text-gray-600 transition-transform ${
            collapsed ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Logo section */}
      <div
        className={`flex text-2xl py-6 md:py-8 items-center ${
          collapsed
            ? "justify-center"
            : "justify-center border-b border-gray-100"
        }`}
      >
        <div className="text-purple-600 pr-2">
          <Logo />
        </div>
        {!collapsed && (
          <div className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            Brainly
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={`mt-4 ${collapsed ? "px-2" : "px-4"}`}>
        <SidebarItem
          text={collapsed ? "" : "X"}
          icon={<TwitterIcon />}
          active={activeItem === "X"}
          onClick={() => setActiveItem("X")}
        />
        <SidebarItem
          text={collapsed ? "" : "YouTube"}
          icon={<YoutubeIcon />}
          active={activeItem === "YouTube"}
          onClick={() => setActiveItem("YouTube")}
        />
        <SidebarItem
          text={collapsed ? "" : "Documents"}
          icon={<DocumentIcon />}
          active={activeItem === "Documents"}
          onClick={() => setActiveItem("Documents")}
        />
        <SidebarItem
          text={collapsed ? "" : "Links"}
          icon={<LinkIcon />}
          active={activeItem === "Links"}
          onClick={() => setActiveItem("Links")}
        />
        <SidebarItem
          text={collapsed ? "" : "Tags"}
          icon={<TagIcon />}
          active={activeItem === "Tags"}
          onClick={() => setActiveItem("Tags")}
        />
      </div>

      {/* User profile section */}
      <div
        className={`mt-auto ${
          collapsed
            ? "border-t border-gray-100 py-4 flex justify-center"
            : "border-t border-gray-100 p-4 mx-4 mb-6"
        }`}
      >
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium">
            {loading ? "..." : userInitial}
          </div>
        ) : (
          <div className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg p-2 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium">
              {loading ? "..." : userInitial}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {loading ? "Loading..." : username}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
