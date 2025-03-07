import { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/YOUR_UNIQUE_ID/default";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup when component unmounts
    };
  }, []);

  return null; // No UI needed, just loads script
};

export default LiveChat;
