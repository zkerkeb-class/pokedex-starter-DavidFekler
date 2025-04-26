import express from 'express';
import Pokemon from '../models/Pokemon.js';

const router = express.Router();

// GET - Récupérer tous les pokémons avec pagination et filtres
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, sort = 'id' } = req.query;
    const query = {};
    
    // Filtre par type si spécifié
    if (type) {
      query.type = type;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: 1 }
    };

    const pokemons = await Pokemon.find(query)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .sort(options.sort);
    
    const total = await Pokemon.countDocuments(query);

    res.status(200).json({
      pokemons,
      totalPages: Math.ceil(total / options.limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des pokémons",
      error: error.message
    });
  }
});

// GET - Rechercher des pokémons
router.get('/search', async (req, res) => {
  try {
    const { name, type } = req.query;
    const query = {};
    
    if (name) {
      query['$or'] = [
        { 'name.french': { $regex: name, $options: 'i' } },
        { 'name.english': { $regex: name, $options: 'i' } },
        { 'name.japanese': { $regex: name, $options: 'i' } },
        { 'name.chinese': { $regex: name, $options: 'i' } }
      ];
    }
    
    if (type) {
      query.type = type;
    }
    
    const pokemons = await Pokemon.find(query);
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Obtenir les statistiques des pokémons
router.get('/stats', async (req, res) => {
  try {
    const stats = await Pokemon.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          averageHP: { $avg: '$base.HP' },
          averageAttack: { $avg: '$base.Attack' },
          averageDefense: { $avg: '$base.Defense' },
          typeDistribution: {
            $push: '$type'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(404).json({ message: 'Aucune statistique disponible' });
    }

    // Calculer la distribution des types
    const typeCount = {};
    stats[0].typeDistribution.flat().forEach(type => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    res.json({
      totalCount: stats[0].totalCount,
      averageHP: Math.round(stats[0].averageHP * 100) / 100,
      averageAttack: Math.round(stats[0].averageAttack * 100) / 100,
      averageDefense: Math.round(stats[0].averageDefense * 100) / 100,
      typeDistribution: typeCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Récupérer un pokémon par son ID
router.get('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: parseInt(req.params.id) });
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du pokémon",
      error: error.message
    });
  }
});

// POST - Créer un nouveau pokémon
router.post('/', async (req, res) => {
  try {
    const pokemon = new Pokemon(req.body);
    const newPokemon = await pokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Erreur de validation",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({
      message: "Erreur lors de la création du pokémon",
      error: error.message
    });
  }
});

// PUT - Mettre à jour un pokémon
router.put('/:id', async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json(updatedPokemon);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Erreur de validation",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(400).json({
      message: "Erreur lors de la mise à jour du pokémon",
      error: error.message
    });
  }
});

// DELETE - Supprimer un pokémon
router.delete('/:id', async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json({
      message: "Pokémon supprimé avec succès",
      pokemon: deletedPokemon
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du pokémon",
      error: error.message
    });
  }
});

export default router; 