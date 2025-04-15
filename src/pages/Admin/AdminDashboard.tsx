
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Users,
  Store,
  Package,
  FileText,
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

interface ActivityItem {
  action: string;
  user: string;
  time: string;
  icon: React.ReactNode;
  timestamp: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  color = 'bg-bisko-500',
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`${color} p-2 rounded-full text-white`}>{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend !== undefined && (
        <div className="flex items-center mt-4">
          <span
            className={`text-xs ${
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            } flex items-center`}
          >
            <TrendingUp
              size={12}
              className={`${trend >= 0 ? '' : 'transform rotate-180'} mr-1`}
            />
            {Math.abs(trend)}% par rapport au mois dernier
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load data and last sync time
    loadDashboardData();
    
    // Set up a listener for store changes
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);
  
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === 'stores' || e.key === 'visits' || e.key === 'invoices') {
      // Reload activities when relevant data changes
      loadRecentActivities();
    }
  };
  
  const loadDashboardData = () => {
    setLoading(true);
    
    // Simulated loading delay
    setTimeout(() => {
      // Load last sync time
      const lastSyncTime = localStorage.getItem('lastDashboardSync');
      if (lastSyncTime) {
        setLastSynced(lastSyncTime);
      }
      
      // Load recent activities
      loadRecentActivities();
      
      setLoading(false);
    }, 1000);
  };
  
  const loadRecentActivities = () => {
    // In a real app, this would fetch from Supabase
    // For now, we'll create some mock data based on localStorage
    
    const activities: ActivityItem[] = [];
    
    // Get recent stores
    const stores = JSON.parse(localStorage.getItem('stores') || '[]');
    if (stores.length > 0) {
      // Sort by creation date, newest first
      stores.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Add the 2 most recent stores as activities
      stores.slice(0, 2).forEach((store: any) => {
        activities.push({
          action: `Nouvelle boutique ajoutée: ${store.name}`,
          user: "Commercial",
          time: formatRelativeTime(store.createdAt),
          icon: <Store size={14} className="text-green-500" />,
          timestamp: store.createdAt
        });
      });
    }
    
    // Get recent visits (placeholder for now)
    const visits = JSON.parse(localStorage.getItem('visits') || '[]');
    if (visits.length > 0) {
      // Add some visit activities
      visits.slice(0, 2).forEach((visit: any) => {
        activities.push({
          action: `Visite effectuée chez ${visit.storeName || 'un client'}`,
          user: visit.agentName || "Commercial",
          time: formatRelativeTime(visit.date),
          icon: <Calendar size={14} className="text-blue-500" />,
          timestamp: visit.date
        });
      });
    }
    
    // Sort all activities by timestamp, newest first
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Take the 4 most recent activities
    setRecentActivities(activities.slice(0, 4));
  };
  
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return "Il y a quelques instants";
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
      }
    } catch (e) {
      return "Date inconnue";
    }
  };
  
  const syncData = () => {
    setSyncing(true);
    
    // Simulate data sync
    setTimeout(() => {
      // In a real implementation, this would sync with Supabase
      const now = new Date().toISOString();
      localStorage.setItem('lastDashboardSync', now);
      setLastSynced(now);
      
      // Reload activities
      loadRecentActivities();
      
      toast({
        title: "Synchronisation terminée",
        description: "Les données ont été synchronisées avec succès.",
      });
      
      setSyncing(false);
    }, 2000);
  };
  
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch (e) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-bisko-700">Tableau de bord</h2>
        <div className="flex items-center gap-3">
          {lastSynced && (
            <div className="text-sm text-muted-foreground">
              Dernière sync: {formatTime(lastSynced)}
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={syncData}
            disabled={syncing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronisation...' : 'Synchroniser'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Commerciaux"
          value="8"
          description="Nombre total de commerciaux actifs"
          icon={<Users size={18} />}
          trend={12.5}
          color="bg-blue-500"
        />
        <StatsCard
          title="Boutiques"
          value="42"
          description="Nombre total de boutiques enregistrées"
          icon={<Store size={18} />}
          trend={4.7}
          color="bg-green-500"
        />
        <StatsCard
          title="Produits"
          value="12"
          description="Nombre total de produits en catalogue"
          icon={<Package size={18} />}
          trend={0}
          color="bg-amber-500"
        />
        <StatsCard
          title="Factures"
          value="126"
          description="Nombre total de factures émises"
          icon={<FileText size={18} />}
          trend={8.3}
          color="bg-purple-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performances mensuelles</CardTitle>
            <CardDescription>
              Progression globale des visites par zone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Dakar</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Thiès</span>
                <span className="font-medium">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Saint-Louis</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ziguinchor</span>
                <span className="font-medium">32%</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Dernières actions effectuées sur la plateforme
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={loadRecentActivities}
            >
              Actualiser
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((item, i) => (
                  <div key={i} className="flex justify-between items-start pb-4 last:pb-0 last:border-0 border-b border-border">
                    <div className="flex items-start gap-3">
                      <div className="bg-muted p-1.5 rounded-full">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">Par {item.user}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.time}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Aucune activité récente
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
