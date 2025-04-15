
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitsList from '@/components/Visits/VisitsList';
import AddVisitForm from '@/components/Visits/AddVisitForm';

const Visits: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="space-y-6">
      <AddVisitForm />
      <VisitsList />
    </div>
  );
};

export default Visits;
