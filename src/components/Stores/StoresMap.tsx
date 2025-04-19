
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './StoresMap.css';
import { supabase } from '@/integrations/supabase/client';
import L from 'leaflet';
import { getCurrentUser } from '@/utils/authUtils';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StoreType {
  id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  zone: string;
  contactname?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

const StoresMap: React.FC<{ stores?: StoreType[] }> = ({ stores: propStores }) => {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([14.7167, -17.4677]); // Dakar, Senegal
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (propStores) {
      setStores(propStores);
      setLoading(false);
      
      // If there are stores, center the map on the first one
      if (propStores.length > 0 && propStores[0].latitude && propStores[0].longitude) {
        try {
          const lat = parseFloat(propStores[0].latitude);
          const lng = parseFloat(propStores[0].longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            setCenter([lat, lng]);
          }
        } catch (e) {
          console.error('Error parsing coordinates:', e);
        }
      }
    } else {
      fetchStores();
    }
  }, [propStores]);

  const fetchStores = async () => {
    try {
      let query = supabase.from('stores').select('*');
      
      // If user is a commercial with a specific zone, filter the stores by zone
      if (currentUser && currentUser.role === 'commercial' && currentUser.zone) {
        query = query.eq('zone', currentUser.zone);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setStores(data);
        
        // Center map on first store
        if (data[0].latitude && data[0].longitude) {
          try {
            const lat = parseFloat(data[0].latitude);
            const lng = parseFloat(data[0].longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              setCenter([lat, lng]);
            }
          } catch (e) {
            console.error('Error parsing coordinates:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bisko-500"></div>
    </div>;
  }

  return (
    <div className="stores-map-container">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
        zoomControl={true}
        className="rounded-md border border-gray-200 shadow-sm"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {stores.map((store) => {
          // Parse coordinates (handle potential errors)
          let position: [number, number] | null = null;
          try {
            const lat = parseFloat(store.latitude);
            const lng = parseFloat(store.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              position = [lat, lng];
            }
          } catch (e) {
            console.error(`Error parsing coordinates for store ${store.id}:`, e);
          }
          
          return position ? (
            <Marker 
              key={store.id} 
              position={position}
            >
              <Popup>
                <div className="store-popup">
                  <h3 className="font-bold">{store.name}</h3>
                  <p className="text-sm text-gray-600">{store.address}</p>
                  {store.contactname && (
                    <p className="text-sm mt-2">
                      <strong>Contact:</strong> {store.contactname}
                    </p>
                  )}
                  {store.phone && (
                    <p className="text-sm">
                      <strong>Tel:</strong> {store.phone}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
};

export default StoresMap;
