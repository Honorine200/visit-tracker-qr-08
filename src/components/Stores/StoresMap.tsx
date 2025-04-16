import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './StoresMap.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import L from 'leaflet';

// Fix pour les icônes Leaflet qui ne s'affichent pas correctement
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Création d'un marqueur personnalisé avec fond jaune
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-6 h-6 text-gray-800 flex items-center justify-center bg-[#FEF7CD] rounded-full shadow-md border border-yellow-300">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Composant pour ajuster automatiquement la vue de la carte
const SetBoundsRectangle = ({ stores }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (stores.length > 0) {
      const bounds = L.latLngBounds(
        stores.map(store => [parseFloat(store.latitude), parseFloat(store.longitude)])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, stores]);
  
  return null;
};

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phone?: string;
  email?: string;
  contactName?: string;
  createdAt?: string;
}

interface StoresMapProps {
  stores: Store[];
}

const StoresMap: React.FC<StoresMapProps> = ({ stores }) => {
  const { toast } = useToast();
  const customIcon = createCustomIcon();

  // Filtrer les boutiques qui ont des coordonnées valides
  const storesWithCoordinates = stores.filter(
    store => store.latitude && store.longitude && 
    !isNaN(parseFloat(store.latitude)) && !isNaN(parseFloat(store.longitude))
  );

  // Centre par défaut (Paris, France)
  const defaultCenter = [48.864716, 2.349014];
  
  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-bisko-500" /> 
          Carte des boutiques
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {storesWithCoordinates.length} boutique{storesWithCoordinates.length > 1 ? 's' : ''} géolocalisée{storesWithCoordinates.length > 1 ? 's' : ''}
        </div>
      </CardHeader>
      <CardContent>
        {storesWithCoordinates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              Aucune boutique géolocalisée pour le moment.
              <br />
              Ajoutez des coordonnées à vos boutiques pour les voir sur la carte.
            </p>
          </div>
        ) : (
          <div className="h-[500px] w-full rounded-md overflow-hidden">
            <MapContainer 
              center={defaultCenter} 
              zoom={5} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              attributionControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {storesWithCoordinates.map((store) => (
                <Marker 
                  key={store.id}
                  position={[parseFloat(store.latitude), parseFloat(store.longitude)]}
                  icon={customIcon}
                >
                  <Popup className="leaflet-popup-custom">
                    <div className="p-2 bg-[#FEF7CD] rounded border border-yellow-300">
                      <h3 className="text-sm font-bold text-gray-800">{store.name}</h3>
                      <p className="text-xs text-gray-700">{store.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <SetBoundsRectangle stores={storesWithCoordinates} />
            </MapContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoresMap;
