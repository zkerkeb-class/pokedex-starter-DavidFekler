import { useState } from 'react';
import PokemonCard from '../PokemonCard/PokemonCard';

function PokemonList({ pokemons, deletePokemon }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.french.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeletePokemon = async (id) => {
        setIsDeleting(true);
        try {
            await deletePokemon(id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="pokemon-list-container">
            <h1>Liste des Pokémons</h1>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher un Pokémon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="pokemon-container">
                {filteredPokemons.length > 0 ? (
                    filteredPokemons.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            onDelete={handleDeletePokemon}
                            isDeleting={isDeleting}
                        />
                    ))
                ) : (
                    <p className="no-results">Aucun Pokémon trouvé</p>
                )}
            </div>
        </div>
    );
}

export default PokemonList; 