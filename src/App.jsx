import './App.css';
import { useState, useEffect } from "react";
import { getPokemons, deletePokemon, addPokemon, updatePokemon } from "./services/api.js";
import PokemonList from "./components/PokemonList/PokemonList";
import AddPokemonForm from "./components/AddPokemonForm/AddPokemonForm";
import RegisterForm from "./components/Auth/RegisterForm";
import LoginForm from "./components/Auth/LoginForm";
import { checkApiConnection } from "./debug.js";
import SecretGame from "./components/SecretGame/SecretGame";

function App() {
    const [pokemons, setPokemons] = useState([]);
    const [currentView, setCurrentView] = useState('list');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchPokemons();
        
        // Exécuter le diagnostic lors du chargement de l'application
        checkApiConnection().then(result => {
            if (!result.success) {
                console.error('Problème de connexion à l\'API. Veuillez vérifier que le serveur backend est en cours d\'exécution sur le port 3000.');
            }
        });
    }, []);

    const fetchPokemons = async () => {
        try {
            setLoading(true);
            const data = await getPokemons();
            console.log('Données reçues dans App.jsx:', data);
            setPokemons(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des pokémons');
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour supprimer un pokémon
    const handleDelete = async (id) => {
        try {
            if (!id) {
                console.error("ID manquant pour la suppression");
                return;
            }
            await deletePokemon(id);
            // Mettre à jour l'état local
            setPokemons(pokemons.filter(pokemon => pokemon.id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
        }
    };

    // Fonction pour ajouter un nouveau pokémon
    const handleAdd = async (pokemonData) => {
        try {
            const newPokemon = await addPokemon(pokemonData);
            // Mettre à jour l'état local
            setPokemons([...pokemons, newPokemon]);
            return newPokemon;
        } catch (err) {
            console.error('Erreur lors de l\'ajout:', err);
            throw err;
        }
    };

    // Fonction pour mettre à jour un pokémon
    const handleUpdate = async (id, updatedData) => {
        try {
            // S'assurer que l'ID est un nombre
            const numericId = parseInt(id);
            console.log(`Tentative de mise à jour du Pokémon avec ID: ${numericId}`);
            
            const updatedPokemon = await updatePokemon(numericId, updatedData);
            console.log('Pokémon mis à jour depuis App.jsx:', updatedPokemon);
            
            // Mise à jour locale immédiate avant le rechargement complet
            setPokemons(prev => prev.map(pokemon => {
                if (pokemon.id === numericId) {
                    console.log('Mise à jour locale du Pokémon:', updatedPokemon);
                    return updatedPokemon;
                }
                return pokemon;
            }));
            
            // Rafraîchir la liste complète pour obtenir les données correctes du serveur
            setTimeout(() => {
                fetchPokemons();
            }, 300);
            
            alert('Pokémon mis à jour avec succès');
        } catch (err) {
            alert('Erreur lors de la mise à jour du pokémon');
            console.error('Erreur:', err);
        }
    };

    // Fonction pour naviguer entre les vues
    const navigateTo = (view) => {
        setCurrentView(view);
    };

    if (loading && currentView === 'list') return <div className="loading-container">Chargement...</div>;
    if (error && currentView === 'list') return <div className="error-container">Erreur: {error}</div>;

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
                    <button 
                        onClick={() => navigateTo('game')} 
                        className={`nav-link ${currentView === 'game' ? 'active' : ''}`}
                    >
                        Jeu Secret
                    </button>
                    <button 
                        onClick={() => navigateTo('login')} 
                        className={`nav-link ${currentView === 'login' ? 'active' : ''}`}
                    >
                        Connexion
                    </button>
                    <button 
                        onClick={() => navigateTo('register')} 
                        className={`nav-link ${currentView === 'register' ? 'active' : ''}`}
                    >
                        S'inscrire
                    </button>
                </div>
            </nav>

            {currentView === 'list' ? (
                <PokemonList 
                    pokemons={pokemons} 
                    deletePokemon={handleDelete}
                    addPokemon={handleAdd}
                    updatePokemon={handleUpdate}
                />
            ) : currentView === 'add' ? (
                <AddPokemonForm 
                    addPokemon={handleAdd}
                    navigateToList={() => navigateTo('list')}
                />
            ) : currentView === 'game' ? (
                <SecretGame 
                    pokemons={pokemons}
                />
            ) : currentView === 'register' ? (
                <RegisterForm 
                    navigateTo={navigateTo}
                />
            ) : currentView === 'login' ? (
                <LoginForm 
                    navigateTo={navigateTo}
                />
            ) : null}
        </div>
    );
}

export default App;
