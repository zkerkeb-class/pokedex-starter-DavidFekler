import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    french: {
      type: String,
      required: false
    },
    english: {
      type: String,
      required: false
    },
    japanese: {
      type: String,
      required: false
    },
    chinese: {
      type: String,
      required: false
    }
  },
  type: [{
    type: String,
    required: true,
    enum: [
      'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
      'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
      'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
    ]
  }],
  base: {
    HP: {
      type: Number,
      required: false
    },
    Attack: {
      type: Number,
      required: false
    },
    Defense: {
      type: Number,
      required: false
    },
    "Sp. Attack": {
      type: Number,
      required: false
    },
    "Sp. Defense": {
      type: Number,
      required: false
    },
    Speed: {
      type: Number,
      required: false
    }
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
pokemonSchema.index({ 'name.french': 1 });
pokemonSchema.index({ 'name.english': 1 });
pokemonSchema.index({ type: 1 });
pokemonSchema.index({ id: 1 });

// Méthode virtuelle pour calculer le total des stats
pokemonSchema.virtual('totalPower').get(function() {
  const base = this.base;
  if (!base) return 0;
  return (base.HP || 0) + 
         (base.Attack || 0) + 
         (base.Defense || 0) + 
         (base["Sp. Attack"] || 0) + 
         (base["Sp. Defense"] || 0) + 
         (base.Speed || 0);
});

// Méthode statique pour trouver les Pokémon par type
pokemonSchema.statics.findByType = function(type) {
  return this.find({ type: type });
};

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon; 