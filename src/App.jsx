import React from "react";
import NBodySimulation from "./components/NBodySimulation";
import {WebSocketProvider} from "./components/WebSocketProvider.jsx";

const App = () => {
    return (
        <div>
            <h1 style={{ textAlign: "center", color: "white" }}>Simulation N-Body</h1>
            <WebSocketProvider>
                <NBodySimulation />
            </WebSocketProvider>
        </div>
    );
};

export default App;
