import { useState } from 'react';
import { addPokemon } from '../../services/api.js';

function AddPokemonForm({ addPokemon: addPokemonToState, navigateToList }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [pokemonData, setPokemonData] = useState({
        name: {
            french: '',
            english: '',
            japanese: '',
            chinese: ''
        },
        type: [],
        base: {
            HP: 0,
            Attack: 0,
            Defense: 0,
            "Sp. Attack": 0,
            "Sp. Defense": 0,
            Speed: 0
        }
    });

    const pokemonTypes = [
        "Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", "Steel",
        "Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon", "Dark", "Fairy"
    ];

    const handleNameChange = (e, language) => {
        setPokemonData({
            ...pokemonData,
            name: {
                ...pokemonData.name,
                [language]: e.target.value
            }
        });
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        if (e.target.checked) {
            setPokemonData({
                ...pokemonData,
                type: [...pokemonData.type, type]
            });
        } else {
            setPokemonData({
                ...pokemonData,
                type: pokemonData.type.filter(t => t !== type)
            });
        }
    };

    const handleStatChange = (e, stat) => {
        setPokemonData({
            ...pokemonData,
            base: {
                ...pokemonData.base,
                [stat]: parseInt(e.target.value) || 0
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Validation des données
            if (!pokemonData.name.french) {
                throw new Error('Le nom français est obligatoire');
            }
            if (pokemonData.type.length === 0) {
                throw new Error('Vous devez sélectionner au moins un type');
            }

            // Génération d'un ID temporaire (à remplacer par la réponse de l'API)
            const newPokemon = {
                ...pokemonData
            };

            // Appel à l'API pour ajouter le Pokémon
            const response = await addPokemon(newPokemon);
            
            // Mise à jour de l'état local
            addPokemonToState(response.pokemon);
            
            // Redirection vers la liste des Pokémons
            alert('Pokémon ajouté avec succès !');
            navigateToList();
        } catch (error) {
            console.error("Erreur lors de l'ajout du Pokémon :", error);
            setError(error.message || "Une erreur est survenue lors de l'ajout du Pokémon");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-pokemon-form">
            <h1>Ajouter un nouveau Pokémon</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Noms</h2>
                    <div className="form-group">
                        <label htmlFor="french-name">Nom (Français) *</label>
                        <input
                            id="french-name"
                            type="text"
                            value={pokemonData.name.french}
                            onChange={(e) => handleNameChange(e, 'french')}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="english-name">Nom (Anglais)</label>
                        <input
                            id="english-name"
                            type="text"
                            value={pokemonData.name.english}
                            onChange={(e) => handleNameChange(e, 'english')}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="japanese-name">Nom (Japonais)</label>
                        <input
                            id="japanese-name"
                            type="text"
                            value={pokemonData.name.japanese}
                            onChange={(e) => handleNameChange(e, 'japanese')}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="chinese-name">Nom (Chinois)</label>
                        <input
                            id="chinese-name"
                            type="text"
                            value={pokemonData.name.chinese}
                            onChange={(e) => handleNameChange(e, 'chinese')}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h2>Types *</h2>
                    <div className="types-container">
                        {pokemonTypes.map(type => (
                            <div key={type} className="type-checkbox">
                                <input
                                    type="checkbox"
                                    id={`type-${type}`}
                                    value={type}
                                    checked={pokemonData.type.includes(type)}
                                    onChange={handleTypeChange}
                                />
                                <label htmlFor={`type-${type}`}>{type}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h2>Statistiques</h2>
                    {Object.keys(pokemonData.base).map(stat => (
                        <div key={stat} className="form-group">
                            <label htmlFor={`stat-${stat}`}>{stat}</label>
                            <input
                                id={`stat-${stat}`}
                                type="number"
                                min="0"
                                max="255"
                                value={pokemonData.base[stat]}
                                onChange={(e) => handleStatChange(e, stat)}
                            />
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={navigateToList}
                        className="cancel-button"
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Ajout en cours...' : 'Ajouter le Pokémon'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddPokemonForm; 