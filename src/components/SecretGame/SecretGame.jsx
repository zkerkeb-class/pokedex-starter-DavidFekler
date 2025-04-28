import React, { useState, useEffect } from 'react';
import './SecretGame.css';
import { getTypeIcon } from '../../assets/typeIcons';

const SecretGame = ({ pokemons }) => {
  // État du jeu
  const [word, setWord] = useState('');
  const [displayWord, setDisplayWord] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(6);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [currentPokemon, setCurrentPokemon] = useState(null);

  // Initialiser le jeu avec un Pokémon aléatoire
  useEffect(() => {
    if (pokemons && pokemons.length > 0) {
      startNewGame();
    }
  }, [pokemons]);

  // Fonction pour démarrer une nouvelle partie
  const startNewGame = () => {
    if (!pokemons || pokemons.length === 0) return;

    // Choisir un Pokémon aléatoire
    const randomIndex = Math.floor(Math.random() * pokemons.length);
    const pokemon = pokemons[randomIndex];
    setCurrentPokemon(pokemon);
    
    // Récupérer le nom du Pokémon (de préférence en français)
    let pokemonName;
    if (typeof pokemon.name === 'object') {
      pokemonName = pokemon.name.french || pokemon.name.english || pokemon.name.japanese;
    } else {
      pokemonName = pokemon.name;
    }
    
    // Nettoyer et convertir le nom en minuscules
    const normalizedName = pokemonName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");
      
    setWord(normalizedName);
    setDisplayWord(Array(normalizedName.length).fill('_'));
    setUsedLetters([]);
    setAttempts(0);
    setGameStatus('playing');
    setMessage('Devinez le nom du Pokémon!');
  };

  // Fonction pour gérer les tentatives
  const handleGuess = (letter) => {
    // Vérifier si la lettre a déjà été utilisée ou si le jeu est terminé
    if (usedLetters.includes(letter) || gameStatus !== 'playing') return;

    // Ajouter la lettre aux lettres utilisées
    const newUsedLetters = [...usedLetters, letter];
    setUsedLetters(newUsedLetters);

    // Vérifier si la lettre est dans le mot
    if (word.includes(letter)) {
      // Mettre à jour l'affichage du mot
      const newDisplayWord = [...displayWord];
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          newDisplayWord[i] = letter;
        }
      }
      setDisplayWord(newDisplayWord);

      // Vérifier si le joueur a gagné
      if (!newDisplayWord.includes('_')) {
        setGameStatus('won');
        setScore(score + 1);
        setMessage('Bravo! Vous avez deviné correctement!');
      }
    } else {
      // Augmenter le nombre d'erreurs
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Vérifier si le joueur a perdu
      if (newAttempts >= maxAttempts) {
        setGameStatus('lost');
        setMessage(`Dommage! Le Pokémon était: ${word.toUpperCase()}`);
      }
    }
  };

  // Fonction pour obtenir l'icône du type principal du Pokémon
  const getPokemonTypeIcon = () => {
    if (!currentPokemon || !currentPokemon.type || !Array.isArray(currentPokemon.type) || currentPokemon.type.length === 0) {
      return null;
    }
    
    // Récupérer le premier type du Pokémon
    const mainType = currentPokemon.type[0];
    return getTypeIcon(mainType);
  };

  // Clavier virtuel
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="secret-game-container">
      <h2>Jeu du Pendu Pokémon</h2>
      
      <div className="game-info">
        <p className="score">Score: {score}</p>
        <p className="attempts">Erreurs: {attempts}/{maxAttempts}</p>
      </div>
      
      <div className="hangman">
        <div className={`hangman-figure stage-${attempts}`}></div>
      </div>
      
      {gameStatus === 'playing' && (
        <div className="type-hint">
          <p>Indice: Type principal</p>
          {getPokemonTypeIcon() && (
            <div className={`type-hint-badge ${currentPokemon?.type[0]?.toLowerCase() || ''}`}>
              <img 
                src={getPokemonTypeIcon()} 
                alt="Type principal" 
                className="type-hint-icon" 
              />
            </div>
          )}
        </div>
      )}
      
      <div className="word-display">
        {displayWord.map((letter, index) => (
          <span key={index} className="letter-space">{letter}</span>
        ))}
      </div>
      
      <p className="game-message">{message}</p>
      
      <div className="keyboard">
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={usedLetters.includes(letter) || gameStatus !== 'playing'}
            className={`key-button ${usedLetters.includes(letter) ? (word.includes(letter) ? 'correct' : 'incorrect') : ''}`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {gameStatus !== 'playing' && (
        <button className="new-game-button" onClick={startNewGame}>
          Nouvelle Partie
        </button>
      )}
      
      {gameStatus === 'won' && currentPokemon && (
        <div className="pokemon-reveal">
          <img 
            src={currentPokemon.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png'} 
            alt={word} 
            className="pokemon-reveal-image"
          />
        </div>
      )}
    </div>
  );
};

export default SecretGame; 