// hooks/useRAGWebSocket.js
import { useState, useCallback, useRef, useEffect } from "react";

export const useRAGWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const eventHandlersRef = useRef({});
  const urlRef = useRef(url);

  // Register event handler
  const on = useCallback((eventType, handler) => {
    eventHandlersRef.current[eventType] = handler;
  }, []);

  // Remove event handler
  const off = useCallback((eventType) => {
    delete eventHandlersRef.current[eventType];
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null; // prevent reconnect loop
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsProcessing(false);
  }, []);

  const connect = useCallback((targetUrl) => {
    // Close existing connection first
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setError(null);

    const ws = new WebSocket(targetUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      if (eventHandlersRef.current["open"]) {
        eventHandlersRef.current["open"]();
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setEvents((prev) => [...prev, message]);

        switch (message.type) {
          case "thinking":
            if (eventHandlersRef.current["thinking"]) {
              eventHandlersRef.current["thinking"](message.content);
            }
            break;
          case "iteration_start":
            if (eventHandlersRef.current["iteration_start"]) {
              eventHandlersRef.current["iteration_start"](message.data);
            }
            break;
          case "llm_response":
            if (eventHandlersRef.current["llm_response"]) {
              eventHandlersRef.current["llm_response"](message.data);
            }
            break;
          case "tool_call":
            if (eventHandlersRef.current["tool_call"]) {
              eventHandlersRef.current["tool_call"](message.data);
            }
            break;
          case "tool_result":
            if (eventHandlersRef.current["tool_result"]) {
              eventHandlersRef.current["tool_result"](message.data);
            }
            break;
          case "answer":
            setCurrentAnswer(message.content);
            if (eventHandlersRef.current["answer"]) {
              eventHandlersRef.current["answer"](message.content);
            }
            break;
          case "complete":
            setIsProcessing(false);
            if (eventHandlersRef.current["complete"]) {
              eventHandlersRef.current["complete"](
                message.data || message.content,
              );
            }
            break;
          case "error":
            setError(message.content);
            setIsProcessing(false);
            if (eventHandlersRef.current["error"]) {
              eventHandlersRef.current["error"](message.content);
            }
            break;
          default:
            if (eventHandlersRef.current[message.type]) {
              eventHandlersRef.current[message.type](message);
            }
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
        setError("Failed to parse server message");
      }
    };

    ws.onerror = () => {
      setError("WebSocket connection error");
      setIsConnected(false);
      if (eventHandlersRef.current["error"]) {
        eventHandlersRef.current["error"]("Connection error");
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsProcessing(false);
      if (eventHandlersRef.current["close"]) {
        eventHandlersRef.current["close"]();
      }
    };
  }, []);

  // Reconnect when URL changes
  useEffect(() => {
    if (url !== urlRef.current) {
      urlRef.current = url;
    }
    connect(url);
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url, connect]);

  const sendQuery = useCallback((query, options = {}) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected");
      return false;
    }
    const message = {
      type: "query",
      payload: { query, ...options },
    };
    wsRef.current.send(JSON.stringify(message));
    setIsProcessing(true);
    setCurrentAnswer("");
    setEvents([]);
    setError(null);
    return true;
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    isConnected,
    isProcessing,
    events,
    currentAnswer,
    error,
    sendQuery,
    connect,
    disconnect,
    clearEvents,
    on,
    off,
  };
};
