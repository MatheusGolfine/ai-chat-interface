import { Button } from "@/components/ui/button";
import { AgentSettings } from "./agent-settings";
import { Trash2, RefreshCw } from "lucide-react";

interface AgentSettings {
  endpoint: string;
  apiKey: string;
  systemPrompt: string;
}

interface HeaderProps {
  onClearChat: () => void;
  settings: AgentSettings;
  onSaveSettings: (settings: AgentSettings) => void;
  onResetChat: () => void;
}

export function Header({ onClearChat, settings, onSaveSettings, onResetChat }: HeaderProps) {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">AI Chat Interface</h1>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onResetChat}
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Reset Chat</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onClearChat}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Clear Chat</span>
        </Button>
        <AgentSettings settings={settings} onSaveSettings={onSaveSettings} />
      </div>
    </div>
  );
}