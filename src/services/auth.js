import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Fonction pour créer un compte utilisateur
export const register = async (userData) => {
  try {
    console.log('Envoi des données d\'inscription au serveur:', { 
      username: userData.username, 
      email: userData.email, 
      password: userData.password ? '******' : undefined 
    });
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log('Réponse du serveur pour l\'inscription:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'inscription:', error);
    
    // Extraire le message d'erreur de la réponse API
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Erreur lors de la création du compte';
    
    console.error('Message d\'erreur d\'inscription:', errorMessage);
    throw { message: errorMessage };
  }
};

// Fonction pour se connecter
export const login = async (credentials) => {
  try {
    console.log('Tentative de connexion avec:', { 
      email: credentials.email, 
      password: credentials.password ? '******' : undefined 
    });
    
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    console.log('Réponse du serveur pour la connexion:', response.data);
    
    // Stocker les informations utilisateur dans le localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée lors de la connexion:', error);
    
    // Extraire le message d'erreur de la réponse API
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Erreur lors de la connexion';
    
    console.error('Message d\'erreur de connexion:', errorMessage);
    throw { message: errorMessage };
  }
};

// Fonction pour déconnecter l'utilisateur
export const logout = () => {
  localStorage.removeItem('user');
};

// Fonction pour récupérer l'utilisateur actuellement connecté
export const getCurrentUser = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    localStorage.removeItem('user');
    return null;
  }
}; 