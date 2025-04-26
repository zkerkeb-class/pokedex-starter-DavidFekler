import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const options = {
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex', options);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
    
    // Vérifier si la collection 'users' existe et la créer si nécessaire
    const collections = await conn.connection.db.listCollections({ name: 'users' }).toArray();
    if (collections.length === 0) {
      console.log('Collection "users" non trouvée, création en cours...');
      await conn.connection.db.createCollection('users');
      console.log('Collection "users" créée avec succès');
    } else {
      console.log('Collection "users" déjà existante');
    }
    
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
  console.log('Déconnecté de MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Erreur MongoDB: ${err.message}`);
});

export default connectDB; 