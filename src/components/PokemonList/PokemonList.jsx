import React, { useState } from 'react';
import './PokemonList.css';
import { getTypeIcon } from '../../assets/typeIcons';

const PokemonList = ({ pokemons, deletePokemon, addPokemon, updatePokemon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPokemon, setEditingPokemon] = useState(null);
  const [newPokemon, setNewPokemon] = useState({
    name: { french: '', english: '', japanese: '' },
    type: [''],
    image: '',
    base: {
      HP: 0,
      Attack: 0,
      Defense: 0,
      Speed: 0,
      "Sp. Attack": 0,
      "Sp. Defense": 0
    }
  });

  if (!pokemons || pokemons.length === 0) {
    return <div className="no-pokemons">Aucun Pokémon trouvé</div>;
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pokémon ?')) {
      try {
        console.log('Tentative de suppression du Pokémon avec ID:', id);
        if (!id) {
          console.error('ID manquant pour la suppression du Pokémon');
          alert('Erreur: ID du Pokémon manquant');
          return;
        }
        await deletePokemon(id);
        // Informer l'utilisateur que la suppression a réussi
        alert('Pokémon supprimé avec succès!');
        // Vous pourriez vouloir rafraîchir la liste ou utiliser une technique plus élégante
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du Pokémon');
      }
    }
  };

  // Fonction pour commencer l'édition d'un Pokémon
  const handleEdit = (pokemon) => {
    // Copier le Pokémon à éditer
    setEditingPokemon({
      id: pokemon.id,
      name: { ...pokemon.name },
      type: [...pokemon.type],
      image: pokemon.image || '',
      base: { ...pokemon.base }
    });
  };

  // Fonction pour annuler l'édition
  const cancelEdit = () => {
    setEditingPokemon(null);
  };

  // Fonction pour sauvegarder les modifications
  const saveEdit = async () => {
    try {
      // Vérification du nom
      if (!editingPokemon.name.french || editingPokemon.name.french.trim() === '') {
        alert('Le nom du Pokémon est obligatoire');
        return;
      }
      
      // Vérification du type
      if (!editingPokemon.type[0] || editingPokemon.type[0].trim() === '') {
        alert('Le type du Pokémon est obligatoire');
        return;
      }
      
      if (updatePokemon) {
        // S'assurer que toutes les statistiques sont des nombres
        const editedPokemon = {
          ...editingPokemon,
          base: {
            HP: parseInt(editingPokemon.base.HP) || 50,
            Attack: parseInt(editingPokemon.base.Attack) || 50,
            Defense: parseInt(editingPokemon.base.Defense) || 50,
            Speed: parseInt(editingPokemon.base.Speed) || 50,
            "Sp. Attack": parseInt(editingPokemon.base["Sp. Attack"]) || 50,
            "Sp. Defense": parseInt(editingPokemon.base["Sp. Defense"]) || 50
          }
        };
        
        console.log("Envoi des modifications:", editedPokemon);
        
        // Afficher un message de chargement
        const originalText = document.querySelector('.save-button').textContent;
        document.querySelector('.save-button').textContent = 'Sauvegarde...';
        document.querySelector('.save-button').disabled = true;
        
        try {
          // Attendre que la mise à jour soit terminée
          await updatePokemon(editingPokemon.id, editedPokemon);
          
          // Fermer le formulaire d'édition seulement après la mise à jour réussie
          setTimeout(() => {
            setEditingPokemon(null);
          }, 500); // Petit délai pour s'assurer que les données sont bien rafraîchies
        } catch (error) {
          console.error('Erreur lors de la mise à jour:', error);
          alert('Erreur lors de la mise à jour du Pokémon');
        } finally {
          // Restaurer le texte du bouton
          if (document.querySelector('.save-button')) {
            document.querySelector('.save-button').textContent = originalText;
            document.querySelector('.save-button').disabled = false;
          }
        }
      } else {
        console.error('La fonction updatePokemon n\'est pas disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du Pokémon');
    }
  };

  // Fonction pour mettre à jour les valeurs du Pokémon en cours d'édition
  const handleEditChange = (field, value, subfield = null) => {
    if (subfield) {
      // Traitement spécial pour les statistiques (champs numériques)
      if (field === 'base') {
        // S'assurer que la valeur est un nombre
        const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
        setEditingPokemon(prev => ({
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: numericValue
          }
        }));
      } else {
        // Autres champs avec sous-propriétés (comme le nom)
        setEditingPokemon(prev => ({
          ...prev,
          [field]: {
            ...prev[field],
            [subfield]: value
          }
        }));
      }
    } else if (field === 'type') {
      // Mettre à jour le type (toujours sous forme de tableau)
      setEditingPokemon(prev => ({
        ...prev,
        [field]: [value]
      }));
    } else {
      // Mise à jour simple d'un champ
      setEditingPokemon(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Fonction pour obtenir le nom du Pokémon dans la langue préférée
  const getPokemonName = (nameObj) => {
    if (typeof nameObj === 'string') return nameObj;
    if (!nameObj) return 'Pokémon inconnu';
    
    // Priorité des langues : français, anglais, japonais
    return nameObj.french || nameObj.english || nameObj.japanese || 'Pokémon inconnu';
  };

  // Fonction pour générer une clé unique pour chaque Pokémon
  const generatePokemonKey = (pokemon) => {
    // Utiliser d'abord l'ID numérique qui est le plus fiable
    if (pokemon.id) {
      return pokemon.id;
    }
    // Fallback sur _id MongoDB si disponible
    if (pokemon._id) {
      return pokemon._id;
    }
    // Dernier recours: utiliser le nom
    const name = getPokemonName(pokemon.name);
    console.warn(`Pokemon sans ID trouvé: ${name}. Utilisation d'un ID temporaire.`);
    return `${name}-${Math.random()}`;
  };

  // Fonction pour afficher les badges de type avec icônes
  const renderTypesBadges = (pokemon, pokemonKey) => {
    // Vérifier si le type existe et est un tableau
    if (!pokemon.type || !Array.isArray(pokemon.type) || pokemon.type.length === 0) {
      return null;
    }

    return (
      <div className="pokemon-types">
        {pokemon.type.map((type, index) => {
          if (!type) return null;
          
          const typeIcon = getTypeIcon(type);
          
          return (
            <div 
              key={`${pokemonKey}-type-${index}`} 
              className={`type-badge ${type.toLowerCase()}`}
              title={type}
            >
              {typeIcon && <img src={typeIcon} alt={type} className="type-icon" />}
            </div>
          );
        })}
      </div>
    );
  };

  // Filtrer les Pokémon en fonction du terme de recherche
  const filteredPokemons = pokemons.filter(pokemon => 
    getPokemonName(pokemon.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewPokemon({
      name: { french: '', english: '', japanese: '' },
      type: [''],
      image: '',
      base: {
        HP: 0,
        Attack: 0,
        Defense: 0,
        Speed: 0,
        "Sp. Attack": 0,
        "Sp. Defense": 0
      }
    });
    setShowAddForm(false);
  };

  // Gérer les changements dans le formulaire d'ajout
  const handleInputChange = (e, field, subfield = null) => {
    const value = e.target.type === 'number' ? 
      parseInt(e.target.value, 10) || 0 : e.target.value;
      
    if (subfield) {
      setNewPokemon(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }));
    } else {
      setNewPokemon(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Gérer l'ajout d'un nouveau Pokémon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // S'assurer que les valeurs sont toutes converties en nombres
      const hp = parseInt(newPokemon.base.HP) || 50;
      const attack = parseInt(newPokemon.base.Attack) || 50;
      const defense = parseInt(newPokemon.base.Defense) || 50;
      const speed = parseInt(newPokemon.base.Speed) || 50;
      
      // Créer un Pokémon avec valeurs par défaut pour les champs optionnels
      const pokemonToAdd = {
        ...newPokemon,
        image: newPokemon.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png',
        base: {
          HP: hp,
          Attack: attack,
          Defense: defense,
          Speed: speed,
          "Sp. Attack": 50,
          "Sp. Defense": 50
        }
      };
      
      console.log('Envoi des données de Pokémon:', pokemonToAdd);
      
      // Appeler la fonction addPokemon pour ajouter le Pokémon à la base de données
      if (addPokemon) {
        const addedPokemon = await addPokemon(pokemonToAdd);
        console.log('Pokémon ajouté avec succès:', addedPokemon);
        alert('Pokémon ajouté avec succès!');
        
        // Réinitialiser le formulaire et fermer
        resetForm();
      } else {
        console.error('La fonction addPokemon n\'est pas disponible');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Erreur lors de l\'ajout du Pokémon');
    }
  };

  return (
    <div className="pokemon-container">
      <div className="pokemon-controls">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-button"
        >
          {showAddForm ? 'Annuler' : 'Ajouter un Pokémon'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-pokemon-form">
          <h3>Ajouter un nouveau Pokémon</h3>
          
          <div className="form-group">
            <label>Nom (Français):</label>
            <input
              type="text"
              value={newPokemon.name.french}
              onChange={(e) => handleInputChange(e, 'name', 'french')}
              required
              placeholder="Nom en français"
            />
          </div>
          
          <div className="form-group">
            <label>Type:</label>
            <input
              type="text"
              value={newPokemon.type[0]}
              onChange={(e) => setNewPokemon(prev => ({
                ...prev,
                type: [e.target.value]
              }))}
              required
              placeholder="Type principal (ex: Feu, Eau, Plante...)"
            />
          </div>
          
          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="url"
              value={newPokemon.image}
              onChange={(e) => handleInputChange(e, 'image')}
              placeholder="URL de l'image du Pokémon"
            />
            <small>Laissez vide pour utiliser une image par défaut</small>
          </div>
          
          <div className="form-group full-width">
            <h4>Statistiques</h4>
            <div className="stats-container">
            <div className="stats-grid">
              <div>
                <label>PV:</label>
                <input
                  type="number"
                    value={newPokemon.base.HP}
                    onChange={(e) => handleInputChange(e, 'base', 'HP')}
                    min="0"
                    max="255"
                />
              </div>
              <div>
                <label>Attaque:</label>
                <input
                  type="number"
                    value={newPokemon.base.Attack}
                    onChange={(e) => handleInputChange(e, 'base', 'Attack')}
                    min="0"
                    max="255"
                />
              </div>
              <div>
                <label>Défense:</label>
                <input
                  type="number"
                    value={newPokemon.base.Defense}
                    onChange={(e) => handleInputChange(e, 'base', 'Defense')}
                    min="0"
                    max="255"
                />
              </div>
              <div>
                <label>Vitesse:</label>
                <input
                  type="number"
                    value={newPokemon.base.Speed}
                    onChange={(e) => handleInputChange(e, 'base', 'Speed')}
                    min="0"
                    max="255"
                  />
                </div>
                <div>
                  <label>Att. Spé:</label>
                  <input
                    type="number"
                    value={newPokemon.base["Sp. Attack"] || 0}
                    onChange={(e) => handleInputChange(e, 'base', 'Sp. Attack')}
                    min="0"
                    max="255"
                  />
                </div>
                <div>
                  <label>Déf. Spé:</label>
                  <input
                    type="number"
                    value={newPokemon.base["Sp. Defense"] || 0}
                    onChange={(e) => handleInputChange(e, 'base', 'Sp. Defense')}
                    min="0"
                    max="255"
                  />
                </div>
              </div>
              <small>Des valeurs par défaut (50) seront utilisées si non spécifiées</small>
            </div>
          </div>
          
          <button type="submit" className="submit-button">Ajouter le Pokémon</button>
        </form>
      )}

      <div className="pokemon-list">
        {filteredPokemons.map(pokemon => {
          const pokemonKey = generatePokemonKey(pokemon);
          
          // Si ce Pokémon est en cours d'édition, afficher le formulaire d'édition
          if (editingPokemon && editingPokemon.id === pokemon.id) {
            return (
              <div key={pokemonKey} className="pokemon-card editing">
                <h3>Modifier {getPokemonName(pokemon.name)}</h3>
                <div className="edit-form">
                  <div className="form-group">
                    <label>Nom (Français):</label>
                    <input
                      type="text"
                      value={editingPokemon.name.french || ''}
                      onChange={(e) => handleEditChange('name', e.target.value, 'french')}
                      placeholder="Nom en français"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      value={editingPokemon.type[0] || ''}
                      onChange={(e) => handleEditChange('type', [e.target.value])}
                      className="type-select"
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="Normal">Normal</option>
                      <option value="Fire">Feu</option>
                      <option value="Water">Eau</option>
                      <option value="Electric">Électrique</option>
                      <option value="Grass">Plante</option>
                      <option value="Ice">Glace</option>
                      <option value="Fighting">Combat</option>
                      <option value="Poison">Poison</option>
                      <option value="Ground">Sol</option>
                      <option value="Flying">Vol</option>
                      <option value="Psychic">Psy</option>
                      <option value="Bug">Insecte</option>
                      <option value="Rock">Roche</option>
                      <option value="Ghost">Spectre</option>
                      <option value="Dragon">Dragon</option>
                      <option value="Dark">Ténèbres</option>
                      <option value="Steel">Acier</option>
                      <option value="Fairy">Fée</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Image URL:</label>
                    <input
                      type="url"
                      value={editingPokemon.image || ''}
                      onChange={(e) => handleEditChange('image', e.target.value)}
                      placeholder="URL de l'image du Pokémon"
                    />
                  </div>
                  
                  {editingPokemon.image && (
                    <div className="image-preview">
                      <img 
                        src={editingPokemon.image} 
                        alt="Aperçu" 
                        className="preview-image"
                      />
                    </div>
                  )}
                  
                  <div className="form-group full-width">
                    <h4>Statistiques</h4>
                    <div className="stats-container">
                      <div className="stats-grid">
                        <div>
                          <label>PV:</label>
                          <input
                            type="number"
                            value={editingPokemon.base.HP || 0}
                            onChange={(e) => handleEditChange('base', parseInt(e.target.value) || 0, 'HP')}
                            min="0"
                            max="255"
                          />
                        </div>
                        <div>
                          <label>Attaque:</label>
                          <input
                            type="number"
                            value={editingPokemon.base.Attack || 0}
                            onChange={(e) => handleEditChange('base', parseInt(e.target.value) || 0, 'Attack')}
                            min="0"
                            max="255"
                          />
                        </div>
                        <div>
                          <label>Défense:</label>
                          <input
                            type="number"
                            value={editingPokemon.base.Defense || 0}
                            onChange={(e) => handleEditChange('base', parseInt(e.target.value) || 0, 'Defense')}
                            min="0"
                            max="255"
                          />
                        </div>
                        <div>
                          <label>Vitesse:</label>
                          <input
                            type="number"
                            value={editingPokemon.base.Speed || 0}
                            onChange={(e) => handleEditChange('base', parseInt(e.target.value) || 0, 'Speed')}
                            min="0"
                            max="255"
                          />
                        </div>
                        <div>
                          <label>Att. Spé:</label>
                          <input
                            type="number"
                            value={editingPokemon.base["Sp. Attack"] || 0}
                            onChange={(e) => handleEditChange('base', parseInt(e.target.value) || 0, 'Sp. Attack')}
                            min="0"
                            max="255"
                          />
                        </div>
                        <div>
                          <label>Déf. Spé:</label>
                          <input
                            type="number"
                            value={editingPokemon.base["Sp. Defense"] || 0}
                            onChange={(e) => handleEditChange('base', parseInt(e.target.value) || 0, 'Sp. Defense')}
                            min="0"
                            max="255"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="edit-actions">
                    <button onClick={cancelEdit} className="cancel-edit-button">
                      Annuler
                    </button>
                    <button onClick={saveEdit} className="save-button">
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            );
          }
          
          // Affichage normal du Pokémon
          return (
            <div key={pokemonKey} className="pokemon-card">
              <div className="pokemon-card-header">
                <span className="pokemon-id">#{String(pokemon.id || 0).padStart(3, '0')}</span>
              </div>
              <img 
                src={pokemon.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png'} 
                alt={getPokemonName(pokemon.name)} 
                className="pokemon-image"
              />
              <div className="pokemon-info">
                <h3 title={getPokemonName(pokemon.name)}>{getPokemonName(pokemon.name)}</h3>
                {renderTypesBadges(pokemon, pokemonKey)}
                
                {pokemon.base && (
                  <div className="pokemon-detailed-stats">
                    {pokemon.base.HP && <p>PV: {pokemon.base.HP}</p>}
                    {pokemon.base.Attack && <p>ATK: {pokemon.base.Attack}</p>}
                    {pokemon.base.Defense && <p>DEF: {pokemon.base.Defense}</p>}
                    {pokemon.base.Speed && <p>VIT: {pokemon.base.Speed}</p>}
                    {pokemon.base["Sp. Attack"] && <p>SP.A: {pokemon.base["Sp. Attack"]}</p>}
                    {pokemon.base["Sp. Defense"] && <p>SP.D: {pokemon.base["Sp. Defense"]}</p>}
                  </div>
                )}

              <div className="pokemon-actions">
                <button 
                    onClick={() => handleEdit(pokemon)}
                    className="edit-button"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => {
                      console.log("Suppression du Pokémon:", pokemon);
                      handleDelete(pokemon.id);
                    }}
                  className="delete-button"
                >
                  Supprimer
                </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonList; 