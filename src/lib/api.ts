interface AgentSettings {
  endpoint: string;
  apiKey: string;
  systemPrompt: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendMessageToAgent(
  messages: Message[],
  settings: AgentSettings
): Promise<string> {
  try {
    // Format the messages including the system prompt
    const formattedMessages: Message[] = [
      { role: "system", content: settings.systemPrompt },
      ...messages,
    ];

    // Make the API call
    const response = await fetch(settings.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(settings.apiKey && { Authorization: `Bearer ${settings.apiKey}` }),
      },
      body: JSON.stringify({
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorData.error || response.statusText
        }`
      );
    }

    // Parse and return the response
    const data = await response.json();
    
    // This structure might vary based on the API you're using
    // Adjust according to the actual response structure
    return data.choices?.[0]?.message?.content || data.response || data.message || data.result;
  } catch (error) {
    console.error("Error sending message to agent:", error);
    throw error;
  }
}