
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

interface ImportedStore {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contactName?: string;
  latitude: string;
  longitude: string;
  notes?: string;
}

interface ImportStoresProps {
  onImportComplete: (stores: any[]) => void;
}

const ImportStoresFromExcel: React.FC<ImportStoresProps> = ({ onImportComplete }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportedStore[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'preview' | 'importing' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed", e.target.files);
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setErrorMessage('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)');
      setImportStatus('error');
      return;
    }
    
    setFile(selectedFile);
    processExcelFile(selectedFile);
  };

  const handleSelectFileClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processExcelFile = async (file: File) => {
    try {
      setImportStatus('importing');
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert Excel data to JSON
      const jsonData = XLSX.utils.sheet_to_json<ImportedStore>(worksheet);
      
      // Validate data format
      const validatedData = validateData(jsonData);
      
      setPreview(validatedData);
      setImportStatus('preview');
    } catch (err) {
      console.error('Error processing Excel file:', err);
      setErrorMessage("Une erreur est survenue lors du traitement du fichier. Vérifiez le format du fichier Excel.");
      setImportStatus('error');
    }
  };

  const validateData = (data: any[]): ImportedStore[] => {
    // Basic validation - check if each entry has the required fields
    const validData = data.filter(item => {
      if (!item.name || !item.address || !item.latitude || !item.longitude) {
        return false;
      }
      return true;
    });
    
    // Map to expected format
    return validData.map(item => ({
      name: item.name,
      address: item.address,
      phone: item.phone || undefined,
      email: item.email || undefined,
      contactName: item.contactName || item.contact_name || undefined,
      latitude: item.latitude ? String(item.latitude) : '',
      longitude: item.longitude ? String(item.longitude) : '',
      notes: item.notes || undefined
    }));
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setErrorMessage("Aucune donnée valide à importer.");
      setImportStatus('error');
      return;
    }

    try {
      // Create store objects with IDs and timestamps
      const storesToImport = preview.map(store => ({
        id: `store-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        ...store,
        createdAt: new Date().toISOString()
      }));

      // Get existing stores from localStorage
      const existingStores = JSON.parse(localStorage.getItem('stores') || '[]');
      const updatedStores = [...existingStores, ...storesToImport];
      
      // Save to localStorage
      localStorage.setItem('stores', JSON.stringify(updatedStores));
      
      // Trigger event for store updates
      window.dispatchEvent(new Event('storage'));
      
      // Set last sync time
      const now = new Date().toISOString();
      localStorage.setItem('lastStoreSync', now);

      // Show success message
      toast({
        title: "Importation réussie",
        description: `${storesToImport.length} boutiques ont été importées avec succès.`,
      });
      
      // Notify parent component
      onImportComplete(storesToImport);
      
      // Reset state and close dialog
      setImportStatus('success');
      setTimeout(() => {
        setOpen(false);
        setFile(null);
        setPreview([]);
        setImportStatus('idle');
      }, 1500);
    } catch (err) {
      console.error('Error importing stores:', err);
      setErrorMessage("Une erreur est survenue lors de l'importation des boutiques.");
      setImportStatus('error');
    }
  };
  
  const resetImport = () => {
    setFile(null);
    setPreview([]);
    setImportStatus('idle');
    setErrorMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 whitespace-nowrap">
          <FileSpreadsheet className="h-4 w-4" />
          <span>Importer Excel</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-bisko-500" />
            <DialogTitle>Importer des boutiques depuis Excel</DialogTitle>
          </div>
          <DialogDescription>
            Sélectionnez un fichier Excel contenant la liste des boutiques à importer.
            Le fichier doit contenir les colonnes <strong>name</strong>, <strong>address</strong>, <strong>latitude</strong> et <strong>longitude</strong>.
          </DialogDescription>
        </DialogHeader>
        
        {importStatus === 'idle' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-4">
                Le fichier Excel doit contenir les colonnes <strong>name</strong>, <strong>address</strong>, <strong>latitude</strong> et <strong>longitude</strong>
              </p>
              <div className="flex justify-center">
                <input
                  ref={fileInputRef}
                  id="excel-file"
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleSelectFileClick}
                >
                  <Upload className="h-4 w-4" />
                  Sélectionner un fichier
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {importStatus === 'importing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin mb-4"></div>
            <p className="text-sm text-gray-500">Traitement du fichier en cours...</p>
          </div>
        )}
        
        {importStatus === 'error' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="bg-red-50 p-4 rounded-lg text-center w-full">
              <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <p className="text-red-600 font-medium">Erreur</p>
              <p className="text-sm text-gray-600">{errorMessage}</p>
            </div>
            <Button variant="outline" onClick={resetImport}>
              Réessayer
            </Button>
          </div>
        )}
        
        {importStatus === 'success' && (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-center text-gray-700">
              Importation réussie !
            </p>
          </div>
        )}
        
        {importStatus === 'preview' && (
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <div className="text-sm font-medium px-4 py-2 bg-gray-50">
                Aperçu des données ({preview.length} boutiques)
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Nom</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Adresse</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Coordonnées</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {preview.slice(0, 5).map((store, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-gray-800">{store.name}</td>
                        <td className="px-3 py-2 text-gray-600">{store.address}</td>
                        <td className="px-3 py-2 text-gray-600">{store.latitude}, {store.longitude}</td>
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-center text-gray-500 italic">
                          {preview.length - 5} boutiques supplémentaires...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Toutes les boutiques seront ajoutées à votre base de données.
              Vérifiez que les données sont correctes avant de procéder.
            </p>
          </div>
        )}
        
        <DialogFooter>
          {importStatus === 'preview' && (
            <>
              <Button variant="outline" onClick={resetImport}>
                Annuler
              </Button>
              <Button 
                className="bg-bisko-500 hover:bg-bisko-600 text-white"
                onClick={handleImport}
              >
                Importer {preview.length} boutiques
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStoresFromExcel;
