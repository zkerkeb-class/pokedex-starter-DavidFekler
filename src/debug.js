// Fichier de diagnostic pour aider à comprendre les problèmes d'affichage de données

// Fonction pour vérifier la connexion à l'API
export const checkApiConnection = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/pokemons');
    const data = await response.json();
    
    console.log('=== DIAGNOSTIC API ===');
    console.log('Statut de la connexion:', response.ok ? 'OK' : 'ÉCHEC');
    console.log('Code de statut:', response.status);
    console.log('Nombre de Pokémon retournés:', data.pokemons ? data.pokemons.length : 'N/A');
    
    // Vérifier si un Pokémon "Alexandre" existe dans les données
    if (data.pokemons) {
      const alexandre = data.pokemons.find(p => 
        (p.name && typeof p.name === 'object' && p.name.french === 'Alexandre') ||
        (p.name && typeof p.name === 'string' && p.name === 'Alexandre')
      );
      console.log('Pokémon "Alexandre" trouvé:', alexandre ? 'OUI' : 'NON');
    }
    
    return {
      success: response.ok,
      data: data
    };
  } catch (error) {
    console.error('=== ERREUR DE CONNEXION API ===', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Exécuter le diagnostic immédiatement
if (typeof window !== 'undefined') {
  window.runDiagnostic = () => {
    checkApiConnection()
      .then(result => {
        console.log('Diagnostic terminé avec succès:', result.success);
      });
  };
  
  // Message d'aide
  console.log('Pour exécuter le diagnostic, appelez window.runDiagnostic() dans la console du navigateur');
} 