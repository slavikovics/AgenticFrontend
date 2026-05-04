import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { AuthComponent } from "../auth";
import { Button } from "@/components/ui/button";
import { ChatCard } from "./ChatCard";
import { useChatSessions } from "./useChatSessions";
import { UnauthenticatedState } from "./chat-states/UnauthenticatedState";
import { EmptyChatsState } from "./chat-states/EmptyChatsState";

export const ChatsPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    sessions,
    isLoading,
    isCreating,
    deletingId,
    handleNewChat,
    handleDelete,
    handleRename,
  } = useChatSessions({ isAuthenticated, authLoading });

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <UnauthenticatedState />;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Мои чаты
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Продолжайте прошлые беседы или начните новую
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm flex-shrink-0 select-none">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {sessions.length}
            </span>
            <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
              чатов
            </span>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            onClick={handleNewChat}
            disabled={isCreating}
            size="sm"
            className="gap-2 flex-shrink-0 h-9"
          >
            {isCreating ? (
              <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isCreating ? "Создание..." : "Новый чат"}
            </span>
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Загрузка чатов...
              </p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          searchQuery ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-full max-w-xs text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 inline-flex">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ничего не найдено
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Нет чатов с названием «{searchQuery}»
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Сбросить поиск
                </Button>
              </div>
            </div>
          ) : (
            <EmptyChatsState
              onNewChat={handleNewChat}
              isCreating={isCreating}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <ChatCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
                onRename={handleRename}
                isDeleting={deletingId === session.id}
              />
            ))}
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-4 flex items-center gap-3 shadow-xl">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Создание чата...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
