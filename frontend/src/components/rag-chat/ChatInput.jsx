import React, { useRef, useCallback, memo, useState, useEffect } from "react";
import { ArrowUp, Loader2, Wifi, WifiOff } from "lucide-react";

export const ChatInput = memo(
  ({
    onSend,
    isLoading = false,
    placeholder = "Сообщение...",
    services = [],
    selectedServiceId = "",
    onServiceChange,
    disabled = false,
    className = "",
    isConnected = false,
  }) => {
    const [value, setValue] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const textareaRef = useRef(null);
    const serviceDropdownRef = useRef(null);

    const selectedService =
      services.find((s) => s.id === selectedServiceId) || services[0];
    const ServiceIcon = selectedService?.icon;

    const adjustHeight = useCallback(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }, []);

    useEffect(() => {
      if (!value && textareaRef.current)
        textareaRef.current.style.height = "auto";
    }, [value]);

    useEffect(() => {
      const handler = (e) => {
        if (
          serviceDropdownRef.current &&
          !serviceDropdownRef.current.contains(e.target)
        )
          setIsServiceOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
      const t = setTimeout(() => textareaRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }, []);

    const handleSend = useCallback(() => {
      const trimmed = value.trim();
      if (trimmed && !isLoading && !disabled && isConnected) {
        onSend(trimmed);
        setValue("");
        adjustHeight();
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
    }, [value, isLoading, disabled, isConnected, onSend, adjustHeight]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey && !isComposing) {
          e.preventDefault();
          handleSend();
        }
        if (e.key === "Escape") {
          setValue("");
          adjustHeight();
        }
      },
      [handleSend, isComposing, adjustHeight],
    );

    const handleServiceSelect = useCallback(
      (id) => {
        onServiceChange?.(id);
        setIsServiceOpen(false);
        textareaRef.current?.focus();
      },
      [onServiceChange],
    );

    const canSend = value.trim() && isConnected && !isLoading && !disabled;

    const iconBtn =
      "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-150";

    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 py-3 px-4 ${className}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* ── single unified box ─────────────────────────────────────── */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              flex items-end gap-1 px-2 py-2 rounded-2xl
              bg-gray-100 dark:bg-gray-900
              border
              transition-[border-color] duration-200
              ${
                isHovered
                  ? "border-gray-400 dark:border-gray-700"
                  : "border-gray-200 dark:border-gray-800"
              }
            `}
          >
            {/* connection status */}
            <div
              className={`${iconBtn} cursor-default group relative flex-shrink-0`}
            >
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500 dark:text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400 dark:text-red-400" />
              )}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {isConnected ? "WebSocket подключен" : "Переподключение..."}
              </div>
            </div>

            {/* service selector */}
            {services.length > 0 && (
              <div className="relative flex-shrink-0" ref={serviceDropdownRef}>
                <button
                  onClick={() => setIsServiceOpen((v) => !v)}
                  disabled={isLoading}
                  className={`
                    ${iconBtn}
                    ${
                      isServiceOpen
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-100"
                    }
                    disabled:opacity-40 disabled:cursor-not-allowed
                  `}
                  title={selectedService?.label}
                >
                  {ServiceIcon && <ServiceIcon className="w-4 h-4" />}
                </button>

                {isServiceOpen && (
                  <div className="absolute bottom-full mb-2 left-0 min-w-[220px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div>
                      {services.map((service) => {
                        const Icon = service.icon;
                        const isActive = service.id === selectedService?.id;
                        return (
                          <button
                            key={service.id}
                            onClick={() => handleServiceSelect(service.id)}
                            className={`w-full px-3 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-100 ${isActive ? "bg-gray-50 dark:bg-gray-800/70" : ""}`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"}`}
                            >
                              {Icon && <Icon className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium ${isActive ? "text-primary" : "text-gray-800 dark:text-gray-100"}`}
                              >
                                {service.labelRu ?? service.label}
                              </p>
                              {(service.descriptionRu ??
                                service.description) && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                                  {service.descriptionRu ?? service.description}
                                </p>
                              )}
                            </div>
                            {isActive && (
                              <span className="text-[11px] text-primary flex-shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* textarea — transparent so the box bg shows through */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
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
              className="
                flex-1 min-h-[36px] max-h-[120px]
                px-2 py-2
                bg-transparent
                text-gray-900 dark:text-gray-100
                text-sm leading-relaxed
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                resize-none focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              style={{ scrollbarWidth: "thin" }}
            />

            {/* shift+enter hint */}
            {!value && isConnected && (
              <span className="hidden sm:block text-xs text-gray-400 dark:text-gray-600 select-none flex-shrink-0 pb-2.5 pr-1">
                Shift + Enter ↵
              </span>
            )}

            {/* send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`
                ${iconBtn} flex-shrink-0
                ${
                  canSend
                    ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-white hover:scale-105 active:scale-95"
                    : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <style>{`
          textarea::-webkit-scrollbar { width: 6px; }
          textarea::-webkit-scrollbar-track { background: transparent; }
          textarea::-webkit-scrollbar-thumb { background-color: rgba(156,163,175,0.4); border-radius: 3px; }
          .dark textarea::-webkit-scrollbar-thumb { background-color: rgba(75,85,99,0.4); }
          textarea { scrollbar-width: thin; scrollbar-color: rgba(156,163,175,0.4) transparent; }
          .dark textarea { scrollbar-color: rgba(75,85,99,0.4) transparent; }
        `}</style>
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";
