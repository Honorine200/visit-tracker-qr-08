
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitsList from '@/components/Visits/VisitsList';

const Visits: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  return <VisitsList />;
};

export default Visits;
