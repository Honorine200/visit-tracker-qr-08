
// Vérifier si l'utilisateur connecté est un administrateur
export const isAdmin = (): boolean => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr);
    return user.role === 'admin';
  } catch (error) {
    console.error('Erreur lors de la vérification des droits admin:', error);
    return false;
  }
};

// Récupérer les données de l'utilisateur connecté
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};
