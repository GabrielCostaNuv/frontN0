import { useContext } from "react";
import { ChatContext } from "./context/ChatContext";
import TaskHistory from "./TaskHistory";

export default function Chat({ isExpandForm }: { isExpandForm: boolean }) {
  const context = useContext(ChatContext);

  const messages = context?.messages ? context.messages : [];

  console.log(messages);

  return (
    <div
      className={`chat-container ${isExpandForm ? "block opacityMessage" : "hidden"}`}
      style={{
        height: "calc(100vh - 264px)",
      }}
    >
      {/* {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
        >
          <p className="message-text">{message.text}</p>
        </div>
      ))} */}
      <TaskHistory />
    </div>
  );
}
