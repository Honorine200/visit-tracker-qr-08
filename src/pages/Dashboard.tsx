
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardView from '@/components/Dashboard/DashboardView';
import AssignmentsView from '@/components/Dashboard/AssignmentsView';

const Dashboard: React.FC = () => {
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
      <DashboardView />
      <AssignmentsView />
    </div>
  );
};

export default Dashboard;
