import React, { useEffect, useState, useRef } from "react";
import { getBodies } from "../services/nbodyServices";

const NBodySimulation = () => {
    const [bodies, setBodies] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchBodies = async () => {
            const data = await getBodies();
            setBodies(data);
        };

        fetchBodies();
        const interval = setInterval(fetchBodies, 1000 / 60);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        drawBodies();
    }, [bodies]);

    const drawBodies = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        bodies.forEach((body) => {
            ctx.beginPath();
            ctx.arc(body.x, body.y, Math.sqrt(body.mass) * 2, 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <canvas ref={canvasRef} width={800} height={600} style={{ background: "black" }}></canvas>
        </div>
    );
};

export default NBodySimulation;
