
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardView from '@/components/Dashboard/DashboardView';
import AssignmentsView from '@/components/Dashboard/AssignmentsView';
import { getCurrentUser } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';
import { usersManager } from '@/utils/usersUtils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = getCurrentUser();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Si l'utilisateur n'est pas admin, vérifier s'il est autorisé à se connecter
    if (user.role !== 'admin') {
      // Vérifier si l'utilisateur est dans la liste des utilisateurs autorisés
      const isAuthorized = usersManager.isUserAuthorized(user.email);
      
      if (!isAuthorized) {
        // Déconnecter l'utilisateur non autorisé
        localStorage.removeItem('user');
        
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Votre compte a été désactivé ou n'existe plus."
        });
        
        navigate('/login');
        return;
      }
    }
    
    setLoading(false);
  }, [navigate, toast]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-t-bisko-500 border-bisko-200 animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <DashboardView />
      <AssignmentsView />
    </div>
  );
};

export default Dashboard;
