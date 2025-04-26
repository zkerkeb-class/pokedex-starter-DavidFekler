import React, { useState } from 'react';
import './AddPokemonForm.css';
import { getTypeIcon } from '../../assets/typeIcons';

const AddPokemonForm = ({ addPokemon, navigateToList }) => {
  const [newPokemon, setNewPokemon] = useState({
    name: {
      french: '',
      english: '',
      japanese: ''
    },
    types: [''],
    image: '',
    stats: {
      hp: 0,
      attack: 0,
      defense: 0,
      speed: 0
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convertir les types en format attendu par l'API
      const formattedPokemon = {
        ...newPokemon,
        type: newPokemon.types, // Renommer types en type pour l'API
        base: {
          HP: parseInt(newPokemon.stats.hp) || 50,
          Attack: parseInt(newPokemon.stats.attack) || 50,
          Defense: parseInt(newPokemon.stats.defense) || 50,
          Speed: parseInt(newPokemon.stats.speed) || 50,
          "Sp. Attack": 50,
          "Sp. Defense": 50
        }
      };
      
      // Supprimer les propriétés non nécessaires
      delete formattedPokemon.types;
      delete formattedPokemon.stats;
      
      console.log('Pokémon formaté pour l\'API:', formattedPokemon);
      await addPokemon(formattedPokemon);
      navigateToList();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleInputChange = (e, field, subfield = null) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    
    if (subfield) {
      setNewPokemon(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }));
    } else if (field === 'types') {
      setNewPokemon(prev => ({
        ...prev,
        [field]: [value] // Pour l'instant, on ne gère qu'un seul type
      }));
    } else {
      setNewPokemon(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Rendu des options de type avec les icônes
  const renderTypeOption = (type) => {
    const typeIcon = getTypeIcon(type);
    const typeLabel = 
      type === 'Fire' ? 'Feu' : 
      type === 'Water' ? 'Eau' : 
      type === 'Electric' ? 'Électrique' : 
      type === 'Grass' ? 'Plante' : 
      type === 'Ice' ? 'Glace' : 
      type === 'Fighting' ? 'Combat' : 
      type === 'Poison' ? 'Poison' : 
      type === 'Ground' ? 'Sol' : 
      type === 'Flying' ? 'Vol' : 
      type === 'Psychic' ? 'Psy' : 
      type === 'Bug' ? 'Insecte' : 
      type === 'Rock' ? 'Roche' : 
      type === 'Ghost' ? 'Spectre' : 
      type === 'Dragon' ? 'Dragon' : 
      type === 'Dark' ? 'Ténèbres' : 
      type === 'Steel' ? 'Acier' : 
      type === 'Fairy' ? 'Fée' : 
      type === 'Normal' ? 'Normal' : type;
      
    return (
      <div className="type-option">
        {typeIcon && <img src={typeIcon} alt={type} className="type-select-icon" />}
        <span>{typeLabel}</span>
      </div>
    );
  };

  return (
    <div className="add-pokemon-container">
      <h2>Ajouter un nouveau Pokémon</h2>
      <form onSubmit={handleSubmit} className="add-pokemon-form">
        <div className="form-section">
          <h3>Noms</h3>
          <div className="form-group">
            <label className="required">Nom (Français):</label>
            <input
              type="text"
              value={newPokemon.name.french}
              onChange={(e) => handleInputChange(e, 'name', 'french')}
              placeholder="Ex: Pikachu"
              required
            />
          </div>
          <div className="form-group">
            <label>Nom (Anglais):</label>
            <input
              type="text"
              value={newPokemon.name.english}
              onChange={(e) => handleInputChange(e, 'name', 'english')}
              placeholder="Ex: Pikachu"
            />
          </div>
          <div className="form-group">
            <label>Nom (Japonais):</label>
            <input
              type="text"
              value={newPokemon.name.japanese}
              onChange={(e) => handleInputChange(e, 'name', 'japanese')}
              placeholder="Ex: ピカチュウ"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Caractéristiques</h3>
          <div className="form-group">
            <label className="required">Type:</label>
            <select
              value={newPokemon.types[0]}
              onChange={(e) => handleInputChange(e, 'types')}
              required
              className="type-select"
            >
              <option value="">Sélectionnez un type</option>
              <option value="Normal">{renderTypeOption('Normal')}</option>
              <option value="Fire">{renderTypeOption('Fire')}</option>
              <option value="Water">{renderTypeOption('Water')}</option>
              <option value="Electric">{renderTypeOption('Electric')}</option>
              <option value="Grass">{renderTypeOption('Grass')}</option>
              <option value="Ice">{renderTypeOption('Ice')}</option>
              <option value="Fighting">{renderTypeOption('Fighting')}</option>
              <option value="Poison">{renderTypeOption('Poison')}</option>
              <option value="Ground">{renderTypeOption('Ground')}</option>
              <option value="Flying">{renderTypeOption('Flying')}</option>
              <option value="Psychic">{renderTypeOption('Psychic')}</option>
              <option value="Bug">{renderTypeOption('Bug')}</option>
              <option value="Rock">{renderTypeOption('Rock')}</option>
              <option value="Ghost">{renderTypeOption('Ghost')}</option>
              <option value="Dragon">{renderTypeOption('Dragon')}</option>
              <option value="Dark">{renderTypeOption('Dark')}</option>
              <option value="Steel">{renderTypeOption('Steel')}</option>
              <option value="Fairy">{renderTypeOption('Fairy')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="required">Image URL:</label>
            <input
              type="url"
              value={newPokemon.image}
              onChange={(e) => handleInputChange(e, 'image')}
              placeholder="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              required
            />
            <small>Utilisez une URL d'image publique pour votre Pokémon</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Statistiques</h3>
          <div className="stats-grid">
            <div className="form-group">
              <label className="required">PV:</label>
              <input
                type="number"
                min="1"
                max="255"
                value={newPokemon.stats.hp}
                onChange={(e) => handleInputChange(e, 'stats', 'hp')}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Attaque:</label>
              <input
                type="number"
                min="1"
                max="255"
                value={newPokemon.stats.attack}
                onChange={(e) => handleInputChange(e, 'stats', 'attack')}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Défense:</label>
              <input
                type="number"
                min="1"
                max="255"
                value={newPokemon.stats.defense}
                onChange={(e) => handleInputChange(e, 'stats', 'defense')}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Vitesse:</label>
              <input
                type="number"
                min="1"
                max="255"
                value={newPokemon.stats.speed}
                onChange={(e) => handleInputChange(e, 'stats', 'speed')}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={navigateToList} className="cancel-button">
            Annuler
          </button>
          <button type="submit" className="submit-button">
            Ajouter le Pokémon
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPokemonForm; 