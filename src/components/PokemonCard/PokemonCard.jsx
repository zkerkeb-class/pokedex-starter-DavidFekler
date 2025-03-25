import { useState } from 'react';
import { deletePokemon as apiDeletePokemon } from '../../services/api.js';
import { pokemonImages } from '../../assets/imageLibrary.js';
import axios from 'axios';

function PokemonCard({ pokemon, onDelete, isDeleting }) {
    const [error, setError] = useState(null);

    // Fonction pour supprimer un Pokémon via l'API
    const handleDelete = async () => {
        try {
            // Envoi de la requête DELETE en utilisant la fonction API existante
            await apiDeletePokemon(pokemon.id);
            
            // Mettre à jour l'état du parent (supprimer le Pokémon localement sans rafraîchissement)
            onDelete(pokemon.id);
            alert('Pokémon supprimé avec succès!');
            
            // Réinitialiser les états
            setError(null);
        } catch (error) {
            console.error("Erreur lors de la suppression du Pokémon :", error);
            setError('Erreur lors de la suppression. Veuillez réessayer.');
        }
    };

    return (
        <div className="pokemon-card">
            {/* Affichage de l'erreur si elle existe */}
            {error && <div className="error-message">{error}</div>}

            <h2 className="text-xl font-bold">{pokemon.name.french}</h2>
            <p><strong>Type:</strong> {pokemon.type?.join(", ")}</p>
            <img src={pokemonImages[pokemon.id]} alt={pokemon.name.french} />
            <h3 className="mt-2">Statistiques :</h3>
            <ul>
                {Object.entries(pokemon.base).map(([stat, value]) => (
                    <li key={stat}>
                        <strong>{stat}:</strong> {value}
                    </li>
                ))}
            </ul>

            <button
                onClick={handleDelete}
                className="delete-button"
                disabled={isDeleting}
            >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
        </div>
    );
}

export default PokemonCard;
