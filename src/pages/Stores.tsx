
import React, { useState, useEffect } from 'react';
import { Store, MapPin, QrCode } from 'lucide-react';
import StoresList from '@/components/Stores/StoresList';
import StoreQRCode from '@/components/Stores/StoreQRCode';
import StoresQRCodeGallery from '@/components/Stores/StoresQRCodeGallery';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
}

const Stores: React.FC = () => {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrGalleryOpen, setQrGalleryOpen] = useState(false);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  // Load first store for QR code demo
  useEffect(() => {
    const storedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(storedStores);
  }, []);

  const handleGenerateQRCode = () => {
    if (stores.length > 0) {
      setSelectedStore(stores[0]);
      setQrDialogOpen(true);
    }
  };

  const handleShowAllQRCodes = () => {
    setQrGalleryOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-bisko-500" />
          <h1 className="text-2xl font-bold">Gestion des boutiques</h1>
        </div>
        {stores.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-bisko-600 border-bisko-200 hover:bg-bisko-50"
              onClick={handleShowAllQRCodes}
            >
              <QrCode className="h-4 w-4" />
              Tous les QR codes
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-bisko-600 border-bisko-200 hover:bg-bisko-50"
              onClick={handleGenerateQRCode}
            >
              <QrCode className="h-4 w-4" />
              Générer QR Code
            </Button>
          </div>
        )}
      </div>
      
      <Card className="border-none shadow-md">
        <CardHeader className="bg-bisko-50 dark:bg-bisko-900/30 rounded-t-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-bisko-500" />
            <CardTitle className="text-xl font-medium text-bisko-700 dark:text-bisko-300">
              Boutiques & Emplacements
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <StoresList />
        </CardContent>
      </Card>
      
      {selectedStore && (
        <StoreQRCode 
          store={selectedStore}
          open={qrDialogOpen}
          onOpenChange={setQrDialogOpen}
        />
      )}

      <StoresQRCodeGallery 
        stores={stores}
        open={qrGalleryOpen}
        onOpenChange={setQrGalleryOpen}
      />
    </div>
  );
};

export default Stores;
