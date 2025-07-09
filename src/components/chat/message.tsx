import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import { UserIcon, Bot } from "lucide-react";

export type MessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("h-8 w-8 mt-0.5", isUser ? "bg-blue-600" : "bg-green-600")}>
        {isUser ? (
          <UserIcon className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </Avatar>

      <Card
        className={cn(
          "py-2 px-4 max-w-[80%]",
          isUser ? "bg-blue-50" : "bg-white"
        )}
      >
        <div className="prose prose-sm">
          {isUser ? (
            <p className="mb-0 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown className="whitespace-pre-wrap">
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        <div className="text-xs text-muted-foreground mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>
      </Card>
    </div>
  );
}