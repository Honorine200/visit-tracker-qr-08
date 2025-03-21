
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardView from '@/components/Dashboard/DashboardView';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  return <DashboardView />;
};

export default Dashboard;
