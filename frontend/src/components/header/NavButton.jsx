import { MessageSquareText } from "lucide-react";
import { Button } from "../ui/button";

export const NavButton = ({
  item,
  active,
  isInChat,
  onClick,
  variant = "desktop",
}) => {
  const showChatBadge = item.id === "chats" && isInChat;
  const Icon = showChatBadge ? MessageSquareText : item.icon;

  if (variant === "mobile") {
    return (
      <Button
        variant={active ? "default" : "ghost"}
        onClick={onClick}
        className="justify-start gap-2"
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
        {showChatBadge && (
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-blue-100 outline-1 dark:bg-blue-900 text-blue-950 dark:text-blue-300">
            В чате
          </span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1.5 relative"
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
      {showChatBadge && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-white dark:border-gray-950" />
      )}
    </Button>
  );
};
