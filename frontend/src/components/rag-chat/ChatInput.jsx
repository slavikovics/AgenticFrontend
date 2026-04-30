// src/components/ui/chat-input.jsx
import React, { useRef, useCallback, memo, useState, useEffect } from "react";
import { ArrowUp, Loader2, ChevronDown, Wifi, WifiOff } from "lucide-react";

export const ChatInput = memo(
  ({
    onSend,
    isLoading = false,
    placeholder = "Сообщение...",
    models = [],
    selectedModel = "",
    onModelChange,
    disabled = false,
    className = "",
    isConnected = false,
  }) => {
    const [value, setValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const textareaRef = useRef(null);
    const modelSelectRef = useRef(null);

    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }, []);

    useEffect(() => {
      if (!value) {
        const textarea = textareaRef.current;
        if (textarea) textarea.style.height = "auto";
      }
    }, [value]);

    const handleChange = useCallback(
      (e) => {
        setValue(e.target.value);
        adjustHeight();
      },
      [adjustHeight],
    );

    const handleSend = useCallback(() => {
      const trimmed = value.trim();
      if (trimmed && !isLoading && !disabled && isConnected) {
        onSend(trimmed);
        setValue("");
        adjustHeight();

        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    }, [value, isLoading, disabled, isConnected, onSend, adjustHeight]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey && !isComposing) {
          e.preventDefault();
          handleSend();
        }

        if (e.key === "Escape") {
          e.preventDefault();
          setValue("");
          adjustHeight();
        }
      },
      [handleSend, isComposing, adjustHeight],
    );

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          modelSelectRef.current &&
          !modelSelectRef.current.contains(event.target)
        ) {
          setIsModelOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }, []);

    const handleModelSelect = useCallback(
      (model) => {
        if (onModelChange) {
          onModelChange(model);
        }
        setIsModelOpen(false);
      },
      [onModelChange],
    );

    return (
      <div
        className={`
      fixed bottom-0 left-0 right-0 z-50
      py-3 px-4
      ${className}
    `}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            {/* Status Button */}
            <button
              disabled
              className={`
              w-10 h-10 rounded-full flex-shrink-0
              flex items-center justify-center
              transition-all duration-200
              ${
                isConnected
                  ? "bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400"
              }
              cursor-default
              group relative
            `}
            >
              {isConnected ? (
                <div className="relative">
                  <Wifi className="h-4 w-4" />
                  <span className="absolute inset-0 animate-ping opacity-75">
                    <Wifi className="h-4 w-4" />
                  </span>
                </div>
              ) : (
                <WifiOff className="h-4 w-4 animate-pulse" />
              )}

              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {isConnected
                  ? "WebSocket подключен"
                  : "Нет подключения к серверу"}
              </div>
            </button>

            {models.length > 0 && (
              <div className="relative" ref={modelSelectRef}>
                <button
                  onClick={() => setIsModelOpen(!isModelOpen)}
                  disabled={isLoading || disabled}
                  className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg
                  bg-gray-50 dark:bg-gray-800
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  text-gray-700 dark:text-gray-300
                  hover:text-gray-900 dark:hover:text-white
                  text-sm font-medium
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  whitespace-nowrap
                `}
                >
                  <span className="max-w-[120px] truncate">
                    {selectedModel || "Выберите модель"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isModelOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isModelOpen && (
                  <div className="absolute bottom-full mb-2 left-0 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="py-1 max-h-[300px] overflow-y-auto">
                      {models.map((model) => (
                        <button
                          key={model.value}
                          onClick={() => handleModelSelect(model.value)}
                          className={`
                          w-full px-4 py-2 text-left text-sm
                          hover:bg-gray-50 dark:hover:bg-gray-700
                          transition-colors duration-150
                          ${
                            selectedModel === model.value
                              ? "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              : "text-gray-700 dark:text-gray-300"
                          }
                        `}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{model.label}</span>
                            {model.description && (
                              <span className="text-xs text-gray-500">
                                {model.description}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 relative">
              <div
                className={`
              relative rounded-2xl
              bg-white dark:bg-gray-900
              transition-all duration-200
              ${isFocused ? "ring-2 ring-primary/20" : ""}
            `}
              >
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  disabled={disabled || isLoading || !isConnected}
                  placeholder={
                    !isConnected ? "Ожидание подключения..." : placeholder
                  }
                  rows={1}
                  className={`
                  w-full min-h-[44px] max-h-[120px]
                  px-4 py-3
                  bg-gray-100 dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  text-sm leading-relaxed
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  resize-none
                  focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                  rounded-2xl
                `}
                  style={{
                    scrollbarWidth: "thin",
                  }}
                />

                {!value && !isLoading && isConnected && (
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-600 pointer-events-none">
                    <span className="hidden sm:inline">Shift + Enter ↵</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading || !value.trim() || disabled || !isConnected}
              className="
              w-10 h-10 rounded-full flex-shrink-0
              bg-gradient-to-r from-gray-800 to-gray-700
              hover:from-gray-800/90 hover:to-gray-700/90
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center
              transition-all duration-200
              hover:scale-105 active:scale-95
            "
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        <style>
          {`
        textarea::-webkit-scrollbar {
          width: 6px;
        }

        textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        textarea::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }

        .dark textarea::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }

        .dark textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }

        textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .dark textarea {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }
      `}
        </style>
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";
