
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import ProfileCard from './ProfileCard';
import SettingsCard from './SettingsCard';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  zone: string;
}

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    
    navigate('/login');
  };
  
  const handleSyncData = () => {
    setSyncStatus('syncing');
    
    setTimeout(() => {
      setSyncStatus('success');
      
      toast({
        title: "Synchronisation réussie",
        description: "Toutes vos données ont été synchronisées.",
      });
      
      setTimeout(() => {
        setSyncStatus('idle');
      }, 2000);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
        <p className="text-muted-foreground">Chargement de votre profil...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <div className="inline-flex self-start px-2.5 py-1 bg-bisko-100 dark:bg-bisko-900 rounded-full text-xs font-medium text-bisko-700 dark:text-bisko-300 mb-1">
          Compte
        </div>
        <h1 className="text-2xl font-bold">Votre profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles</p>
      </div>
      
      <ProfileCard userData={userData} />
      
      <SettingsCard 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        syncStatus={syncStatus}
        onSyncData={handleSyncData}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default ProfileView;
