import { useEffect, useState } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("https://api.tawk.to/conversations", {
          method: "GET",
          headers: {
            Authorization: "Bearer YOUR_TAWK_API_KEY",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="messages-container">
      <h2>Live Chat Messages</h2>
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className="message">
            <p>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          </div>
        ))
      ) : (
        <p>No messages yet...</p>
      )}
    </div>
  );
};

export default Messages;
