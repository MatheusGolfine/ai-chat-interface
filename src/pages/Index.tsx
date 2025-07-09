import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendIcon, PlusCircle, Globe, Mic } from "lucide-react";
import { MessageType } from "@/components/chat/message";
import { sendMessageToAgent } from "@/lib/api";

const LOCAL_STORAGE_KEYS = {
  MESSAGES: "ai-chat-messages",
  SETTINGS: "ai-chat-settings",
};

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [settings, setSettings] = useState({
    endpoint: "https://api.example.com/chat",
    apiKey: "",
    systemPrompt: "You are a helpful AI assistant that responds concisely and accurately.",
  });

  // Load saved messages and settings from localStorage
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(LOCAL_STORAGE_KEYS.MESSAGES);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }

      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving messages to localStorage:", error);
    }
  }, [messages]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  }, [settings]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const newUserMessage: MessageType = {
      id: uuidv4(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsProcessing(true);

    try {
      // Convert messages to the format expected by the API
      const apiMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      apiMessages.push({
        role: "user",
        content: inputValue,
      });

      // Send the message to the API
      const response = await sendMessageToAgent(apiMessages, settings);

      // Create a new assistant message with the response
      const newAssistantMessage: MessageType = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error("Error getting response from agent:", error);
      
      // Add an error message
      const errorMessage: MessageType = {
        id: uuidv4(),
        role: "assistant",
        content: `Sorry, I encountered an error while processing your request: ${(error as Error).message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-16 bg-white border-r flex flex-col items-center py-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
          <span className="text-white font-bold">AI</span>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            className="rounded-full"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">New Chat</span>
          </Button>
          <div className="h-px w-8 bg-gray-200 my-2"></div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Globe className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Web Search</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6 bg-[#f8f9fa] bg-[url('/assets/light-pattern.svg')] bg-repeat">
          <div className="w-full max-w-2xl flex flex-col items-center">
            {messages.length === 0 ? (
              <>
                <h1 className="text-3xl font-medium mb-8 text-gray-800">Como posso ajudar?</h1>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-lg">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="material" className="data-[state=active]:bg-blue-100">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Material
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="avaliacao" className="data-[state=active]:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="9" y1="9" x2="15" y2="9"></line>
                          <line x1="9" y1="12" x2="15" y2="12"></line>
                          <line x1="9" y1="15" x2="13" y2="15"></line>
                        </svg>
                        Avaliação
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="trilha" className="data-[state=active]:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                        Trilha
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </>
            ) : (
              <div className="w-full bg-white rounded-xl shadow-sm p-6 mb-8">
                {messages.map((message, index) => (
                  <div key={message.id} className={`mb-6 ${message.role === "user" ? "text-right" : "text-left"}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "bg-blue-100 text-gray-800" : "bg-gray-100 text-gray-800"}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-100 p-3 rounded-lg inline-block max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Input area */}
            <div className="relative w-full">
              <div className="flex items-center bg-white rounded-full border shadow-sm">
                <Button variant="ghost" size="icon" className="rounded-full ml-1">
                  <PlusCircle className="h-5 w-5 text-gray-500" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Descreva o que deseja criar"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isProcessing}
                />
                <div className="flex items-center gap-1 mr-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Globe className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="bg-blue-600 hover:bg-blue-700 h-8 w-8 rounded-full"
                  >
                    <SendIcon className="h-4 w-4" />
                    <span className="sr-only">Enviar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}