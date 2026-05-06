import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { StreamingMessage } from "./StreamingMessage";
import { FinalMessage } from "./FinalMessage";
import { useRAGChat } from "./useRAGChat";
import { RAG_SERVICES, DEFAULT_SERVICE } from "./ragServices";

const RAGChat = ({ model = "claude-sonnet-4-20250514", mode = "rag" }) => {
  const [selectedService, setSelectedService] = useState(DEFAULT_SERVICE);

  const {
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
  } = useRAGChat({ model, mode, wsUrl: selectedService.wsUrl });

  const handleServiceChange = (serviceId) => {
    const service = RAG_SERVICES.find((s) => s.id === serviceId);
    if (service) setSelectedService(service);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {sessionError && (
        <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 text-center">
          {sessionError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="h-4" />

          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Загрузка истории...
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div
                    key={message.id}
                    className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="max-w-[85%] md:max-w-[70%]">
                      <div className="rounded-2xl px-5 py-3 bg-gray-100 outline-1 dark:bg-gray-900 text-primary">
                        <p className="text-sm md:text-base whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p className="text-xs mt-1.5 text-primary/70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FinalMessage key={message.id} message={message} />
                ),
              )}

              <StreamingMessage
                isProcessing={isProcessing}
                streamingMessage={streamingMessage}
                streamingEvents={streamingEvents}
                currentAnswer={currentAnswer}
              />

              <div ref={messagesEndRef} className="mt-20" />
            </div>
          )}
        </div>
      </div>

      <ChatInput
        onSend={handleSendMessage}
        isLoading={isProcessing}
        placeholder="Задайте вопрос..."
        disabled={!isConnected}
        isConnected={isConnected}
        services={RAG_SERVICES}
        selectedServiceId={selectedService.id}
        onServiceChange={handleServiceChange}
      />
    </div>
  );
};

export default RAGChat;
