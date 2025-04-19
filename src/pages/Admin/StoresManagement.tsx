
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Map, QrCode } from "lucide-react";
import StoresList from "@/components/Stores/StoresList";
import AddStoreDialog from "@/components/Stores/AddStoreDialog";
import ImportStoresFromExcel from "@/components/Stores/ImportStoresFromExcel";
import StoresMap from "@/components/Stores/StoresMap";
import StoresQRCodeGallery from "@/components/Stores/StoresQRCodeGallery";
import { supabase } from '@/integrations/supabase/client';

// Interface for the store type
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
  createdat: string;
  updatedat: string;
}

const StoresManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [showAddStoreDialog, setShowAddStoreDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStores();
    
    // Listen for storage events (for real-time updates)
    const handleStorageChange = () => {
      fetchStores();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStoreAdded = () => {
    fetchStores();
    setShowAddStoreDialog(false);
  };
  
  const handleImportComplete = () => {
    fetchStores();
    setShowImportDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Boutiques</h1>
          <p className="text-muted-foreground">Ajoutez, modifiez et suivez vos points de vente</p>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Boutiques</CardTitle>
            <CardDescription>
              {stores.length} boutiques enregistrées
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button onClick={() => setShowAddStoreDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une boutique
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="map">
                <Map className="h-4 w-4 mr-2" />
                Carte
              </TabsTrigger>
              <TabsTrigger value="qrcodes">
                <QrCode className="h-4 w-4 mr-2" />
                QR Codes
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <StoresList
                stores={stores}
                loading={loading}
                onStoreUpdated={fetchStores}
              />
            </TabsContent>
            
            <TabsContent value="map">
              <StoresMap stores={stores} />
            </TabsContent>
            
            <TabsContent value="qrcodes">
              <StoresQRCodeGallery stores={stores} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AddStoreDialog 
        open={showAddStoreDialog} 
        onClose={() => setShowAddStoreDialog(false)}
        onStoreAdded={handleStoreAdded}
      />
      
      <ImportStoresFromExcel
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};

export default StoresManagement;
