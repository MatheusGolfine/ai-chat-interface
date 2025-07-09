import { useRef, useEffect } from "react";
import { Message, MessageType } from "./message";

interface ChatContainerProps {
  messages: MessageType[];
  isProcessing: boolean;
}

export function ChatContainer({ messages, isProcessing }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to AI Chat</h2>
            <p className="text-muted-foreground mt-2">
              Send a message to start chatting with your AI agent
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isProcessing && (
            <div className="flex gap-3">
              <div className="h-8 w-8 mt-0.5 rounded-full bg-green-600 flex items-center justify-center">
                <div className="h-4 w-4 text-white" />
              </div>
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}