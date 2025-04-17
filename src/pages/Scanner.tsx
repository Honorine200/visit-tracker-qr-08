
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '@/components/Scanner/QRScanner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Store, MapPin, CalendarIcon, AlertCircle } from 'lucide-react';
import { storesManager } from '@/utils/localStorageUtils';

interface StoreData {
  storeId: string;
  name: string;
  address: string;
  zone: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const Scanner: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanned, setIsScanned] = useState(false);
  const [scannedData, setScannedData] = useState<StoreData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInvalidQR, setIsInvalidQR] = useState(false);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleScanSuccess = (data: string, location: GeolocationCoordinates | null) => {
    try {
      // Parser les données QR
      const parsedData = JSON.parse(data) as StoreData;
      
      // Vérifier si le QR code correspond à une boutique enregistrée
      const stores = storesManager.getAll();
      const storeExists = stores.some(store => store.id === parsedData.storeId);
      
      if (!storeExists) {
        console.log("QR code non reconnu:", parsedData);
        setIsInvalidQR(true);
        toast({
          variant: "destructive",
          title: "QR Code non reconnu",
          description: "Cette boutique n'est pas enregistrée dans le système.",
        });
        return;
      }
      
      setScannedData(parsedData);
      
      // Enregistrer les données de localisation
      if (location) {
        setLocationData({
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        });
      }
      
      setIsScanned(true);
      setIsInvalidQR(false);
      
      toast({
        title: "QR Code scanné avec succès",
        description: `Boutique identifiée: ${parsedData.name}`,
      });
    } catch (error) {
      console.error('Erreur lors du traitement des données QR:', error);
      setIsInvalidQR(true);
      toast({
        variant: "destructive",
        title: "Erreur de scan",
        description: "Le QR code n'est pas valide ou ne contient pas les informations attendues."
      });
    }
  };
  
  const handleConfirmVisit = () => {
    setIsProcessing(true);
    
    // Simuler l'enregistrement de la visite
    setTimeout(() => {
      // Enregistrer la visite (simulé)
      const visitData = {
        id: `visit-${Date.now()}`,
        storeId: scannedData?.storeId,
        storeName: scannedData?.name,
        date: new Date().toISOString(),
        location: locationData,
        status: 'completed'
      };
      
      // Stocker dans localStorage (pour la démo)
      const existingVisits = localStorage.getItem('visits');
      const visits = existingVisits ? JSON.parse(existingVisits) : [];
      visits.push(visitData);
      localStorage.setItem('visits', JSON.stringify(visits));
      
      setIsProcessing(false);
      
      toast({
        title: "Visite enregistrée",
        description: "Votre visite a été enregistrée avec succès."
      });
      
      // Rediriger vers le tableau de bord
      navigate('/dashboard');
    }, 1500);
  };
  
  const handleCancelScan = () => {
    setIsScanned(false);
    setScannedData(null);
    setLocationData(null);
    setIsInvalidQR(false);
  };
  
  const handleRetryScan = () => {
    setIsInvalidQR(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <div className="inline-flex self-start px-2.5 py-1 bg-bisko-100 dark:bg-bisko-900 rounded-full text-xs font-medium text-bisko-700 dark:text-bisko-300 mb-1">
          Scanner
        </div>
        <h1 className="text-2xl font-bold">Scanner un QR Code</h1>
        <p className="text-muted-foreground">Scannez le QR code d'une boutique pour enregistrer votre visite</p>
      </div>
      
      {!isScanned && !isInvalidQR ? (
        <QRScanner onScanSuccess={handleScanSuccess} />
      ) : isInvalidQR ? (
        <Card className="glass-card animate-slide-up">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-16 w-16 text-destructive mb-2" />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-destructive">QR Code non reconnu</h2>
              <p className="text-sm text-muted-foreground mt-3">
                Ce QR code n'est pas associé à une boutique enregistrée dans le système.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                onClick={handleRetryScan} 
                className="w-full"
              >
                Réessayer le scan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card animate-slide-up">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold">{scannedData?.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">ID: {scannedData?.storeId}</p>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-start">
                <Store className="w-5 h-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Boutique</p>
                  <p className="text-sm text-muted-foreground">{scannedData?.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">{scannedData?.address}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarIcon className="w-5 h-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date et heure</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {locationData && (
                <div className="px-3 py-2 bg-bisko-50 dark:bg-bisko-950/50 rounded-lg mt-2">
                  <p className="text-xs text-muted-foreground">
                    Localisation capturée avec une précision de {Math.round(locationData.accuracy)} mètres
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                onClick={handleConfirmVisit} 
                className="w-full bg-bisko-500 hover:bg-bisko-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Traitement en cours..." : "Confirmer la visite"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancelScan}
                className="w-full"
                disabled={isProcessing}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Scanner;
