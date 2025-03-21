
import React, { useState, useEffect, useRef } from 'react';
import { Camera, XCircle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface QRScannerProps {
  onScanSuccess: (data: string, location: GeolocationCoordinates | null) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null);
  const { toast } = useToast();
  
  // Demander l'accès à la caméra
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setHasCameraPermission(true);
        
        // Simuler la détection d'un QR code pour la démo
        setTimeout(() => {
          const fakeQRData = JSON.stringify({
            storeId: 'STORE123',
            name: 'Boutique Example',
            address: '123 rue de la Demo, Paris',
            zone: 'Paris'
          });
          
          handleScanSuccess(fakeQRData);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Erreur d'accès à la caméra",
        description: "Veuillez autoriser l'accès à votre caméra pour scanner les QR codes."
      });
    }
  };
  
  // Obtenir la géolocalisation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position.coords);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          toast({
            variant: "destructive",
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position actuelle."
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation."
      });
    }
  };
  
  // Simuler une réussite de scan
  const handleScanSuccess = (data: string) => {
    // Arrrêter la caméra
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    
    // Appeler le callback avec les données du QR code et la localisation
    onScanSuccess(data, currentLocation);
  };
  
  // Arrêter le scanner
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };
  
  // Obtenir la géolocalisation au chargement
  useEffect(() => {
    getLocation();
    
    return () => {
      // Nettoyage: arrêter la caméra si composant démonté
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  if (hasCameraPermission === false) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardContent className="p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-lg font-medium">Accès caméra refusé</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Veuillez autoriser l'accès à votre caméra dans les paramètres de votre navigateur.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className={`qr-scanner-container ${isScanning ? 'h-80' : 'h-0 overflow-hidden'}`}>
        {isScanning && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="qr-scanner-targeting">
              <div className="qr-scanner-target"></div>
            </div>
            <Button
              variant="secondary"
              onClick={stopScanner}
              className="absolute top-4 right-4 rounded-full p-2 h-10 w-10"
              aria-label="Arrêter le scan"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      
      {!isScanning && (
        <Card className="glass-card transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6 text-center">
            <QrCode className="mx-auto h-16 w-16 text-bisko-400" />
            <h3 className="mt-4 text-xl font-medium">Scanner un QR Code</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Positionnez l'appareil photo sur le QR code de la boutique pour enregistrer votre visite.
            </p>
            <Button
              onClick={startScanner}
              className="mt-4 w-full bg-bisko-500 hover:bg-bisko-600 scan-btn-pulse"
            >
              <Camera className="mr-2 h-4 w-4" />
              Lancer le scanner
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
