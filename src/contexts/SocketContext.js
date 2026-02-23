import { io } from "socket.io-client";
import Cookies from "js-cookie";

let socket;

export const initSocket = () => {
  const token = Cookies.get("token");

  if (!token) {
    console.log("⚠️ No token found yet — delaying socket connection");
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io("https://backend.faresharellc.com", {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  socket.on("connect_error", (err) =>
    console.error("❌ Socket connect error:", err.message),
  );

  return socket;
};

export default socket;
