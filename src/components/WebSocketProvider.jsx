import {createContext, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";


export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const messageHandlerRef = useRef(null);

    // Fonction d'enregistrement du callback
    const registerMessageHandler = (handler) => {
        messageHandlerRef.current = handler;
    };

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/ws");

        ws.onopen = () => console.log("WebSocket connecté");
        ws.onmessage = (msg) => {
            console.log("Message reçu dans le provider :", msg.data);
            if (messageHandlerRef.current) {
                // Redirige le message vers le callback enregistré
                messageHandlerRef.current(msg);
            }
        };        ws.onclose = () => console.log("WebSocket fermé");

        setSocket(ws);

        return () => ws.close();
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, registerMessageHandler }}>
            {children}
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
