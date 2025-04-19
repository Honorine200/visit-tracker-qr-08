
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { usersManager, User } from '@/utils/usersUtils';

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
    loadCommercials();
    fetchStores();
  }, [isOpen]);

  const loadCommercials = () => {
    try {
      // Get all users from local storage
      const allUsers = usersManager.getAllUsers();
      
      // Filter for commercial users only
      const commercialUsers = allUsers.filter(user => user.role === 'commercial' && user.status === 'active');
      
      // Map them to the format needed for the dropdown
      const mappedCommercials = commercialUsers.map(user => ({
        id: user.id,
        name: user.name
      }));
      
      setCommercials(mappedCommercials);
      
      console.log('Commercials loaded:', mappedCommercials);
    } catch (error) {
      console.error('Error loading commercials:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des commerciaux."
      });
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des boutiques."
      });
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
      // Create the assignment
      const { error } = await supabase
        .from('visit_assignments')
        .insert({
          commercial_id: selectedCommercial,
          store_ids: selectedStores,
          start_date: startDate,
          end_date: endDate,
          notes,
          status: 'pending',
          created_by: 'admin' // TODO: Use actual admin ID
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'assignation a été créée avec succès."
      });

      // Close the dialog and reset form
      setIsOpen(false);
      setSelectedCommercial('');
      setSelectedStores([]);
      setStartDate('');
      setEndDate('');
      setNotes('');
      
      // Trigger window storage event to update other components
      window.dispatchEvent(new Event('storage'));
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
              {commercials.length > 0 ? (
                commercials.map((commercial) => (
                  <option key={commercial.id} value={commercial.id}>
                    {commercial.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Aucun commercial disponible</option>
              )}
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
              {stores.length > 0 ? (
                stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Aucune boutique disponible</option>
              )}
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
