import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { useState, FormEvent, useRef, useEffect, MouseEvent } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
 onApiResponse?: (responseMessage: string) => void;
}

export function ChatInput({ onSendMessage, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const callApi = async (message: string, option: string) => {
    let endpoint = '';
    switch (option) {
      case 'materia':
        endpoint = '/api/bolo-material'; // Replace with your actual API endpoint for materia
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
      console.log('API Response:', data); // Log the response for now

      // Assuming the API response has a 'message' field with the string to display
      if (data && typeof data.message === 'string' && onApiResponse) {
        onApiResponse(data.message);
      }
    } catch (error) {
      // Handle API errors, potentially inform the user
      console.error('Error calling API:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing && selectedOption) {
      await callApi(message, selectedOption);
      setMessage('');
      setSelectedOption(null); // Reset selected option after sending
    } else if (!selectedOption) {
      alert('Please select an option (Matéria, Avaliação, or Trilha) before sending.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    // Optionally, you could also focus the textarea here
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Message your agent..."
          className="pr-12 min-h-[50px] max-h-[200px] resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 bottom-2"
          disabled={!message.trim() || isProcessing || selectedOption === null}
        >
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <div className="flex gap-2 justify-center">
        <Button type="button" variant={selectedOption === 'materia' ? 'default' : 'outline'} onClick={() => handleOptionClick('materia')}>
          Matéria
        </Button>
        <Button type="button" variant={selectedOption === 'avaliacao' ? 'default' : 'outline'} onClick={() => handleOptionClick('avaliacao')}>
          Avaliação
        </Button>
        <Button type="button" variant={selectedOption === 'trilha' ? 'default' : 'outline'} onClick={() => handleOptionClick('trilha')}>
          Trilha
        </Button>
      </div>
    </form>
  );
}