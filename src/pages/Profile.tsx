
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileView from '@/components/Profile/ProfileView';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  return <ProfileView />;
};

export default Profile;
