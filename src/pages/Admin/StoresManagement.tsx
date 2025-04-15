
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddStoreDialog from '@/components/Stores/AddStoreDialog';
import StoreQRCode from '@/components/Stores/StoreQRCode';
import { 
  Store, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ListFilter, 
  Map, 
  QrCode 
} from 'lucide-react';

interface StoreType {
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

const StoresManagement: React.FC = () => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<StoreType[]>([]);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("list");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [zones, setZones] = useState<string[]>([]);

  // Load stores from localStorage
  useEffect(() => {
    setTimeout(() => {
      const storedStores = JSON.parse(localStorage.getItem('stores') || '[]');
      setStores(storedStores);
      
      // Extract unique zones from store addresses
      const extractedZones = Array.from(
        new Set(
          storedStores.map((store: StoreType) => {
            const parts = store.address.split(',');
            return parts[parts.length - 1].trim();
          })
        )
      );
      setZones(extractedZones);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Filter stores based on search term and zone
  useEffect(() => {
    let filtered = stores;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (store.contactName && store.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply zone filter
    if (selectedZone !== "all") {
      filtered = filtered.filter(store => {
        const parts = store.address.split(',');
        const storeZone = parts[parts.length - 1].trim();
        return storeZone === selectedZone;
      });
    }
    
    setFilteredStores(filtered);
  }, [stores, searchTerm, selectedZone]);

  // Handle store added
  const handleStoreAdded = (newStore: StoreType) => {
    setStores(prevStores => [...prevStores, newStore]);
    
    // Check if we need to add a new zone
    const parts = newStore.address.split(',');
    const newZone = parts[parts.length - 1].trim();
    if (!zones.includes(newZone)) {
      setZones(prev => [...prev, newZone]);
    }
  };

  // Open Google Maps with the location
  const openInMaps = (latitude?: string, longitude?: string) => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  // Open QR code dialog
  const openQRDialog = (store: StoreType) => {
    setSelectedStore(store);
    setQrDialogOpen(true);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return "Date inconnue";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Store className="h-5 w-5" /> Gestion des boutiques
            </CardTitle>
            <CardDescription>
              Gérez l'ensemble des boutiques de votre réseau
            </CardDescription>
          </div>
          <AddStoreDialog onStoreAdded={handleStoreAdded} />
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <TabsList>
                <TabsTrigger value="list">Liste</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une boutique..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative w-full md:w-48">
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                  >
                    <option value="all">Toutes les zones</option>
                    {zones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                  <ListFilter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <TabsContent value="list" className="mt-4">
              {filteredStores.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStores.map((store) => (
                    <Card key={store.id} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-bisko-500" />
                            <h3 className="text-base font-semibold">{store.name}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs flex items-center gap-1 h-7"
                              onClick={() => openQRDialog(store)}
                            >
                              <QrCode className="h-3 w-3" />
                              QR
                            </Button>
                            {store.latitude && store.longitude && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs flex items-center gap-1 h-7"
                                onClick={() => openInMaps(store.latitude, store.longitude)}
                              >
                                <Map className="h-3 w-3" />
                                Carte
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
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                            <span>Créée le {formatDate(store.createdAt)}</span>
                            {(store.latitude || store.longitude) && (
                              <Badge variant="outline" className="text-xs">
                                Géolocalisée
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-3xl font-bold text-bisko-600">{stores.length}</div>
                        <div className="text-sm text-muted-foreground">Boutiques au total</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-3xl font-bold text-bisko-600">{zones.length}</div>
                        <div className="text-sm text-muted-foreground">Zones géographiques</div>
                      </div>
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="text-3xl font-bold text-bisko-600">
                          {stores.filter(s => s.latitude && s.longitude).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Boutiques géolocalisées</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Répartition par zone</h3>
                      <div className="space-y-3">
                        {zones.map((zone) => {
                          const count = stores.filter(store => {
                            const parts = store.address.split(',');
                            return parts[parts.length - 1].trim() === zone;
                          }).length;
                          const percentage = Math.round((count / stores.length) * 100);
                          
                          return (
                            <div key={zone} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{zone}</span>
                                <span>{count} boutiques ({percentage}%)</span>
                              </div>
                              <div className="bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-bisko-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {selectedStore && (
        <StoreQRCode 
          store={selectedStore}
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
        />
      )}
    </div>
  );
};

export default StoresManagement;
