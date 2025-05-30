import React, { useEffect, useState, useRef } from "react";
import "../../../styles/admin/messages.css";

function Messages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [pollInterval, setPollInterval] = useState(10000);
  const [lastEventCount, setLastEventCount] = useState(0);
  const inactivityTimerRef = useRef(null);

  const handleActivity = () => {
    if (pollInterval === 3000) return;
    setPollInterval(3000);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(
      () => setPollInterval(10000),
      30000
    );
  };

  const fetchChats = async () => {
    try {
      const res = await fetch("backend/livechat_proxy.php?action=get_chats", {
        credentials: "include",
      });
      const data = await res.json();
      setChats(data.chats_summary || []);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const fetchChatDetails = async (chatId) => {
    try {
      const res = await fetch(
        `backend/livechat_proxy.php?action=get_chat_details&id=${chatId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSelectedChat(data);
      const newCount = data?.thread?.events?.length || 0;
      if (newCount > lastEventCount) handleActivity();
      setLastEventCount(newCount);
    } catch (err) {
      console.error("Error fetching chat details:", err);
    }
  };

  const getAgentId = async () => {
    const res = await fetch("backend/livechat_proxy.php?action=get_me", {
      credentials: "include",
    });
    const data = await res.json();
    return data.id;
  };

  const assignChat = async (chatId) => {
    try {
      const agentId = await getAgentId();
      await fetch(
        `backend/livechat_proxy.php?action=assign_chat&id=${chatId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ agent_id: agentId }),
        }
      );
    } catch (err) {
      console.error("Error assigning chat:", err);
    }
  };

  const joinChat = async (chatId) => {
    try {
      const threadId = selectedChat?.thread?.id;
      if (!threadId) throw new Error("Missing thread_id");

      await assignChat(chatId);

      const res = await fetch(
        `backend/livechat_proxy.php?action=join_chat&id=${chatId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ thread_id: threadId }),
        }
      );

      if (!res.ok) throw new Error("Failed to join chat");
    } catch (err) {
      console.error("Error joining chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!selectedChat?.id || !replyText.trim()) return;
    const chatId = selectedChat.id;
    try {
      await joinChat(chatId);
      await fetch(
        `backend/livechat_proxy.php?action=send_message&id=${chatId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: replyText }),
        }
      );
      setReplyText("");
      handleActivity();
      fetchChatDetails(chatId);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    fetchChats();
    const intervalId = setInterval(() => {
      fetchChats();
      if (selectedChat?.id) fetchChatDetails(selectedChat.id);
    }, pollInterval);
    return () => clearInterval(intervalId);
  }, [pollInterval, selectedChat]);

  const handleSelectChat = (chatId) => {
    setSelectedChat(null);
    setLastEventCount(0);
    fetchChatDetails(chatId);
  };

  return (
    <div className="messages-container">
      <div className="inbox">
        <h2 className="inbox-title">Inbox</h2>
        <ul className="chat-list">
          {chats.length === 0 && (
            <li className="chat-item no-chat">No chats available.</li>
          )}
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`chat-item ${
                selectedChat?.id === chat.id ? "active" : ""
              }`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="chat-id">{chat.id}</div>
              <div className="chat-snippet">
                Last Message:{" "}
                {chat.last_event_per_type?.message?.event?.text || "N/A"}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-details">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <span>Chat ID:</span> {selectedChat.id}
            </div>
            <div className="chat-window">
              {selectedChat.thread?.events?.length > 0 ? (
                selectedChat.thread.events.map((ev) => (
                  <div key={ev.id} className="chat-message">
                    <div className="message-author">{ev.author_id}</div>
                    <div className="message-text">{ev.text}</div>
                    <div className="message-timestamp">
                      {new Date(ev.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages in this chat.</div>
              )}
            </div>
            <div className="chat-reply">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="reply-input"
              />
              <button onClick={sendMessage} className="reply-button">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            Please select a chat from your inbox to view details and reply.
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
