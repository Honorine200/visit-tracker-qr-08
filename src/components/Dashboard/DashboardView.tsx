
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  zone: string;
}

interface Visit {
  id: string;
  storeName: string;
  date: string;
  status: 'completed' | 'pending' | 'missed';
  address: string;
}

const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    // Simuler le chargement des données
    setTimeout(() => {
      // Données fictives pour la démo
      setDailyProgress(40);
      setWeeklyProgress(65);
      setRecentVisits([
        {
          id: '1',
          storeName: 'Boutique A',
          date: new Date(Date.now() - 3600000).toISOString(),
          status: 'completed',
          address: '15 rue du Commerce, Paris'
        },
        {
          id: '2',
          storeName: 'Boutique B',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
          address: '28 avenue des Boutiques, Paris'
        },
        {
          id: '3',
          storeName: 'Boutique C',
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'missed',
          address: '45 boulevard Haussmann, Paris'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
        <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <div className="inline-flex self-start px-2.5 py-1 bg-bisko-100 dark:bg-bisko-900 rounded-full text-xs font-medium text-bisko-700 dark:text-bisko-300 mb-1">
          Zone: {userData?.zone || 'Non assignée'}
        </div>
        <h1 className="text-2xl font-bold">Bonjour, {userData?.name || 'Commercial'}</h1>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord</p>
      </div>
      
      <div className="grid gap-4">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-bisko-500" />
              Objectifs du jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progression quotidienne</span>
                  <span className="font-medium">{dailyProgress}%</span>
                </div>
                <Progress value={dailyProgress} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progression hebdomadaire</span>
                  <span className="font-medium">{weeklyProgress}%</span>
                </div>
                <Progress value={weeklyProgress} className="h-2" />
              </div>
              <Button 
                className="w-full bg-bisko-100 hover:bg-bisko-200 text-bisko-700 border border-bisko-200"
                variant="outline"
                onClick={() => navigate('/scanner')}
              >
                Scanner un QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-bisko-500" />
              Visites récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVisits.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucune visite récente</p>
              ) : (
                recentVisits.map((visit) => (
                  <div key={visit.id} className="border-b border-border last:border-0 pb-2 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{visit.storeName}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{visit.address}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">{formatDate(visit.date)}</span>
                        <span className={`text-xs mt-1 px-1.5 py-0.5 rounded-full ${
                          visit.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {visit.status === 'completed' ? 'Complétée' : 'Manquée'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <Button 
                className="w-full mt-2" 
                variant="outline"
                onClick={() => navigate('/visits')}
              >
                Voir toutes les visites
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
