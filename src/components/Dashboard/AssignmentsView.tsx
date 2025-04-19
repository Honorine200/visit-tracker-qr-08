
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarCheck2, Store } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/utils/authUtils';

interface Assignment {
  id: string;
  commercial_id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
  stores?: any[];
}

const AssignmentsView = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<any[]>([]);
  
  const currentUser = getCurrentUser();
  const userId = currentUser?.id;

  useEffect(() => {
    if (userId) {
      fetchAssignments();
      fetchStores();
    }
  }, [userId]);

  const fetchAssignments = async () => {
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data, error } = supabase
        .from('visit_assignments')
        .select();
      
      if (error) throw error;
      
      // Filtrer les assignations pour le commercial connecté
      const filteredAssignments = (data || []).filter(
        (a: any) => a.commercial_id === userId
      );
      
      setAssignments(filteredAssignments);
    } catch (error) {
      console.error('Erreur lors du chargement des assignations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStores = async () => {
    try {
      const { data, error } = supabase
        .from('stores')
        .select();
        
      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques:', error);
    }
  };
  
  // Associer les détails des boutiques aux assignations
  const assignmentsWithStoreDetails = assignments.map(assignment => {
    const storeDetails = (assignment.store_ids || []).map(storeId => {
      return stores.find(store => store.id === storeId);
    }).filter(Boolean);
    
    return {
      ...assignment,
      stores: storeDetails
    };
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarCheck2 className="h-5 w-5 text-bisko-600" /> Mes visites assignées
        </CardTitle>
        <CardDescription>
          Consultez vos visites à effectuer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignmentsWithStoreDetails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarCheck2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>Aucune assignation de visite pour le moment</p>
            </div>
          ) : (
            assignmentsWithStoreDetails.map(assignment => (
              <div 
                key={assignment.id} 
                className="border rounded-lg p-4 hover:border-bisko-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between mb-3">
                  <div>
                    <h3 className="font-medium">Période de visite</h3>
                    <p className="text-sm text-muted-foreground">
                      Du {format(new Date(assignment.start_date), 'PP', { locale: fr })} au{' '}
                      {format(new Date(assignment.end_date), 'PP', { locale: fr })}
                    </p>
                  </div>
                  <Badge 
                    variant={assignment.status === 'completed' ? "success" : "outline"}
                    className="mt-2 md:mt-0 self-start"
                  >
                    {assignment.status === 'completed' ? 'Terminée' : 'En cours'}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-1 mb-2">
                    <Store className="h-4 w-4" /> Boutiques à visiter ({assignment.stores?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {(assignment.stores || []).map(store => (
                      <div key={store.id} className="text-sm bg-gray-50 dark:bg-gray-800 rounded p-2">
                        <div className="font-medium">{store.name}</div>
                        <div className="text-muted-foreground text-xs">{store.address}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {assignment.notes && (
                  <div className="mt-3 border-t pt-2">
                    <h4 className="font-medium mb-1">Notes</h4>
                    <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentsView;
