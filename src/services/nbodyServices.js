import NBodySimulation from "../components/NBodySimulation";

const API_URL = "http://localhost:8080/ws";
import { useWebSocket } from "../contexts/WebSocketContext";
import {useState} from "react";

export const getBodies = async (socket) => {
    try {
        const nBody = socket.send("[getBodies]");
        return nBody;
    } catch (error) {
        console.error("Erreur lors de la récupération des corps :", error);
        return [];
    }
};
