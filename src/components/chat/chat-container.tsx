import { useRef, useEffect } from "react";
import { Message, MessageType } from "./message";

import { ChatInput } from "./chat-input";
import { useNavigate } from "react-router-dom";
interface ChatContainerProps {
  messages: MessageType[];
  isProcessing: boolean;
}

export function ChatContainer({ messages, isProcessing }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSendMessage = async (message: string, option: string) => {
    let endpoint = '';
    switch (option) {
      case 'materia':
        endpoint = 'https://criadordigital-n8n-editor.zvjzjy.easypanel.host/webhook/9f0a09e0-a26f-4687-ac43-9b08c62d8c1a'; // Replace with your actual API endpoint for materia
        break;
      case 'avaliacao':
        endpoint = '/api/bolo-avaliacao'; // Replace with your actual API endpoint for avaliacao
        break;
      case 'trilha':
        endpoint = '/api/bolo-trilha'; // Replace with your actual API endpoint for trilha
        break;
      default:
        console.error('Unknown option selected');
        return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      const encodedHtml = encodeURIComponent(data.message);
      navigate(`/edit?content=${encodedHtml}`);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

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