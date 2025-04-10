
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Phone, Mail, User, MapPin, Search, Map, QrCode } from 'lucide-react';
import AddStoreDialog from './AddStoreDialog';
import StoreQRCode from './StoreQRCode';

interface Store {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contactName?: string;
  latitude?: string;
  longitude?: string;
  notes?: string;
  createdAt: string;
}

const StoresList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

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

  // Open Google Maps with the location
  const openInMaps = (latitude?: string, longitude?: string) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  // Open QR code dialog
  const openQRDialog = (store: Store) => {
    setSelectedStore(store);
    setQrDialogOpen(true);
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
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs flex items-center gap-1"
                        onClick={() => openQRDialog(store)}
                      >
                        <QrCode className="h-3 w-3" />
                        QR Code
                      </Button>
                      {store.latitude && store.longitude && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs flex items-center gap-1"
                          onClick={() => openInMaps(store.latitude, store.longitude)}
                        >
                          <Map className="h-3 w-3" />
                          Voir sur la carte
                        </Button>
                      )}
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

                    {(store.latitude || store.longitude) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                        <MapPin className="h-3 w-3" />
                        <span>Coordonnées: {store.latitude || '?'}, {store.longitude || '?'}</span>
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
      
      {selectedStore && (
        <StoreQRCode 
          store={selectedStore}
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
        />
      )}
    </Card>
  );
};

export default StoresList;
