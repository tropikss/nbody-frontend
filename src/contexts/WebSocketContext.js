import { useContext } from "react";
import { WebSocketContext } from "../components/WebSocketProvider.jsx";

export const useWebSocket = () => useContext(WebSocketContext);
