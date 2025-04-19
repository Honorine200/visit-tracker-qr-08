
import React, { useEffect, useState } from 'react';
import { CalendarDays, Store, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface Assignment {
  id: string;
  commercial_id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
  commercial: {
    name: string;
  };
  stores: {
    name: string;
  }[];
}

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('visit_assignments')
        .select(`
          *,
          commercial:commercial_id (name)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;

      setAssignments(data || []);
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

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Store className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
        <p>Aucune assignation de visite pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="p-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-bisko-500" />
                  <span className="font-medium">
                    {assignment.commercial?.name || 'Commercial inconnu'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    Du {format(new Date(assignment.start_date), 'PP', { locale: fr })} au{' '}
                    {format(new Date(assignment.end_date), 'PP', { locale: fr })}
                  </span>
                </div>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full ${
                assignment.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {assignment.status === 'completed' ? 'Terminé' : 'En cours'}
              </div>
            </div>

            {assignment.notes && (
              <p className="text-sm text-muted-foreground">
                {assignment.notes}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AssignmentsList;
