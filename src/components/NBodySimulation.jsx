import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

const CANVAS_SIZE = 500;
const CENTER = CANVAS_SIZE / 2;

const NBodySimulation = () => {
    const { socket, registerMessageHandler } = useWebSocket();
    const [message, setMessage] = useState("");
    const [bodies, setBodies] = useState([]);
    const bodiesRef = useRef(bodies); // pour avoir toujours les dernières données
    const [fps, setFps] = useState(250);
    const canvasRef = useRef(null);

    // Mise à jour du ref à chaque changement de bodies
    useEffect(() => {
        bodiesRef.current = bodies;
    }, [bodies]);

    // Enregistrement unique du callback de réception
    useEffect(() => {
        if (!registerMessageHandler) return;
        registerMessageHandler((msg) => {
            try {
                const nBody = JSON.parse(msg.data);
                setBodies(nBody);
            } catch (error) {
                console.error("Erreur lors du parsing du message :", error);
            }
        });
    }, [registerMessageHandler]);

    // Envoi périodique de la commande [getBodies]
    useEffect(() => {
        if (!socket) return;
        const interval = setInterval(() => {
            socket.send("[getBodies]");
        }, 1000 / fps);
        return () => clearInterval(interval);
    }, [socket, fps]);

    // Boucle de rendu lancée une seule fois
    useEffect(() => {
        let animationFrameId;
        const renderLoop = () => {
            drawBodies();
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const drawBodies = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Utiliser les données les plus récentes depuis bodiesRef
        bodiesRef.current.forEach((body) => {
            const drawX = CENTER + body.x - 250;
            const drawY = CENTER - (body.y - 250);

            ctx.beginPath();
            ctx.arc(drawX, drawY, Math.sqrt(body.mass) * 2, 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
        });
    };

    const sendMessage = () => {
        if (!socket) {
            alert("Veuillez vous connecter au serveur");
            return;
        }
        console.log("Envoi de message :", message);
        socket.send(message);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 style={{ color: "white" }}>N-Body Simulation</h1>
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                style={{ background: "black" }}
            ></canvas>
            <div style={{ marginTop: "10px" }}>
                <button onClick={() => setFps((prev) => Math.max(1, prev - 5))}>
                    - FPS
                </button>
                <span style={{ color: "white", margin: "0 15px" }}>FPS: {fps}</span>
                <button onClick={() => setFps((prev) => prev + 5)}>+ FPS</button>
            </div>
            <div>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Envoyer</button>
            </div>
        </div>
    );
};

export default NBodySimulation;
