
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Map as LeafletMap, TileLayer as LeafletTileLayer, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './StoresMap.css';

// Corriger l'icône de marqueur pour Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix pour les icônes Leaflet qui ne s'affichent pas correctement
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Créer un icône personnalisée pour les marqueurs de boutiques
const storeIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #FEF7CD; border: 2px solid #FBBF24; border-radius: 50%; width: 12px; height: 12px;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -6]
});

// This component will set the map view once it's loaded
const MapViewSetter = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([14.7167, -17.4677]); // Dakar
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Centrer la carte sur le premier magasin s'il y en a
    if (stores.length > 0) {
      const firstStore = stores[0];
      if (firstStore.latitude && firstStore.longitude) {
        setMapCenter([
          parseFloat(firstStore.latitude),
          parseFloat(firstStore.longitude)
        ]);
      }
    }
    setIsLoading(false);
  }, [stores]);

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
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '500px', width: '100%' }}
        zoomControl
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stores.map((store) => (
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
