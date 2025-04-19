
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from '@/utils/authUtils';
import { Calendar, MapPin, Store } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usersManager } from '@/utils/usersUtils';

interface Assignment {
  id: string;
  commercial_id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
}

const AssignmentsView = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stores, setStores] = useState<Record<string, Store>>({});
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  
  useEffect(() => {
    if (currentUser) {
      fetchAssignments();
      fetchStores();
    }
  }, [currentUser]);

  const fetchAssignments = async () => {
    if (!currentUser) return;
    
    try {
      // Get user ID from users manager
      const userEmail = currentUser.email;
      const user = usersManager.getUserByEmail(userEmail);
      
      if (!user) {
        console.error('User not found in usersManager:', userEmail);
        setLoading(false);
        return;
      }
      
      console.log('Fetching assignments for user ID:', user.id);
      
      // Fetch assignments for the current user based on their ID in usersManager
      const { data, error } = await supabase
        .from('visit_assignments')
        .select('*')
        .eq('commercial_id', user.id);
      
      if (error) throw error;
      
      console.log('Assignments fetched:', data);
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('id, name, address');
      
      if (error) throw error;
      
      const storeMap: Record<string, Store> = {};
      (data || []).forEach(store => {
        storeMap[store.id] = store;
      });
      
      setStores(storeMap);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Assignations de Visites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-t-bisko-500 border-bisko-200 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Assignations de Visites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>Aucune assignation de visite pour le moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Assignations de Visites</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  Du {format(new Date(assignment.start_date), 'PP', { locale: fr })} au{' '}
                  {format(new Date(assignment.end_date), 'PP', { locale: fr })}
                </span>
              </div>
              
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  assignment.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {assignment.status === 'completed' ? 'Terminée' : 'En cours'}
                </span>
              </div>
              
              {assignment.notes && (
                <div className="mb-3 text-sm text-muted-foreground">
                  <p>{assignment.notes}</p>
                </div>
              )}
              
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Store className="w-4 h-4" /> Boutiques à visiter:
                </h4>
                <div className="grid gap-2">
                  {assignment.store_ids.map((storeId) => (
                    <div key={storeId} className="bg-muted p-2 rounded text-sm">
                      <div className="font-medium">{stores[storeId]?.name || 'Boutique inconnue'}</div>
                      {stores[storeId]?.address && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {stores[storeId].address}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" onClick={() => navigate('/visits')} className="w-full">
                  Gérer mes visites
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentsView;
