
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Store } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Assignment {
  id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
  stores: {
    id: string;
    name: string;
  }[];
}

const AssignmentsView = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('visit_assignments')
        .select(`
          id,
          store_ids,
          start_date,
          end_date,
          status,
          notes
        `)
        .eq('commercial_id', userData.user.id);

      if (error) throw error;

      // Fetch store details for each assignment
      const assignmentsWithStores = await Promise.all((data || []).map(async (assignment) => {
        const { data: storesData } = await supabase
          .from('stores')
          .select('id, name')
          .in('id', assignment.store_ids);
        
        return {
          ...assignment,
          stores: storesData || []
        };
      }));

      setAssignments(assignmentsWithStores);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-8 h-8 border-4 border-t-bisko-500 border-bisko-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mes visites assignées</CardTitle>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>Aucune visite assignée pour le moment</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Boutiques</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Du {format(new Date(assignment.start_date), 'PP', { locale: fr })} au{' '}
                        {format(new Date(assignment.end_date), 'PP', { locale: fr })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {assignment.stores.map((store, index) => (
                          <span key={store.id} className="text-sm">
                            {store.name}{index < assignment.stores.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assignment.status === 'completed' ? 'Terminée' : 'En cours'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {assignment.notes || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentsView;
