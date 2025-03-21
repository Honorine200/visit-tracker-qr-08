
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Phone, Mail, User, MapPin, Search } from 'lucide-react';
import AddStoreDialog from './AddStoreDialog';

interface Store {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contactName?: string;
  notes?: string;
  createdAt: string;
}

const StoresList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  // Load stores from localStorage
  useEffect(() => {
    const storedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(storedStores);
  }, []);

  // Filter stores based on search term
  useEffect(() => {
    const filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.contactName && store.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStores(filtered);
  }, [stores, searchTerm]);

  // Handle store added
  const handleStoreAdded = (newStore: Store) => {
    setStores(prevStores => [...prevStores, newStore]);
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-bisko-600">Boutiques</CardTitle>
        <AddStoreDialog onStoreAdded={handleStoreAdded} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une boutique..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {stores.length === 0 ? (
              <div className="space-y-3">
                <Store className="h-10 w-10 mx-auto text-muted-foreground/50" />
                <div>Aucune boutique enregistrée</div>
                <div className="text-sm">Ajoutez votre première boutique en cliquant sur le bouton ci-dessus</div>
              </div>
            ) : (
              <div>Aucune boutique ne correspond à votre recherche</div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStores.map((store) => (
              <Card key={store.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-bisko-500" />
                      <h3 className="text-lg font-semibold">{store.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>
                    
                    {store.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                    
                    {store.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{store.email}</span>
                      </div>
                    )}
                    
                    {store.contactName && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{store.contactName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      {filteredStores.length > 0 && (
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Affichage de {filteredStores.length} boutique{filteredStores.length > 1 ? 's' : ''}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default StoresList;
