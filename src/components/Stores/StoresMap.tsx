
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Store, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import './StoresMap.css';

// Define marker icon
const storeIcon = new L.Icon({
  iconUrl: '/placeholder.svg',
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  position: [number, number];
}

const StoresMap: React.FC = () => {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [mapPosition, setMapPosition] = useState<[number, number]>([14.7167, -17.4677]); // Default: Dakar
  const [selected, setSelected] = useState<string | null>(null);
  
  useEffect(() => {
    // Simuler le chargement de données
    setTimeout(() => {
      // Données factices pour démonstration
      const mockStores: StoreLocation[] = [
        {
          id: "store1",
          name: "Grand Marché de Dakar",
          address: "123 Rue Centrale, Dakar",
          position: [14.716, -17.438]
        },
        {
          id: "store2",
          name: "Supermarché Sahel",
          address: "45 Avenue des Nations, Dakar",
          position: [14.722, -17.445]
        },
        {
          id: "store3",
          name: "Boutique ABC",
          address: "78 Rue du Commerce, Dakar",
          position: [14.712, -17.456]
        },
        {
          id: "store4",
          name: "Mini Market Express",
          address: "15 Boulevard Maritime, Dakar",
          position: [14.705, -17.465]
        }
      ];
      
      setStores(mockStores);
    }, 1000);
  }, []);

  const handleSelectStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelected(storeId);
      setMapPosition(store.position);
    }
  };

  const handleMarkerClick = (storeId: string) => {
    setSelected(storeId);
  };

  if (stores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" /> Carte des boutiques
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Store className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Chargement de la carte...</h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" /> Carte des boutiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => handleSelectStore(store.id)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                selected === store.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-muted-foreground/20 hover:border-muted-foreground/30'
              }`}
            >
              {store.name}
            </button>
          ))}
        </div>
        
        <div className="h-[400px] rounded-md overflow-hidden border">
          <MapContainer
            center={mapPosition}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {stores.map((store) => (
              <Marker
                key={store.id}
                position={store.position}
                eventHandlers={{
                  click: () => handleMarkerClick(store.id),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-medium">{store.name}</h3>
                    <p className="text-xs text-muted-foreground">{store.address}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoresMap;
