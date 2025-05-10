import { ReactElement } from "react";

export function SidebarItem({
  text,
  icon,
  active = false,
  onClick,
}: {
  text: string;
  icon: ReactElement;
  active?: boolean;
  onClick?: () => void;
}) {
  const isCollapsed = text === "";

  return (
    <div
      className={`flex items-center ${
        isCollapsed ? "justify-center w-full" : ""
      } text-gray-700 py-2 cursor-pointer hover:bg-gray-200 rounded ${
        isCollapsed ? "mx-auto px-2" : "max-w-48 pl-4"
      } transition-all duration-300 ease-in-out ${
        active ? "bg-purple-100 text-purple-700 font-medium" : ""
      }`}
      onClick={onClick}
      title={isCollapsed ? text : ""}
    >
      <div
        className={`flex items-center justify-center ${
          isCollapsed ? "w-8 h-8" : "pr-2"
        }`}
      >
        {icon}
      </div>
      <div
        className={`transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 w-0" : "opacity-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
