import React from "react";
import NBodySimulation from "./components/NBodySimulation";

const App = () => {
    return (
        <div>
            <h1 style={{ textAlign: "center", color: "white" }}>Simulation N-Body</h1>
            <NBodySimulation />
        </div>
    );
};

export default App;
