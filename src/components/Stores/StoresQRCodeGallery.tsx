
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Search, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Store {
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

interface StoresQRCodeGalleryProps {
  stores: Store[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StoresQRCodeGallery: React.FC<StoresQRCodeGalleryProps> = ({ 
  stores, 
  open, 
  onOpenChange 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createStoreData = (store: Store) => {
    return {
      storeId: store.id,
      name: store.name,
      address: store.address,
      zone: store.address.split(',').pop()?.trim() || '',
      latitude: store.latitude,
      longitude: store.longitude,
    };
  };

  const openQRDialog = (store: Store) => {
    setSelectedStore(store);
    setQrDialogOpen(true);
  };

  const downloadQR = (store: Store) => {
    // Create an off-screen canvas
    const canvas = document.createElement('canvas');
    const storeData = JSON.stringify(createStoreData(store));
    
    // Create QR code on canvas
    const qr = document.createElement('div');
    qr.style.position = 'absolute';
    qr.style.left = '-9999px';
    document.body.appendChild(qr);
    
    // Render QR code
    const reactRoot = document.createElement('div');
    qr.appendChild(reactRoot);
    
    // We're using an SVG QR code, so we need to convert it to a canvas/image
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    
    // Use the ReactDOM to render the QRCodeSVG
    const qrCodeSvg = document.querySelector(`#qr-${store.id} svg`);
    if (qrCodeSvg) {
      const svgClone = qrCodeSvg.cloneNode(true) as SVGElement;
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
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
        description: `Le QR code de ${store.name} a été téléchargé au format SVG.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le QR code.",
      });
    }
    
    // Clean up
    document.body.removeChild(qr);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-bisko-500" />
            <DialogTitle className="text-xl">QR Codes de toutes les boutiques</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une boutique..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune boutique ne correspond à votre recherche
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Boutique</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => {
                const storeData = JSON.stringify(createStoreData(store));
                
                return (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.address}</div>
                    </TableCell>
                    <TableCell>
                      <div id={`qr-${store.id}`} className="flex items-center justify-center p-2 bg-white rounded-lg">
                        <QRCodeSVG 
                          value={storeData}
                          size={100}
                          level="H"
                          includeMargin={true}
                          bgColor={"#FFFFFF"}
                          fgColor={"#000000"}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => downloadQR(store)}
                        >
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      {selectedStore && (
        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>QR Code de {selectedStore.name}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center my-4 p-4 bg-white rounded-lg">
              <QRCodeSVG 
                value={JSON.stringify(createStoreData(selectedStore))}
                size={200}
                level="H"
                includeMargin={true}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default StoresQRCodeGallery;
