
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Clock, X, Search, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type VisitStatus = 'completed' | 'pending' | 'missed';

interface Visit {
  id: string;
  storeName: string;
  storeId: string;
  date: string;
  address: string;
  status: VisitStatus;
}

const VisitsList: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simuler le chargement de données
    setTimeout(() => {
      // Données factices pour démonstration
      const mockVisits: Visit[] = [
        {
          id: "1",
          storeName: "Supermarché Excel",
          storeId: "STORE123",
          date: "2023-11-15T10:30:00Z",
          address: "123 Rue Centrale, Dakar",
          status: "completed"
        },
        {
          id: "2",
          storeName: "Mini Market Plus",
          storeId: "STORE124",
          date: "2023-11-16T14:45:00Z",
          address: "45 Avenue Principale, Dakar",
          status: "completed"
        },
        {
          id: "3",
          storeName: "Market Express",
          storeId: "STORE125",
          date: "2023-11-20T09:15:00Z",
          address: "78 Rue du Commerce, Dakar",
          status: "pending"
        },
        {
          id: "4",
          storeName: "Super Shop",
          storeId: "STORE126",
          date: "2023-11-10T11:30:00Z",
          address: "15 Rue de la Liberté, Dakar",
          status: "missed"
        }
      ];
      
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrer les visites en fonction du terme de recherche
    const filtered = visits.filter(visit => 
      visit.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVisits(filtered);
  }, [searchTerm, visits]);

  const getStatusIcon = (status: VisitStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'missed':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: VisitStatus) => {
    switch (status) {
      case 'completed':
        return 'Complétée';
      case 'pending':
        return 'Planifiée';
      case 'missed':
        return 'Manquée';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch (error) {
      return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-bisko-600">Mes visites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une boutique..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredVisits.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Aucune visite trouvée</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Vous n'avez pas encore de visites enregistrées ou votre recherche n'a retourné aucun résultat.
              </p>
              <Button className="mt-4" asChild>
                <a href="/scanner">Scanner un QR Code</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="mr-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {getStatusIcon(visit.status)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{visit.storeName}</h3>
                    <p className="text-sm text-muted-foreground">{visit.address}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{formatDate(visit.date)}</span>
                        <span>•</span>
                        <span>{formatTime(visit.date)}</span>
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                        {getStatusText(visit.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitsList;
