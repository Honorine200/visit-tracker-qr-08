
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Store, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usersManager } from '@/utils/usersUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Assignment {
  id: string;
  commercial_id: string;
  store_ids: string[];
  start_date: string;
  end_date: string;
  status: string;
  notes?: string;
}

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commercialNames, setCommercialNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAssignments();
    loadCommercialNames();
    
    // Listen for storage events to reload data
    const handleStorageChange = () => {
      fetchAssignments();
      loadCommercialNames();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadCommercialNames = () => {
    const allUsers = usersManager.getAllUsers();
    const commercials = allUsers.reduce((acc: Record<string, string>, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});
    setCommercialNames(commercials);
  };

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('visit_assignments')
        .select();

      if (error) throw error;
      console.log('Assignments loaded:', data);
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

  return (
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p>Aucune assignation de visite pour le moment</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commercial</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {commercialNames[assignment.commercial_id] || 'Commercial inconnu'}
                  </div>
                </TableCell>
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
    </div>
  );
};

export default AssignmentsList;
