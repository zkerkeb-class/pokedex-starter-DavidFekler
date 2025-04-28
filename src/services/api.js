import axios from 'axios';

// Configuration de l'API
const API_URL = 'http://localhost:3000/api';

// Récupérer tous les pokémons
export const getPokemons = async () => {
  try {
    const response = await axios.get(`${API_URL}/pokemons`);
    console.log('Réponse API:', response.data);
    
    // Si la réponse est un tableau direct
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si la réponse est un objet avec une propriété pokemons
    if (response.data.pokemons) {
      return response.data.pokemons;
    }
    
    // Si la réponse a une autre structure
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des pokémons:', error);
    if (error.response) {
      console.error('Données de réponse:', error.response.data);
      console.error('Status:', error.response.status);
    }
    throw error;
  }
};

// Ajouter un pokémon
export const addPokemon = async (pokemonData) => {
  try {
    // Générer un ID pour le nouveau Pokémon
    const allPokemons = await getPokemons();
    const maxId = Math.max(...allPokemons.map(p => p.id || 0), 0);
    
    // S'assurer que toutes les propriétés nécessaires sont présentes
    const newPokemon = {
      ...pokemonData,
      id: maxId + 1,
      // Garantir que base contient toutes les statistiques nécessaires
      base: {
        HP: parseInt(pokemonData.base?.HP) || 50,
        Attack: parseInt(pokemonData.base?.Attack) || 50,
        Defense: parseInt(pokemonData.base?.Defense) || 50,
        Speed: parseInt(pokemonData.base?.Speed) || 50,
        "Sp. Attack": parseInt(pokemonData.base?.["Sp. Attack"]) || 50,
        "Sp. Defense": parseInt(pokemonData.base?.["Sp. Defense"]) || 50
      }
    };
    
    console.log('Structure complète du Pokémon à ajouter:', newPokemon);
    const response = await axios.post(`${API_URL}/pokemons`, newPokemon);
    console.log('Réponse du serveur après ajout:', response.data);
    return response.data.pokemon || response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du pokémon:', error);
    throw error;
  }
};

// Supprimer un pokémon
export const deletePokemon = async (id) => {
  try {
    console.log(`API: Tentative de suppression du Pokémon avec ID: ${id}`);
    
    if (!id) {
      console.error('API: ID manquant pour la suppression du Pokémon');
      throw new Error('ID manquant pour la suppression');
    }
    
    // Assurer que l'ID est au bon format pour l'API
    const formattedId = typeof id === 'string' && id.match(/^[0-9]+$/) ? parseInt(id) : id;
    
    console.log(`API: Envoi de la requête DELETE pour l'ID formaté: ${formattedId}`);
    const response = await axios.delete(`${API_URL}/pokemons/${formattedId}`);
    
    console.log('API: Pokémon supprimé avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du pokémon:', error);
    throw error;
  }
};

// Mettre à jour un pokémon
export const updatePokemon = async (id, pokemonData) => {
  try {
    // S'assurer que toutes les propriétés nécessaires sont présentes
    const updatedPokemon = {
      ...pokemonData,
      // S'assurer que l'ID est conservé
      id: id,
      // Garantir que les statistiques sont conservées
      base: {
        HP: parseInt(pokemonData.base?.HP) || 50,
        Attack: parseInt(pokemonData.base?.Attack) || 50,
        Defense: parseInt(pokemonData.base?.Defense) || 50,
        Speed: parseInt(pokemonData.base?.Speed) || 50,
        "Sp. Attack": parseInt(pokemonData.base?.["Sp. Attack"]) || 50,
        "Sp. Defense": parseInt(pokemonData.base?.["Sp. Defense"]) || 50
      }
    };
    
    console.log(`Mise à jour du Pokémon ID ${id}:`, updatedPokemon);
    const response = await axios.put(`${API_URL}/pokemons/${id}`, updatedPokemon);
    console.log('Réponse de mise à jour:', response.data);
    return response.data.pokemon || response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du pokémon:', error);
    throw error;
  }
};

// Récupérer les statistiques des pokémons
export const getPokemonStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/pokemons/stats`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};