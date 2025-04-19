import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Settings,
  Save,
  Building,
  Lock,
  Bell,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resetAppData } from '@/integrations/supabase/client';

const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    companyName: 'Bisko',
    address: '123 Avenue Principale, Dakar, Sénégal',
    phone: '+221 77 123 45 67',
    email: 'contact@bisko.com',
    logo: '',
    enableNotifications: true,
    enableEmailNotifications: false,
    securityTimeout: 30,
    backupFrequency: 'daily',
    theme: 'light',
    defaultLanguage: 'fr',
  });
  const [loading, setLoading] = useState(false);
  const [resettingData, setResettingData] = useState(false);

  const handleSave = () => {
    setLoading(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setLoading(false);
      
      // Stocker dans le localStorage pour la démo
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      toast({
        title: 'Paramètres enregistrés',
        description: 'Vos modifications ont été enregistrées avec succès.',
      });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  const handleReset = () => {
    // Simuler une réinitialisation des paramètres
    const defaultSettings = {
      companyName: 'Bisko',
      address: '123 Avenue Principale, Dakar, Sénégal',
      phone: '+221 77 123 45 67',
      email: 'contact@bisko.com',
      logo: '',
      enableNotifications: true,
      enableEmailNotifications: false,
      securityTimeout: 30,
      backupFrequency: 'daily',
      theme: 'light',
      defaultLanguage: 'fr',
    };
    
    setSettings(defaultSettings);
    
    toast({
      title: 'Paramètres réinitialisés',
      description: 'Les paramètres ont été réinitialisés aux valeurs par défaut.',
    });
  };

  const handleResetAllData = () => {
    setResettingData(true);
    
    // Réinitialiser toutes les données
    setTimeout(() => {
      try {
        resetAppData();
        toast({
          title: 'Données réinitialisées',
          description: 'Toutes les données de l\'application ont été réinitialisées avec succès.',
        });
      } catch (error) {
        console.error('Erreur lors de la réinitialisation des données:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la réinitialisation des données.',
        });
      } finally {
        setResettingData(false);
      }
    }, 1500);
  };

  const handleBackup = () => {
    // Créer un objet avec toutes les données importantes
    const backupData = {
      settings: settings,
      timestamp: new Date().toISOString(),
      stores: JSON.parse(localStorage.getItem('stores') || '[]'),
      products: JSON.parse(localStorage.getItem('products') || '[]'),
      users: [/* ici on mettrait les utilisateurs */]
    };
    
    // Convertir en JSON
    const dataStr = JSON.stringify(backupData);
    
    // Créer un Blob pour le téléchargement
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien et cliquer dessus
    const link = document.createElement('a');
    link.href = url;
    link.download = `bisko-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Sauvegarde créée',
      description: 'La sauvegarde des données a été générée avec succès.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" /> Paramètres de l'application
          </CardTitle>
          <CardDescription>
            Configurez les paramètres généraux de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Building className="h-4 w-4" /> Informations de l'entreprise
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4" /> Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableNotifications">
                      Activer les notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications dans l'application
                    </p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) =>
                      handleSwitchChange('enableNotifications', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableEmailNotifications">
                      Notifications par email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch
                    id="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onCheckedChange={(checked) =>
                      handleSwitchChange('enableEmailNotifications', checked)
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4" /> Sécurité
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityTimeout">
                      Délai d'inactivité (minutes)
                    </Label>
                    <Input
                      id="securityTimeout"
                      name="securityTimeout"
                      type="number"
                      min="1"
                      max="120"
                      value={settings.securityTimeout}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">
                      Fréquence des sauvegardes
                    </Label>
                    <select
                      id="backupFrequency"
                      name="backupFrequency"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={settings.backupFrequency}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          backupFrequency: e.target.value,
                        })
                      }
                    >
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Download className="h-4 w-4" /> Gestion des données
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleBackup}
                  >
                    <Download className="h-4 w-4" />
                    Exporter les données
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Importer des données
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center gap-2 mt-4 md:mt-0">
                        <Trash2 className="h-4 w-4" />
                        Réinitialiser toutes les données
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" /> Réinitialisation des données
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action va supprimer toutes les données de l'application et les réinitialiser à zéro.
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleResetAllData}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={resettingData}
                        >
                          {resettingData ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                              Réinitialisation...
                            </>
                          ) : (
                            'Confirmer la réinitialisation'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button
            className="w-full sm:w-auto bg-bisko-500 hover:bg-bisko-600 flex items-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSettings;
