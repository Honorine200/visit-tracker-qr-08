
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { isAdmin } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';

const AdminRoute: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    if (!userIsAdmin) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette section."
      });
    }
  }, [toast, userIsAdmin]);

  if (!userIsAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
