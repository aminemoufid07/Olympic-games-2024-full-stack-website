// import React, { useState } from "react";
// import axios from "axios";
// import "./Chatbot.css";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (input.trim() === "") return;

//     const userMessage = { text: input, type: "user" };
//     setMessages([...messages, userMessage]);

//     try {
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
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Récupérer la réponse et l'afficher
//       const botResponse = {
//         text: response.data.choices[0].text.trim(),
//         type: "bot",
//       };
//       setMessages([...messages, userMessage, botResponse]);
//     } catch (error) {
//       console.error("Error fetching response from OpenAI:", error);
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
