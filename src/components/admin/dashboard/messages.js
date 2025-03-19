import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../../styles/admin/messages.css";

const API_BASE = "https://api.livechatinc.com/v3.5/agent/action";
const AUTH = `Basic ${btoa(
  `${process.env.REACT_APP_LIVECHAT_ACCOUNT_ID}:${process.env.REACT_APP_LIVECHAT_TOKEN}`
)}`;

export default function Messages() {
  const [agentId, setAgentId] = useState(null);

  useEffect(() => {
    console.log("Fetching agent ID...");
    console.log("Authorization Header:", AUTH);

    axios
      .post(`${API_BASE}/whoami`, {}, { headers: { Authorization: AUTH } })
      .then((res) => {
        console.log("API Response:", res.data);
        setAgentId(res.data.agent.id);
      })
      .catch((err) => {
        console.error("API Error:", err);
        console.error("Error Details:", err.response?.data);

        if (err.response?.status === 422) {
          alert(
            "Invalid credentials or request format. Please check your .env file."
          );
        } else {
          alert("An error occurred while fetching agent details.");
        }
      });
  }, []);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const chatBodyRef = useRef();

  // Fetch active chats
  useEffect(() => {
    axios
      .post(`${API_BASE}/list_chats`, {}, { headers: { Authorization: AUTH } })
      .then((res) => setChats(res.data.chats_summary))
      .catch(console.error);
  }, []);

  // When you pick a chat, load its full thread in one go
  useEffect(() => {
    if (!selectedChat) return;

    axios
      .post(
        `${API_BASE}/get_chat`,
        { chat_id: selectedChat.id },
        { headers: { Authorization: AUTH } }
      )
      .then((res) => {
        setMessages(res.data.thread.events);
        setTimeout(
          () =>
            chatBodyRef.current?.scrollTo(0, chatBodyRef.current.scrollHeight),
          50
        );
      })
      .catch(console.error);
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!draft.trim() || !selectedChat || !agentId) return;

    console.log("➤ Attempting to send reply to chat", selectedChat.id);

    try {
      // First try sending directly
      await axios.post(
        `${API_BASE}/send_event`,
        {
          chat_id: selectedChat.id,
          event: { type: "message", text: draft, visibility: "all" },
        },
        { headers: { Authorization: AUTH } }
      );

      console.log("✅ Message sent successfully");
    } catch (err) {
      console.warn(
        "⚠️ send_event failed:",
        err.response?.status,
        err.response?.data
      );

      // Only handle 403 (Forbidden) by joining chat then retrying
      if (err.response?.status === 403) {
        try {
          console.log("➤ Joining chat as agent", agentId);
          await axios.post(
            `${API_BASE}/add_user_to_chat`,
            {
              chat_id: selectedChat.id,
              user_id: agentId,
              user_type: "agent",
              visibility: "all",
            },
            { headers: { Authorization: AUTH } }
          );

          console.log("✅ Joined chat — retrying send_event");
          await axios.post(
            `${API_BASE}/send_event`,
            {
              chat_id: selectedChat.id,
              event: { type: "message", text: draft, visibility: "all" },
            },
            { headers: { Authorization: AUTH } }
          );

          console.log("✅ Message sent after joining");
        } catch (joinErr) {
          console.error(
            "❌ Failed to join or resend:",
            joinErr.response?.status,
            joinErr.response?.data
          );
          alert(
            `Error sending reply: ${
              joinErr.response?.data?.message || joinErr.message
            }`
          );
          return;
        }
      } else {
        console.error("❌ Unexpected error sending message:", err);
        alert(
          `Error sending reply: ${err.response?.data?.message || err.message}`
        );
        return;
      }
    }

    // Clear input and reload thread
    setDraft("");
    setSelectedChat((chat) => chat);
  };

  const getCustomerName = (chat) =>
    chat.users.find((u) => u.type === "customer")?.name || "Unknown";

  return (
    <div className="messages-container">
      <aside className="chat-list">
        <h3>Inbox</h3>
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`chat-item ${
              selectedChat?.id === chat.id ? "active" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            {getCustomerName(chat)}
          </button>
        ))}
      </aside>

      <section className="chat-window">
        {!selectedChat ? (
          <div className="empty-state">Select a chat to view messages</div>
        ) : (
          <>
            <header className="chat-header">
              {getCustomerName(selectedChat)}
            </header>
            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`message ${
                    m.author_id === "agent" ? "sent" : "received"
                  }`}
                >
                  {m.text}
                  <small>
                    {new Date(m.created_at || m.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>
            <footer className="chat-footer">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your reply…"
              />
              <button onClick={sendMessage}>Send</button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
