import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/pokemons",
});

//get method
export const getPokemons = async () => {
    const response = await api.get("/");
    return response.data;
};

// Méthode pour supprimer un pokémon
export const deletePokemon = async (pokemonId) => {
    try {
        // Utilisation de l'instance api pour la requête DELETE
        const response = await api.delete(`/${pokemonId}`);
        return response.data;
    } catch (error) {
        // Propager l'erreur pour la gérer dans le composant
        throw error;
    }
};

// Méthode pour ajouter un nouveau pokémon
export const addPokemon = async (pokemonData) => {
    try {
        const response = await api.post("/", pokemonData);
        return response.data;
    } catch (error) {
        throw error;
    }
};