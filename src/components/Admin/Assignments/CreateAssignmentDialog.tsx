
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Commercial {
  id: string;
  name: string;
}

interface Store {
  id: string;
  name: string;
}

const CreateAssignmentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [commercials, setCommercials] = useState<Commercial[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedCommercial, setSelectedCommercial] = useState('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCommercials();
    fetchStores();
  }, []);

  const fetchCommercials = async () => {
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'commercial');

      if (userRoles) {
        const userIds = userRoles.map(role => role.user_id);
        const { data: users } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', userIds);

        setCommercials(users?.map(user => ({
          id: user.id,
          name: user.full_name
        })) || []);
      }
    } catch (error) {
      console.error('Error fetching commercials:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const { data } = await supabase
        .from('stores')
        .select('id, name');
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCommercial || selectedStores.length === 0 || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('visit_assignments')
        .insert({
          commercial_id: selectedCommercial,
          store_ids: selectedStores,
          start_date: startDate,
          end_date: endDate,
          notes,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'assignation a été créée avec succès."
      });

      setIsOpen(false);
      // Reset form
      setSelectedCommercial('');
      setSelectedStores([]);
      setStartDate('');
      setEndDate('');
      setNotes('');
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'assignation."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle assignation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle assignation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commercial">Commercial</Label>
            <select
              id="commercial"
              className="w-full border rounded-md p-2"
              value={selectedCommercial}
              onChange={(e) => setSelectedCommercial(e.target.value)}
              required
            >
              <option value="">Sélectionner un commercial</option>
              {commercials.map((commercial) => (
                <option key={commercial.id} value={commercial.id}>
                  {commercial.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stores">Boutiques</Label>
            <select
              id="stores"
              className="w-full border rounded-md p-2"
              multiple
              value={selectedStores}
              onChange={(e) => setSelectedStores(Array.from(e.target.selectedOptions, option => option.value))}
              required
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes optionnelles..."
            />
          </div>

          <Button type="submit" className="w-full">
            Créer l'assignation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentDialog;
