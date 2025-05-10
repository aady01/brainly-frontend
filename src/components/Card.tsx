import { useState, useEffect } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TagIcon } from "../icons/TagIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";

// Add Twitter widget type definition
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

// Add CardType enum for better type safety
export enum CardType {
  TWITTER = "twitter",
  YOUTUBE = "youtube",
  DOCUMENT = "document",
  LINK = "link",
  TAG = "tag",
}

interface CardProps {
  title: string;
  link: string;
  type: CardType; // Update to use enum
  onDelete: () => void;
}

// Improve YouTube URL parsing with better error handling
function getYouTubeEmbedUrl(link: string): string {
  try {
    const url = new URL(link);
    if (url.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${url.pathname}`;
    }
    if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
    }
    return link;
  } catch (error) {
    console.error("Invalid URL:", error);
    return link;
  }
}

// Extract Twitter ID from URL
function getTwitterId(link: string): string | null {
  try {
    const url = new URL(link);
    const pathParts = url.pathname.split("/");
    // Check for status format: twitter.com/username/status/1234567890
    if (
      pathParts.length >= 4 &&
      (pathParts[2] === "status" || pathParts[2] === "statuses")
    ) {
      return pathParts[3];
    }
    return null;
  } catch (error) {
    console.error("Invalid Twitter URL:", error);
    return null;
  }
}

// Extract icon selection into separate component
const CardIcon = ({ type }: { type: CardType }) => {
  const iconMap = {
    [CardType.TWITTER]: <TwitterIcon />,
    [CardType.YOUTUBE]: <YoutubeIcon />,
    [CardType.DOCUMENT]: <DocumentIcon />,
    [CardType.LINK]: <LinkIcon />,
    [CardType.TAG]: <TagIcon />,
  };
  return <div className="text-gray-500 pr-2">{iconMap[type]}</div>;
};

// Loading shimmer effect component
const ShimmerLoader = () => (
  <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden relative">
    <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
  </div>
);

// Twitter embed component
const TwitterEmbed = ({ tweetId }: { tweetId: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Twitter widget script
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = () => {
        if (window.twttr) {
          window.twttr.widgets.load();
          setIsLoaded(true);
        }
      };
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load();
      setIsLoaded(true);
    }

    return () => {
      // Clean up if needed
    };
  }, [tweetId]);

  return (
    <div className="twitter-embed rounded-md overflow-hidden bg-gray-50 min-h-[150px] flex items-center justify-center">
      {!isLoaded && <ShimmerLoader />}
      <blockquote
        className="twitter-tweet"
        data-conversation="none"
        data-theme="light"
        data-lang="en"
        data-dnt="true"
      >
        <a href={`https://twitter.com/twitter/status/${tweetId}`}></a>
      </blockquote>
    </div>
  );
};

// Extract media content into separate component
const MediaContent = ({ type, link }: { type: CardType; link: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (type === CardType.YOUTUBE) {
    return (
      <div className="relative rounded-md overflow-hidden">
        {isLoading && <ShimmerLoader />}
        <iframe
          className={`w-full h-48 ${isLoading ? "opacity-0" : "opacity-100"}`}
          src={getYouTubeEmbedUrl(link)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  if (type === CardType.TWITTER) {
    const tweetId = getTwitterId(link);
    if (tweetId) {
      return <TwitterEmbed tweetId={tweetId} />;
    }
    return (
      <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
        <div className="flex items-center mb-2">
          <TwitterIcon />
          <span className="ml-2 font-medium">Twitter Post</span>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline block truncate"
        >
          {link}
        </a>
      </div>
    );
  }

  if (type === CardType.LINK) {
    return (
      <div className="p-3 bg-green-50 rounded-md">
        <div className="flex items-center mb-2">
          <LinkIcon />
          <span className="ml-2 text-sm font-medium text-green-700">
            Web Link
          </span>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 underline text-sm block truncate"
        >
          {link}
        </a>
      </div>
    );
  }

  if (type === CardType.DOCUMENT) {
    return (
      <div className="p-4 bg-amber-50 rounded-md flex items-center justify-center flex-col">
        <DocumentIcon />
        <span className="mt-2 text-sm text-amber-700 font-medium">
          Document
        </span>
        <span className="text-xs text-amber-600 mt-1 truncate max-w-full">
          {link}
        </span>
      </div>
    );
  }

  if (type === CardType.TAG) {
    return (
      <div className="p-4 bg-purple-50 rounded-md flex items-center justify-center flex-col">
        <TagIcon />
        <span className="mt-2 text-sm text-purple-700 font-medium">Tag</span>
        <span className="text-xs text-purple-600 mt-1 truncate max-w-full">
          {link}
        </span>
      </div>
    );
  }

  return null;
};

export function Card({ title, link, type, onDelete }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getCardBorderColor = () => {
    switch (type) {
      case CardType.TWITTER:
        return "border-l-blue-400";
      case CardType.YOUTUBE:
        return "border-l-red-500";
      case CardType.DOCUMENT:
        return "border-l-amber-400";
      case CardType.LINK:
        return "border-l-green-500";
      case CardType.TAG:
        return "border-l-purple-500";
      default:
        return "border-l-gray-300";
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="h-full">
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:-translate-y-1 border-l-4 ${getCardBorderColor()}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Header */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center max-w-[75%]">
              <CardIcon type={type} />
              <h3 className="font-medium text-gray-800 truncate">{title}</h3>
            </div>
            <div
              className={`flex items-center space-x-1 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0 md:opacity-60"
              }`}
            >
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Share content"
              >
                <ShareIcon />
              </button>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-gray-100"
                onClick={handleDeleteClick}
                aria-label="Delete content"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <MediaContent type={type} link={link} />

          {/* Type Badge */}
          <div className="mt-4 flex items-center">
            <span
              className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                type === CardType.TWITTER
                  ? "bg-blue-50 text-blue-700"
                  : type === CardType.YOUTUBE
                  ? "bg-red-50 text-red-700"
                  : type === CardType.DOCUMENT
                  ? "bg-amber-50 text-amber-700"
                  : type === CardType.LINK
                  ? "bg-green-50 text-green-700"
                  : "bg-purple-50 text-purple-700"
              }`}
            >
              {type.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Delete Content
            </h3>
            <p className="text-gray-500 mb-5">
              Are you sure you want to delete "{title}"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
