import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Route pour créer un compte utilisateur
router.post('/register', async (req, res) => {
  try {
    console.log('Tentative de création d\'un compte utilisateur:', req.body);
    const { username, email, password } = req.body;

    // Vérification des données
    if (!username || !email || !password) {
      console.log('Données manquantes:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérifier si l'email existe déjà
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      console.log('Email déjà utilisé:', email);
      return res.status(400).json({ message: 'Cette adresse email est déjà utilisée' });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log('Nom d\'utilisateur déjà pris:', username);
      return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà pris' });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      username,
      email,
      password
    });

    console.log('Utilisateur à créer:', {
      username: user.username,
      email: user.email,
      passwordLength: user.password ? user.password.length : 0
    });

    // Enregistrer l'utilisateur dans la base de données
    await user.save();
    console.log('Utilisateur créé avec succès:', user._id);

    // Supprimer le mot de passe de la réponse
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };

    res.status(201).json({ 
      message: 'Compte créé avec succès',
      user: userResponse
    });
  } catch (error) {
    console.error('Erreur détaillée lors de l\'inscription:', error);
    
    if (error.name === 'ValidationError') {
      // Erreurs de validation Mongoose
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.code === 11000) {
      // Erreur de duplicate key (index unique)
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `Ce ${field} est déjà utilisé` 
      });
    }
    
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du compte', 
      error: error.message 
    });
  }
});

export default router; 