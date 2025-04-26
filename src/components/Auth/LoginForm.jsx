import React, { useState } from 'react';
import { login } from '../../services/auth';
import './Auth.css';

const LoginForm = ({ navigateTo }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { email, password } = formData;
  
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
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setLoading(true);
      const response = await login({ email, password });
      
      setSuccess('Connexion réussie! Redirection en cours...');
      
      // Rediriger vers la page principale après quelques secondes
      setTimeout(() => {
        if (navigateTo) {
          navigateTo('list');
        }
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Connexion</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
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
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="auth-redirect">
          Pas encore de compte? <span onClick={() => navigateTo('register')}>S'inscrire</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 