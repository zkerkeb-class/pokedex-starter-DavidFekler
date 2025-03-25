import './App.css';
import { useState, useEffect } from "react";
import { getPokemons } from "./services/api.js";
import PokemonList from "./components/PokemonList/PokemonList";
import AddPokemonForm from "./components/AddPokemonForm/AddPokemonForm";

function App() {
    const [pokemons, setPokemons] = useState([]);
    const [currentView, setCurrentView] = useState('list'); // 'list' ou 'add'
    
    useEffect(() => {
        getPokemons().then(data => setPokemons(data.pokemons));
    }, []);

    // Fonction pour supprimer un pokémon du state
    const handleDeletePokemon = (id) => {
        setPokemons(prevPokemons => prevPokemons.filter(pokemon => pokemon.id !== id));
    };

    // Fonction pour ajouter un pokémon au state
    const handleAddPokemon = (newPokemon) => {
        setPokemons(prevPokemons => [...prevPokemons, newPokemon]);
        setCurrentView('list'); // Retourne à la liste après l'ajout
    };

    // Fonction pour naviguer entre les vues
    const navigateTo = (view) => {
        setCurrentView(view);
    };

    return (
        <div className="app-container">
            <nav className="navbar">
                <h1>Pokédex</h1>
                <div className="nav-links">
                    <button 
                        onClick={() => navigateTo('list')} 
                        className={`nav-link ${currentView === 'list' ? 'active' : ''}`}
                    >
                        Liste des Pokémons
                    </button>
                    <button 
                        onClick={() => navigateTo('add')} 
                        className={`nav-link ${currentView === 'add' ? 'active' : ''}`}
                    >
                        Ajouter un Pokémon
                    </button>
                </div>
            </nav>

            {currentView === 'list' ? (
                <PokemonList 
                    pokemons={pokemons} 
                    deletePokemon={handleDeletePokemon} 
                />
            ) : (
                <AddPokemonForm 
                    addPokemon={handleAddPokemon}
                    navigateToList={() => navigateTo('list')}
                />
            )}
        </div>
    );
}

export default App;
