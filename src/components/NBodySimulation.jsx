import { useEffect, useState, useRef } from "react";

const CANVAS_SIZE = 500;
const CENTER = CANVAS_SIZE / 2;

const NBodySimulation = () => {
    const [bodies, setBodies] = useState([]);
    const [fps, setFps] = useState(30); // Default FPS
    const canvasRef = useRef(null);
    const socketRef = useRef(null);

    const sendMessage = (message) => {
        if (socketRef.current) {
            socketRef.current.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        // Initialize WebSocket connection
        socketRef.current = new WebSocket("ws://localhost:8080/nbody/ws");

        // When receiving data, update state
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setBodies(data);
        };

        // Cleanup WebSocket on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        const renderLoop = () => {
            drawBodies();
            setTimeout(renderLoop, 1000 / fps);
        };
        renderLoop();
    }, [bodies, fps]);

    const drawBodies = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bodies.forEach((body) => {
            const drawX = CENTER + body.x - 250;
            const drawY = CENTER - (body.y - 250);

            ctx.beginPath();
            ctx.arc(drawX, drawY, Math.sqrt(body.mass) * 2, 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 style={{ color: "white" }}>N-Body Simulation</h1>
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} style={{ background: "black" }}></canvas>
            <div style={{ marginTop: "10px" }}>
                <button onClick={() => setFps((prev) => Math.max(1, prev - 5))}>- FPS</button>
                <span style={{ color: "white", margin: "0 15px" }}>FPS: {fps}</span>
                <button onClick={() => setFps((prev) => prev + 5)}>+ FPS</button>
            </div>
        </div>
    );
};

export default NBodySimulation;
