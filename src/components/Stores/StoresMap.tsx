
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './StoresMap.css';
import { supabase } from '@/integrations/supabase/client';

// Configuration des icônes Leaflet
const storeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface StoreData {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phone?: string;
  email?: string;
  contactName?: string;
  notes?: string;
  createdAt: string;
}

interface StoresMapProps {
  stores: StoreData[];
  onStoreSelect?: (store: StoreData) => void;
}

const StoresMap: React.FC<StoresMapProps> = ({ stores, onStoreSelect }) => {
  const [mapZoom] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [realTimeStores, setRealTimeStores] = useState<StoreData[]>(stores);
  const defaultCenter: [number, number] = [14.7167, -17.4677]; // Dakar

  useEffect(() => {
    setRealTimeStores(stores);
    setIsLoading(false);
  }, [stores]);

  // Configuration des mises à jour en temps réel
  useEffect(() => {
    const channel = supabase.channel('stores-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'stores'
      }, (payload) => {
        console.log('Real-time store update:', payload);
        
        switch(payload.eventType) {
          case 'INSERT':
            setRealTimeStores(prev => [...prev, payload.new as StoreData]);
            break;
          case 'UPDATE':
            setRealTimeStores(prev => 
              prev.map(store => 
                store.id === payload.new.id ? payload.new as StoreData : store
              )
            );
            break;
          case 'DELETE':
            setRealTimeStores(prev => 
              prev.filter(store => store.id !== payload.old.id)
            );
            break;
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleStoreClick = (store: StoreData) => {
    if (onStoreSelect) {
      onStoreSelect(store);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-lg">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={defaultCenter}
        zoom={mapZoom}
        style={{ height: '500px', width: '100%' }}
        zoomControl
        className="z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {realTimeStores.map((store) => (
          <Marker
            key={store.id}
            position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
            icon={storeIcon}
            eventHandlers={{
              click: () => handleStoreClick(store),
            }}
          >
            <Popup>
              <div className="store-popup p-0">
                <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-2">
                  <h3 className="font-bold text-sm text-yellow-800">{store.name}</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-600 mb-2">{store.address}</p>
                  {store.phone && (
                    <p className="text-xs">
                      <span className="font-semibold">Tél:</span> {store.phone}
                    </p>
                  )}
                  {store.contactName && (
                    <p className="text-xs">
                      <span className="font-semibold">Contact:</span> {store.contactName}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default StoresMap;
