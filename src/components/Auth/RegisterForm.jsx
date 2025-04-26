import React, { useState } from 'react';
import { register } from '../../services/auth';
import './Auth.css';

const RegisterForm = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { username, email, password, confirmPassword } = formData;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation simple
    if (!username || !email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    try {
      setLoading(true);
      const userData = { username, email, password };
      const response = await register(userData);
      
      setSuccess('Compte créé avec succès! Vous pouvez maintenant vous connecter.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Rediriger vers la page de connexion après quelques secondes
      setTimeout(() => {
        if (navigateTo) {
          navigateTo('login');
        }
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Créer un compte</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Entrez votre nom d'utilisateur"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Entrez votre adresse email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer un compte'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Déjà inscrit? <span onClick={() => navigateTo('login')}>Se connecter</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 