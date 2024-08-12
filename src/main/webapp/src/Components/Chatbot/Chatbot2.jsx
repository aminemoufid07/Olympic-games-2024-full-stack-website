// import React, { useState } from "react";
// import AzureOpenAIClientWrapper from "./AzureOpenAIClientWrapper";
// import Persona from "./Persona";

// function Chatbot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const client = new AzureOpenAIClientWrapper(
//     "https://chatbot-jo.openai.azure.com/deployments/gpt-4o-mini",
//     "3aa37259f8da45ddb9fa268aa5238f24"
//   );

//   const persona = new Persona([{ role: "system", content: "You are a helpful assistant." }], { client });

//   const sendMessage = async () => {
//     if (input.trim() !== "") {
//       const userMessage = { role: "user", content: input };
//       persona.addMessage(userMessage);
//       setMessages([...messages, userMessage]);

//       try {
//         const botResponse = await persona.ask();
//         const botMessage = { role: "assistant", content: botResponse };
//         setMessages((prevMessages) => [...prevMessages, botMessage]);
//       } catch (error) {
//         console.error("Error during chat:", error);
//       }

//       setInput("");
//     }
//   };

//   return (
//     <div className="chatbot">
//       <div className="chatbox">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.role === "user" ? "user" : "bot"}`}>
//             {message.content}
//           </div>
//         ))}
//       </div>
//       <div className="input-box">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;
