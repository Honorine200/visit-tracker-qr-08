
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitsList from '@/components/Visits/VisitsList';
import AddVisitForm from '@/components/Visits/AddVisitForm';
import { visitsManager, storesManager } from '@/utils/localStorageUtils';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Visits: React.FC = () => {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [storesCount, setStoresCount] = useState(0);
  
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
      
      setStoresCount(stores.length);
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
      {storesCount === 0 ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800">Aucune boutique enregistrée</h3>
              <p className="text-sm text-orange-700 mt-1">
                Veuillez enregistrer au moins une boutique avant d'ajouter des visites.
                Les QR codes scannés doivent correspondre à des boutiques enregistrées.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      <AddVisitForm />
      <VisitsList />
    </div>
  );
};

export default Visits;
