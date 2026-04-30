import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as chatApi from "../../api/chatApi";

export const useChatSessions = ({ isAuthenticated, authLoading }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatApi.getChatSessions();
      setSessions(data || []);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) loadSessions();
  }, [isAuthenticated, authLoading, loadSessions]);

  const handleNewChat = async () => {
    setIsCreating(true);
    try {
      const newSession = await chatApi.createSession(
        "rag",
        import.meta.env.OPENROUTER_MODEL,
        "New Chat",
      );
      if (!newSession?.id) throw new Error("No session id returned");
      setSessions((prev) => [newSession, ...prev]);
      navigate(`/rag-chat/${newSession.id}`);
    } catch {
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Вы уверены? Это действие нельзя отменить.")) return;
    setDeletingId(sessionId);
    try {
      await chatApi.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } finally {
      setDeletingId(null);
    }
  };

  const handleRename = async (sessionId, newTitle) => {
    await chatApi.updateSessionTitle(sessionId, newTitle);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s)),
    );
  };

  return {
    sessions,
    isLoading,
    isCreating,
    deletingId,
    handleNewChat,
    handleDelete,
    handleRename,
  };
};
