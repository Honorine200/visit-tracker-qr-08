import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, LogOut, Moon, Sun, Award, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

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
      
      <Card className="glass-card">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <CardTitle>Informations personnelles</CardTitle>
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src="" alt={userData?.name} />
            <AvatarFallback className="bg-bisko-100 text-bisko-700 dark:bg-bisko-900 dark:text-bisko-300">
              {userData?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Nom</span>
            </div>
            <p className="font-medium">{userData?.name || 'Non renseigné'}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Email</span>
            </div>
            <p className="font-medium">{userData?.email || 'Non renseigné'}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <Award className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Rôle</span>
            </div>
            <p className="font-medium capitalize">{userData?.role || 'Non renseigné'}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Zone géographique</span>
            </div>
            <p className="font-medium">{userData?.zone || 'Non renseignée'}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <Label htmlFor="dark-mode">Mode sombre</Label>
            </div>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSyncData}
            disabled={syncStatus === 'syncing'}
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Synchronisation...
              </>
            ) : syncStatus === 'success' ? (
              <>
                <RefreshCw className="h-4 w-4 text-green-500" />
                Synchronisé
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Synchroniser les données
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileView;
