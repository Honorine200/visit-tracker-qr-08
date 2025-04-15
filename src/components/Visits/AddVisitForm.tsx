
import React, { useState, useEffect } from 'react';
import { Calendar, Store, User, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface StoreType {
  id: string;
  name: string;
  address: string;
}

const AddVisitForm: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load stores from localStorage
    const storedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(storedStores);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStore) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une boutique."
      });
      return;
    }
    
    setLoading(true);
    
    // Find the selected store
    const store = stores.find(s => s.id === selectedStore);
    
    // Create the visit record
    const visit = {
      id: `visit-${Date.now()}`,
      storeId: selectedStore,
      storeName: store?.name || "",
      date: new Date().toISOString(),
      notes: notes,
      agentName: "Commercial", // In a real app, this would come from the authenticated user
      status: "completed"
    };
    
    // Save to localStorage
    const existingVisits = JSON.parse(localStorage.getItem('visits') || '[]');
    const updatedVisits = [...existingVisits, visit];
    localStorage.setItem('visits', JSON.stringify(updatedVisits));
    
    // Trigger an event for the admin dashboard
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'visits',
      newValue: JSON.stringify(updatedVisits)
    }));
    
    // Reset form
    setSelectedStore("");
    setNotes("");
    
    // Show success message
    toast({
      title: "Visite enregistrée",
      description: `La visite a été enregistrée avec succès.`,
    });
    
    setLoading(false);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-bisko-500" /> 
          Enregistrer une visite
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store">Boutique visitée</Label>
            {stores.length === 0 ? (
              <div className="text-center py-4 border rounded-md">
                <Store className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Aucune boutique enregistrée</p>
                <p className="text-xs text-muted-foreground">Ajoutez d'abord une boutique</p>
              </div>
            ) : (
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger id="store">
                  <SelectValue placeholder="Sélectionner une boutique" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes de visite</Label>
            <Textarea
              id="notes"
              placeholder="Entrez vos notes concernant cette visite..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-bisko-500 hover:bg-bisko-600" 
            disabled={loading || !selectedStore}
          >
            {loading ? "Enregistrement..." : "Enregistrer la visite"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddVisitForm;
