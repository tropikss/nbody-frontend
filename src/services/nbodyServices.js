import axios from "axios";

const API_URL = "http://localhost:8080/nbody/compute";

export const getBodies = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des corps :", error);
        return [];
    }
};
