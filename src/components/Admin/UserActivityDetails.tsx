
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, CalendarDays, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  zone: string;
}

interface Visit {
  id: string;
  storeId: string;
  storeName: string;
  date: string;
  notes?: string;
  status: 'completed' | 'pending' | 'missed';
}

interface StoreData {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

interface UserActivityDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

const UserActivityDetails: React.FC<UserActivityDetailsProps> = ({ 
  open, 
  onOpenChange, 
  user 
}) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les activités de l'utilisateur
  useEffect(() => {
    if (user && open) {
      setIsLoading(true);
      
      // Récupérer les visites de localStorage
      const allVisits = JSON.parse(localStorage.getItem('visits') || '[]');
      // Filtrer par l'ID de l'utilisateur dans un vrai système
      // Ici on simule des visites pour la démo
      const userVisits = allVisits.slice(0, 3).map((visit: any) => ({
        ...visit,
        agentName: user.name,
      }));
      
      // Récupérer les boutiques de localStorage
      const allStores = JSON.parse(localStorage.getItem('stores') || '[]');
      // Filtrer par zone du commercial
      const userStores = allStores
        .filter((store: any) => store.zone === user.zone)
        .slice(0, 3);
      
      setVisits(userVisits);
      setStores(userStores);
      setIsLoading(false);
    }
  }, [user, open]);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Activités de {user.name}
          </DialogTitle>
          <DialogDescription>
            Détails des visites, ventes et boutiques du commercial
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="visits" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="visits" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> Visites
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center gap-1">
              <Store className="h-4 w-4" /> Boutiques
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" /> Ventes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Visites du jour</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="w-8 h-8 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
                  </div>
                ) : visits.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Aucune visite enregistrée aujourd'hui</p>
                ) : (
                  <div className="space-y-3">
                    {visits.map((visit) => (
                      <div key={visit.id} className="border p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{visit.storeName}</h3>
                          <Badge variant={visit.status === 'completed' ? "success" : "outline"}>
                            {visit.status === 'completed' ? 'Complétée' : 'En attente'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(visit.date)}</p>
                        {visit.notes && <p className="text-sm mt-2">{visit.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Boutiques enregistrées</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="w-8 h-8 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
                  </div>
                ) : stores.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Aucune boutique enregistrée dans cette zone</p>
                ) : (
                  <div className="space-y-3">
                    {stores.map((store) => (
                      <div key={store.id} className="border p-3 rounded-lg">
                        <h3 className="font-medium">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">{store.address}</p>
                        <p className="text-xs mt-1">Ajoutée le {formatDate(store.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ventes du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Aucune donnée de vente disponible pour le moment
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivityDetails;
