
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Temporary token - in production, this should be stored in environment variables
// and retrieved from Supabase
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHc4OGVseWQwazZuMm1rNjNwYjY5bnRqIn0.a3bBvB7L_QQj42IAHCxTKw";

interface Store {
  id: string;
  name: string;
  address: string;
  latitude?: string;
  longitude?: string;
}

interface StoresMapProps {
  stores: Store[];
}

const StoresMap: React.FC<StoresMapProps> = ({ stores }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Filter stores that have valid coordinates
  const storesWithCoordinates = stores.filter(
    store => store.latitude && store.longitude && 
    !isNaN(parseFloat(store.latitude)) && !isNaN(parseFloat(store.longitude))
  );

  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [2.349014, 48.864716], // Default to Paris, France
        zoom: 5
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Erreur d'initialisation de la carte",
        description: "Veuillez vérifier votre connexion internet et réessayer.",
        variant: "destructive"
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [toast]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for stores with coordinates
    if (storesWithCoordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();

      storesWithCoordinates.forEach(store => {
        if (!store.latitude || !store.longitude) return;
        
        const lng = parseFloat(store.longitude);
        const lat = parseFloat(store.latitude);
        
        // Create a custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `<div class="w-6 h-6 text-white flex items-center justify-center bg-bisko-500 rounded-full shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7"/></svg>
        </div>`;
        
        // Add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div>
                  <h3 class="text-sm font-bold">${store.name}</h3>
                  <p class="text-xs">${store.address}</p>
                </div>
              `)
          )
          .addTo(map.current!);
        
        markersRef.current.push(marker);
        bounds.extend([lng, lat]);
      });

      // Fit map to bounds with padding
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
    }
  }, [storesWithCoordinates, mapLoaded]);

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
          <div ref={mapContainer} className="h-[500px] w-full rounded-md overflow-hidden" />
        )}
      </CardContent>
    </Card>
  );
};

export default StoresMap;
