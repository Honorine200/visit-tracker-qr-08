
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Store,
  Package,
  FileText,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
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
  
  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions effectuées sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Nouvelle boutique ajoutée",
                  user: "Marie Diop",
                  time: "Il y a 30 minutes",
                  icon: <Store size={14} className="text-green-500" />,
                },
                {
                  action: "Nouvelle facture créée",
                  user: "Amadou Sow",
                  time: "Il y a 2 heures",
                  icon: <FileText size={14} className="text-blue-500" />,
                },
                {
                  action: "Nouvel utilisateur créé",
                  user: "Admin Système",
                  time: "Il y a 1 jour",
                  icon: <Users size={14} className="text-purple-500" />,
                },
                {
                  action: "Catalogue de produits mis à jour",
                  user: "Admin Système",
                  time: "Il y a 3 jours",
                  icon: <Package size={14} className="text-amber-500" />,
                },
              ].map((item, i) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
