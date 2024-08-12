import React, { useState } from "react";

// Define the default system context
const DEFAULT_SYSTEM_CONTEXT =
  "Assistant is a large language model trained by OpenAI.";

export function Chatbot({
  rolePrompt = "You are a helpful assistant.",
  commandPrompt = "Hello, how can I assist you today?",
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Configuration values
  const AzureOpenAIEndpoint = "https://<your-resource-name>.openai.azure.com";
  const ChatCompletionsDeploymentName = "gpt-4o-mini";
  const apiVersion = "2024-07-18";
  const SearchEndpoint = "<your-search-endpoint>";
  const SearchIndex = "<your-search-index>";
  const resource = "https://cognitiveservices.azure.com/";

  const url = `${AzureOpenAIEndpoint}/openai/deployments/${ChatCompletionsDeploymentName}/chat/completions?api-version=${apiVersion}`;

  const initialContext = {
    role: "system",
    content: rolePrompt || DEFAULT_SYSTEM_CONTEXT,
  };

  const currentConversation = [initialContext];

  if (commandPrompt) {
    currentConversation.push({
      role: "user",
      content: commandPrompt,
    });
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "<your-api-key>", // Replace with your actual API key
        },
        body: JSON.stringify({
          data_sources: [
            {
              type: "azure_search",
              parameters: {
                endpoint: SearchEndpoint,
                index_name: SearchIndex,
                authentication: {
                  type: "system_assigned_managed_identity",
                },
              },
            },
          ],
          messages: [...currentConversation, userMessage],
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to send completion request: ${errorMessage}`);
      }

      const data = await response.json();
      const botMessage = data.choices[0].message;

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setInput(""); // Clear input after sending
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chatbox">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
