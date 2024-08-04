// import React, { useState } from "react";
// import axios from "axios";
// import "./Chatbot.css";

// <<<<<<< HEAD
// =======
// const AZURE_ENDPOINT = "https://amine-llm.openai.azure.com";
// const AZURE_API_KEY = "89fa7c21362a44ad862d2e74379cf565";
// const DEPLOYMENT_ID = "gpt-35-turbo";
// const API_VERSION = "2024-04-01-preview";

// >>>>>>> 7d8f3bb35d760265c64b974f0d6eb17a55985181
// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (input.trim() === "") return;

//     const userMessage = { text: input, type: "user" };
//     setMessages([...messages, userMessage]);

//     try {
// <<<<<<< HEAD
//       // Envoyer la question à GPT-4
//       const response = await axios.post(
//         "https://chatbot-jo.openai.azure.com/",
//         {
//           model: "gpt-35-turbo",
//           prompt: `You are a chatbot specialized in the Olympics. Only answer questions related to the Olympics. Question: ${input}`,
//           max_tokens: 150,
//           temperature: 0.5,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
// =======
//       const response = await axios.post(
//         `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_ID}/completions?api-version=${API_VERSION}`,
//         {
//           messages: [
//             {
//               role: "system",
//               content:
//                 "You are an AI assistant that helps people find information.",
//             },
//             { role: "user", content: input },
//           ],
//           max_tokens: 800,
//           temperature: 0.7,
//           top_p: 0.95,
//           frequency_penalty: 0,
//           presence_penalty: 0,
//           stop: null,
//         },
//         {
//           headers: {
//             "api-key": AZURE_API_KEY,
// >>>>>>> 7d8f3bb35d760265c64b974f0d6eb17a55985181
//             "Content-Type": "application/json",
//           },
//         }
//       );

// <<<<<<< HEAD
//       // Récupérer la réponse et l'afficher
//       const botResponse = {
//         text: response.data.choices[0].text.trim(),
// =======
//       const botResponse = {
//         text: response.data.choices[0].message.content.trim(),
// >>>>>>> 7d8f3bb35d760265c64b974f0d6eb17a55985181
//         type: "bot",
//       };
//       setMessages([...messages, userMessage, botResponse]);
//     } catch (error) {
//       const errorResponse = {
//         text: "Sorry, I couldn't fetch a response. Please try again.",
//         type: "bot",
//       };
//       setMessages([...messages, userMessage, errorResponse]);
//     }

//     setInput("");
//   };

//   return (
//     <div className="chatbot">
//       <div className="chatbox">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.type}`}>
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-box">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSend()}

//           placeholder="Ask me about the Olympics..."

//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
