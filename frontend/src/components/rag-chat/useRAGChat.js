import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRAGWebSocket } from "./useRAGWebSocket";
import { eventToStoryCard } from "./useStreamingEvents";
import * as chatApi from "../../api/chatApi";

const WS_URL = "ws://localhost:8000/api/v1/ws/query";

export const useRAGChat = ({ model, mode }) => {
  const { sessionId: urlSessionId } = useParams();

  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [streamingEvents, setStreamingEvents] = useState([]);
  const [sessionId, setSessionId] = useState(urlSessionId ?? null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionError, setSessionError] = useState(null);

  const streamingEventsRef = useRef([]);
  const currentSessionIdRef = useRef(urlSessionId ?? null);
  const messagesEndRef = useRef(null);

  const {
    isConnected,
    isProcessing,
    events,
    currentAnswer,
    thinking,
    sendQuery,
  } = useRAGWebSocket(WS_URL);

  useEffect(() => {
    const sid = urlSessionId ?? null;
    setSessionId(sid);
    currentSessionIdRef.current = sid;
    setMessages([]);
    setStreamingMessage(null);
    setStreamingEvents([]);
    streamingEventsRef.current = [];
    setSessionError(null);

    if (!sid) return;

    setIsLoadingHistory(true);
    chatApi
      .getChatMessages(sid)
      .then((saved) => {
        if (!saved?.length) return;
        const mapped = saved.map((m) => {
          try {
            return JSON.parse(m.content);
          } catch {
            return {
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp).getTime(),
              isStreaming: false,
            };
          }
        });
        setMessages(mapped);
      })
      .catch(() => setSessionError("Не удалось загрузить историю чата."))
      .finally(() => setIsLoadingHistory(false));
  }, [urlSessionId]);

  useEffect(() => {
    streamingEventsRef.current = streamingEvents;
  }, [streamingEvents]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingEvents, scrollToBottom]);

  const ensureSession = useCallback(
    async (firstMessage) => {
      if (currentSessionIdRef.current) return currentSessionIdRef.current;
      try {
        const title =
          firstMessage.length > 50
            ? firstMessage.slice(0, 47) + "…"
            : firstMessage;
        const session = await chatApi.createSession(mode, model, title);
        if (!session?.id) throw new Error("Invalid session response");
        setSessionId(session.id);
        currentSessionIdRef.current = session.id;
        return session.id;
      } catch {
        setSessionError("Не удалось создать сессию чата.");
        return null;
      }
    },
    [mode, model],
  );

  useEffect(() => {
    if (events.length === 0 && !thinking) return;
    const newEvent = events[events.length - 1];

    if (newEvent) {
      const card = eventToStoryCard(newEvent);
      if (card) {
        setStreamingEvents((prev) =>
          prev.some((e) => e.id === card.id) ? prev : [...prev, card],
        );
      }
    }

    if (!streamingMessage && (events.length > 0 || thinking)) {
      setStreamingMessage({
        id: `streaming_${Date.now()}`,
        role: "assistant",
        timestamp: Date.now(),
        isStreaming: true,
      });
    }
  }, [events, thinking]);

  useEffect(() => {
    if (!thinking || !isProcessing) return;
    setStreamingEvents((prev) => [
      ...prev.filter((c) => c.type !== "thinking"),
      {
        id: `thinking_${Date.now()}`,
        type: "thinking",
        title: "Размышление",
        description: thinking,
        icon: "loading",
        color: "gray",
        timestamp: new Date().toLocaleTimeString(),
        isThinking: true,
      },
    ]);
  }, [thinking, isProcessing]);

  useEffect(() => {
    if (!currentAnswer || isProcessing || !streamingMessage) return;

    const finalEvents = [
      ...streamingEventsRef.current,
      {
        id: `answer_${Date.now()}`,
        type: "answer",
        title: "✨ Финальный ответ",
        icon: "sparkles",
        color: "gradient",
        isAnswer: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];

    const assistantMessage = {
      id: `assistant_${Date.now()}`,
      role: "assistant",
      content: currentAnswer,
      storyEvents: finalEvents,
      timestamp: Date.now(),
      isStreaming: false,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setStreamingMessage(null);
    setStreamingEvents([]);

    const sid = currentSessionIdRef.current;
    if (sid) {
      chatApi.saveMessage(sid, "assistant", assistantMessage).catch(() => {});
    }
  }, [currentAnswer, isProcessing, streamingMessage]);

  const handleSendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isProcessing) return;

      const userMessage = {
        id: `user_${Date.now()}`,
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setStreamingEvents([]);
      setStreamingMessage(null);

      const sid = await ensureSession(messageText);
      if (sid) {
        chatApi.saveMessage(sid, "user", userMessage).catch(() => {});
      }

      sendQuery(messageText);
    },
    [isProcessing, sendQuery, ensureSession],
  );

  return {
    messages,
    streamingMessage,
    streamingEvents,
    sessionError,
    isLoadingHistory,
    isConnected,
    isProcessing,
    currentAnswer,
    messagesEndRef,
    handleSendMessage,
  };
};
