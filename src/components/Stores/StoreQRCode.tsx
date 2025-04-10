
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface StoreData {
  id: string;
  name: string;
  address: string;
  latitude?: string;
  longitude?: string;
}

interface StoreQRCodeProps {
  store: StoreData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StoreQRCode: React.FC<StoreQRCodeProps> = ({ store, open, onOpenChange }) => {
  const { toast } = useToast();
  const qrRef = React.useRef<HTMLDivElement>(null);
  
  // Create store data for QR code
  const storeData = {
    storeId: store.id,
    name: store.name,
    address: store.address,
    zone: store.address.split(',').pop()?.trim() || '',
    ...(store.latitude && { latitude: store.latitude }),
    ...(store.longitude && { longitude: store.longitude }),
  };
  
  // Convert to JSON string for QR code
  const qrData = JSON.stringify(storeData);
  
  // Download QR code as PNG
  const downloadQR = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) {
      // If canvas is not found, fall back to SVG
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${store.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "QR code téléchargé",
        description: "Le QR code a été téléchargé au format SVG.",
      });
      return;
    }
    
    // Default canvas download
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = `qrcode-${store.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(image);
    
    toast({
      title: "QR code téléchargé",
      description: "Le QR code a été téléchargé au format PNG.",
    });
  };
  
  // Copy data to clipboard
  const copyData = () => {
    navigator.clipboard.writeText(qrData).then(() => {
      toast({
        title: "Données copiées",
        description: "Les données du QR code ont été copiées dans le presse-papier.",
      });
    }).catch(err => {
      console.error('Erreur lors de la copie:', err);
      toast({
        variant: "destructive",
        title: "Erreur de copie",
        description: "Impossible de copier les données dans le presse-papier.",
      });
    });
  };
  
  // Share QR code
  const shareQR = async () => {
    if (!navigator.share) {
      toast({
        variant: "destructive",
        title: "Partage non supporté",
        description: "Votre navigateur ne supporte pas l'API de partage.",
      });
      return;
    }
    
    try {
      await navigator.share({
        title: `QR Code - ${store.name}`,
        text: `QR Code pour la boutique ${store.name}`,
        // We can't directly share the QR code image this way
      });
      
      toast({
        title: "Partage en cours",
        description: "Les options de partage ont été ouvertes.",
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        variant: "destructive",
        title: "Erreur de partage",
        description: "Le partage a échoué ou a été annulé.",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-bisko-500" />
            <DialogTitle>QR Code de la boutique</DialogTitle>
          </div>
          <DialogDescription>
            Ce QR code contient les informations de la boutique {store.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div ref={qrRef} className="flex items-center justify-center my-4 p-4 bg-white rounded-lg">
          <QRCodeSVG 
            value={qrData}
            size={200}
            level="H" // High error correction level
            includeMargin={true}
            bgColor={"#FFFFFF"}
            fgColor={"#000000"}
            className="shadow-sm"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={downloadQR} 
            variant="outline" 
            className="flex items-center justify-center gap-1 text-xs"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
          <Button 
            onClick={shareQR} 
            variant="outline" 
            className="flex items-center justify-center gap-1 text-xs"
          >
            <Share className="h-4 w-4" />
            Partager
          </Button>
          <Button 
            onClick={copyData} 
            variant="outline" 
            className="flex items-center justify-center gap-1 text-xs"
          >
            <Copy className="h-4 w-4" />
            Copier
          </Button>
        </div>
        
        <DialogFooter className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground text-center w-full">
            <p>Ce QR code peut être scanné par l'application pour enregistrer une visite.</p>
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoreQRCode;
