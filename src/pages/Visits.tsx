
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitsList from '@/components/Visits/VisitsList';
import AddVisitForm from '@/components/Visits/AddVisitForm';
import { visitsManager, storesManager } from '@/utils/localStorageUtils';

const Visits: React.FC = () => {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // S'assurer que nos gestionnaires de données sont initialisés
    if (!initialized) {
      // Vérifier si nous avons déjà des données ou les initialiser si nécessaire
      const visits = visitsManager.getAll();
      const stores = storesManager.getAll();
      
      console.log(`Données chargées: ${visits.length} visites, ${stores.length} boutiques`);
      setInitialized(true);
    }
  }, [navigate, initialized]);
  
  // Écouter les modifications du stockage local (pour la mise à jour en temps réel)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Mise à jour du stockage local détectée");
      setInitialized(false); // Forcer une réinitialisation des données
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <div className="space-y-6">
      <AddVisitForm />
      <VisitsList />
    </div>
  );
};

export default Visits;
