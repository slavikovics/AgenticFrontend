// src/components/ui/rag-chat/ChatCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Clock,
  Calendar,
  Edit2,
  Check,
  X,
  MessageSquare,
} from "lucide-react";

export const ChatCard = ({
  session,
  onDelete,
  onRename,
  isDeleting = false,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);
  const [isSaving, setIsSaving] = useState(false);

  const formatRelative = (dateString) => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "только что";
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} д назад`;
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  const formatAbsolute = (dateString) =>
    new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleOpen = () => {
    if (!isEditing) navigate(`/rag-chat/${session.id}`);
  };
  const handleStartEdit = (e) => {
    e.stopPropagation();
    setEditTitle(session.title);
    setIsEditing(true);
  };
  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    setEditTitle(session.title);
  };

  const handleSave = async (e) => {
    e?.stopPropagation();
    const trimmed = editTitle.trim();
    if (!trimmed) {
      handleCancelEdit();
      return;
    }
    setIsSaving(true);
    try {
      await onRename(session.id, trimmed);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Enter") handleSave(e);
    if (e.key === "Escape") handleCancelEdit(e);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(session.id);
  };

  return (
    <div
      onClick={handleOpen}
      className="
        group relative flex flex-col rounded-lg border border-border
        bg-card text-card-foreground shadow-sm
        cursor-pointer select-none
        transition-all duration-200
        hover:border-primary/20 hover:shadow-md hover:-translate-y-px
      "
    >
      {!isEditing && (
        <button
          onClick={handleStartEdit}
          className="absolute top-2.5 left-2.5 z-10 p-1.5 rounded-md text-muted-foreground/40 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all"
          title="Переименовать"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}

      {!isEditing && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-40"
          title="Удалить"
        >
          {isDeleting ? (
            <div className="w-3.5 h-3.5 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      <div className="flex flex-col items-center justify-center flex-1 px-5 py-5 gap-0">
        <div
          className="flex w-full items-center justify-center"
          style={{ flex: "2" }}
        >
          {isEditing ? (
            <div
              className="flex w-full items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <textarea
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={2}
                disabled={isSaving}
                className="
                  flex-1 min-w-0 px-2 py-1 text-sm font-semibold rounded-md resize-none
                  border border-input bg-background text-center
                  focus:outline-none focus:ring-1 focus:ring-ring/30 focus:border-ring/30
                  disabled:opacity-50
                "
              />
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-3 h-3 border border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors disabled:opacity-50"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-card-foreground text-center leading-snug line-clamp-3 w-full px-8">
              {session.title}
            </p>
          )}
        </div>

        <div className="w-8 h-px bg-border my-3 flex-shrink-0" />

        <div
          className="flex items-center justify-center gap-2 flex-shrink-0"
          style={{ flex: "1" }}
        >
          <MessageSquare className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-2xl font-bold tabular-nums text-foreground leading-none">
            {session.messageCount ?? 0}
          </span>
          <span className="text-sm text-muted-foreground leading-none">
            сообщений
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            Создан: {formatAbsolute(session.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0 ml-3">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatRelative(session.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};
