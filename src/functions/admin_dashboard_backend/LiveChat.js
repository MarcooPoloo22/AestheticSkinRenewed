import { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/YOUR_TAWK_ID/default";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();

    // Notify when a new message is received
    Tawk_API.onMessageReceived = function (message) {
      alert("New Message from " + message.sender + ": " + message.content);
    };
  }, []);

  return null; // No UI needed, just loads the chat script
};

export default LiveChat;
