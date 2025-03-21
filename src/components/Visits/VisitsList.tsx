
import React, { useState, useEffect } from 'react';
import { CalendarIcon, MapPin, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Visit {
  id: string;
  storeName: string;
  storeId: string;
  date: string;
  address: string;
  status: 'completed' | 'pending' | 'missed';
}

const VisitsList: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      // Données fictives pour la démo
      const mockVisits = [
        {
          id: '1',
          storeName: 'Boutique Central',
          storeId: 'STORE123',
          date: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 heures auparavant
          address: '15 rue du Commerce, Paris',
          status: 'completed'
        },
        {
          id: '2',
          storeName: 'Boutique Étoile',
          storeId: 'STORE456',
          date: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 jour auparavant
          address: '28 avenue des Champs-Élysées, Paris',
          status: 'completed'
        },
        {
          id: '3',
          storeName: 'Boutique Seine',
          storeId: 'STORE789',
          date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 jours auparavant
          address: '45 quai de la Seine, Paris',
          status: 'completed'
        },
        {
          id: '4',
          storeName: 'Boutique Montmartre',
          storeId: 'STORE012',
          date: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 jours auparavant
          address: '12 rue des Abbesses, Paris',
          status: 'missed'
        },
        {
          id: '5',
          storeName: 'Boutique Bastille',
          storeId: 'STORE345',
          date: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 jours auparavant
          address: '33 boulevard Beaumarchais, Paris',
          status: 'completed'
        },
        {
          id: '6',
          storeName: 'Boutique République',
          storeId: 'STORE678',
          date: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 jours auparavant
          address: '5 place de la République, Paris',
          status: 'missed'
        },
        {
          id: '7',
          storeName: 'Boutique Madeleine',
          storeId: 'STORE901',
          date: new Date(Date.now() + 1 * 86400000).toISOString(), // 1 jour futur (planifié)
          address: '18 boulevard de la Madeleine, Paris',
          status: 'pending'
        }
      ];
      
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  useEffect(() => {
    // Filtrer les visites en fonction de la recherche
    if (searchQuery.trim() === '') {
      setFilteredVisits(visits);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = visits.filter(
        visit => 
          visit.storeName.toLowerCase().includes(query) ||
          visit.address.toLowerCase().includes(query) ||
          visit.storeId.toLowerCase().includes(query)
      );
      setFilteredVisits(filtered);
    }
  }, [searchQuery, visits]);
  
  // Filtrer les visites par statut
  const filterByStatus = (status: 'all' | 'completed' | 'pending' | 'missed') => {
    if (status === 'all') {
      setFilteredVisits(visits);
    } else {
      const filtered = visits.filter(visit => visit.status === status);
      setFilteredVisits(filtered);
    }
  };
  
  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Vérifier si une date est dans le futur
  const isFutureDate = (dateString: string) => {
    return new Date(dateString) > new Date();
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
        <p className="text-muted-foreground">Chargement des visites...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <div className="inline-flex self-start px-2.5 py-1 bg-bisko-100 dark:bg-bisko-900 rounded-full text-xs font-medium text-bisko-700 dark:text-bisko-300 mb-1">
          Historique
        </div>
        <h1 className="text-2xl font-bold">Vos visites</h1>
        <p className="text-muted-foreground">Consultez l'historique de vos visites en boutique</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une boutique..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all" onClick={() => filterByStatus('all')}>Tout</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => filterByStatus('completed')}>Effectuées</TabsTrigger>
          <TabsTrigger value="pending" onClick={() => filterByStatus('pending')}>Planifiées</TabsTrigger>
          <TabsTrigger value="missed" onClick={() => filterByStatus('missed')}>Manquées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <VisitsContent visits={filteredVisits} formatDate={formatDate} isFutureDate={isFutureDate} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <VisitsContent visits={filteredVisits} formatDate={formatDate} isFutureDate={isFutureDate} />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <VisitsContent visits={filteredVisits} formatDate={formatDate} isFutureDate={isFutureDate} />
        </TabsContent>
        
        <TabsContent value="missed" className="mt-4">
          <VisitsContent visits={filteredVisits} formatDate={formatDate} isFutureDate={isFutureDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface VisitsContentProps {
  visits: Visit[];
  formatDate: (date: string) => string;
  isFutureDate: (date: string) => boolean;
}

const VisitsContent: React.FC<VisitsContentProps> = ({ visits, formatDate, isFutureDate }) => {
  if (visits.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Aucune visite trouvée</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <Card 
          key={visit.id} 
          className={`glass-card overflow-hidden transition-all duration-200 hover:shadow-md ${
            visit.status === 'completed' 
              ? 'border-l-4 border-l-green-500' 
              : visit.status === 'missed' 
                ? 'border-l-4 border-l-red-500' 
                : 'border-l-4 border-l-yellow-500'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  {visit.status === 'completed' && <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                  {visit.status === 'missed' && <XCircle className="w-4 h-4 mr-2 text-red-500" />}
                  {visit.status === 'pending' && <CalendarIcon className="w-4 h-4 mr-2 text-yellow-500" />}
                  <h3 className="font-medium">{visit.storeName}</h3>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded mr-2">
                    {visit.storeId}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span>{visit.address}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-muted-foreground flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  <span>{formatDate(visit.date)}</span>
                </div>
                <span className={`text-xs mt-2 px-2 py-1 rounded-full ${
                  visit.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : visit.status === 'missed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {visit.status === 'completed' 
                    ? 'Complétée' 
                    : visit.status === 'missed' 
                      ? 'Manquée' 
                      : 'Planifiée'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VisitsList;
