import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const pokemons = [
  {
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    height: 7,
    weight: 69,
    abilities: ["Overgrow", "Chlorophyll"]
  },
  {
    name: "Charmander",
    types: ["Fire"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    height: 6,
    weight: 85,
    abilities: ["Blaze", "Solar Power"]
  },
  {
    name: "Squirtle",
    types: ["Water"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    height: 5,
    weight: 90,
    abilities: ["Torrent", "Rain Dish"]
  },
  {
    name: "Pikachu",
    types: ["Electric"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    height: 4,
    weight: 60,
    abilities: ["Static", "Lightning Rod"]
  }
];

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  types: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  abilities: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

const importPokemons = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connecté à MongoDB');

    // Supprime tous les pokémons existants
    await Pokemon.deleteMany({});
    console.log('Base de données nettoyée');

    // Insère les nouveaux pokémons
    await Pokemon.insertMany(pokemons);
    console.log('Pokémons importés avec succès');

    // Affiche les pokémons importés
    const importedPokemons = await Pokemon.find();
    console.log('Pokémons dans la base de données:', importedPokemons);

    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    process.exit(1);
  }
};

importPokemons(); 