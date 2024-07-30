import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const AZURE_ENDPOINT = "https://amine-llm.openai.azure.com";
const AZURE_API_KEY = "89fa7c21362a44ad862d2e74379cf565";
const DEPLOYMENT_ID = "gpt-35-turbo";
const API_VERSION = "2024-04-01-preview";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, type: "user" };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}/completions?api-version=${API_VERSION}`,
        {
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that helps people find information.",
            },
            { role: "user", content: input },
          ],
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: null,
        },
        {
          headers: {
            "api-key": AZURE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = {
        text: response.data.choices[0].message.content.trim(),
        type: "bot",
      };
      setMessages([...messages, userMessage, botResponse]);
    } catch (error) {
      console.error("Error fetching response from Azure OpenAI:", error);
      const errorResponse = {
        text: "Sorry, I couldn't fetch a response. Please try again.",
        type: "bot",
      };
      setMessages([...messages, userMessage, errorResponse]);
    }

    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="chatbox">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
