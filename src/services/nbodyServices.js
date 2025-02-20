import NBodySimulation from "../components/NBodySimulation";

const API_URL = "http://localhost:8080/ws";


export const getBodies = async () => {
    try {
        const nBody = NBodySimulation.sendMessage(API_URL);
        return nBody;
    } catch (error) {
        console.error("Erreur lors de la récupération des corps :", error);
        return [];
    }
};
