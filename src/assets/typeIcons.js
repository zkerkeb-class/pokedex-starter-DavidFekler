// Import des icônes de types
import Normal from './types/Normal.png';
import Fire from './types/Fire.png';
import Water from './types/Water.png';
import Electric from './types/Electric.png';
import Grass from './types/Grass.png';
import Ice from './types/Ice.png';
import Fighting from './types/Fighting.png';
import Poison from './types/Poison.png';
import Ground from './types/Ground.png';
import Flying from './types/Flying.png';
import Psychic from './types/Psychic.png';
import Bug from './types/Bug.png';
import Rock from './types/Rock.png';
import Ghost from './types/Ghost.png';
import Dragon from './types/Dragon.png';
import Dark from './types/Dark.png';
import Steel from './types/Steel.png';
import Fairy from './types/Fairy.png';

// Objet contenant tous les icônes de types
export const typeIcons = {
  normal: Normal,
  fire: Fire,
  water: Water,
  electric: Electric,
  grass: Grass,
  ice: Ice,
  fighting: Fighting,
  poison: Poison,
  ground: Ground,
  flying: Flying,
  psychic: Psychic,
  bug: Bug,
  rock: Rock,
  ghost: Ghost,
  dragon: Dragon,
  dark: Dark,
  steel: Steel,
  fairy: Fairy
};

// Fonction pour obtenir l'icône d'un type
export const getTypeIcon = (type) => {
  if (!type) return null;
  
  // Normaliser le type (minuscules)
  const normalizedType = type.toLowerCase();
  
  // Retourner l'icône correspondante ou null si non trouvée
  return typeIcons[normalizedType] || null;
};

export default typeIcons; 