import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "../components/Input";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { TagIcon } from "../icons/TagIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter",
  Document = "document",
  Link = "link",
  Tag = "tag",
}

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null!);
  const linkRef = useRef<HTMLInputElement>(null!);
  const [type, setType] = useState(ContentType.Youtube);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle animation timing
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [open]);

  // Focus on title input when modal opens
  useEffect(() => {
    if (open && titleRef.current) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setError("");
      setShowSuccess(false);
    }
  }, [open]);

  async function addContent() {
    const title = titleRef.current?.value.trim();
    const link = linkRef.current?.value.trim();
    const token = localStorage.getItem("token");

    if (!title || !link) {
      setError("All fields are required.");
      return;
    }

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/content`,
        { type, title, link },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: any) {
      console.error(
        "Error adding content:",
        error.response?.data?.message || error.message
      );
      setError(
        error.response?.data?.message || "Failed to add content. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    setError("");
    onClose();
  }

  // Get icon for content type
  const getTypeIcon = (contentType: ContentType) => {
    switch (contentType) {
      case ContentType.Youtube:
        return <YoutubeIcon />;
      case ContentType.Twitter:
        return <TwitterIcon />;
      case ContentType.Document:
        return <DocumentIcon />;
      case ContentType.Link:
        return <LinkIcon />;
      case ContentType.Tag:
        return <TagIcon />;
    }
  };

  // Get color for content type
  const getTypeColor = (contentType: ContentType) => {
    switch (contentType) {
      case ContentType.Youtube:
        return "bg-red-50 border-red-200 text-red-700";
      case ContentType.Twitter:
        return "bg-blue-50 border-blue-200 text-blue-700";
      case ContentType.Document:
        return "bg-amber-50 border-amber-200 text-amber-700";
      case ContentType.Link:
        return "bg-green-50 border-green-200 text-green-700";
      case ContentType.Tag:
        return "bg-purple-50 border-purple-200 text-purple-700";
    }
  };

  if (!open && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0"
      } ${isVisible ? "visible" : "invisible"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transition-all duration-300 transform ${
          open ? "scale-100 translate-y-0" : "scale-95 -translate-y-4"
        } relative`}
      >
        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col items-center justify-center rounded-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-800">Content Added!</p>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Add New Content
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <CrossIcon />
          </button>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Content Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(ContentType).map((contentType) => (
                <button
                  key={contentType}
                  onClick={() => setType(contentType)}
                  className={`flex flex-col items-center justify-center p-3 rounded-md border transition-all ${
                    type === contentType
                      ? `${getTypeColor(contentType)} border-2`
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  disabled={isSubmitting}
                >
                  <div
                    className={`${
                      type === contentType ? "text-current" : "text-gray-500"
                    }`}
                  >
                    {getTypeIcon(contentType)}
                  </div>
                  <span
                    className={`text-xs mt-1 capitalize ${
                      type === contentType ? "font-medium" : "text-gray-600"
                    }`}
                  >
                    {contentType}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                placeholder="Enter content title"
                reference={titleRef}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <Input
                placeholder={`Enter ${type.toLowerCase()} link`}
                reference={linkRef}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                {type === ContentType.Youtube &&
                  "YouTube video URL (e.g., https://youtube.com/watch?v=...)"}
                {type === ContentType.Twitter &&
                  "Twitter post URL (e.g., https://twitter.com/user/status/...)"}
                {type === ContentType.Link &&
                  "Web page URL (e.g., https://example.com)"}
                {type === ContentType.Document && "Document URL or identifier"}
                {type === ContentType.Tag && "Tag identifier or URL"}
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleClose}
              text="Cancel"
              variant="secondary"
              className="mr-3"
            />
            <Button
              onClick={addContent}
              text={isSubmitting ? "Adding..." : "Add Content"}
              variant="primary"
              loading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
