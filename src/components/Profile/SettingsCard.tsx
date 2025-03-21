
import React from 'react';
import { LogOut, Moon, Sun, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface SettingsCardProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  onSyncData: () => void;
  onLogout: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ 
  isDarkMode, 
  toggleDarkMode, 
  syncStatus, 
  onSyncData, 
  onLogout 
}) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isDarkMode ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="dark-mode">Mode sombre</Label>
          </div>
          <Switch
            id="dark-mode"
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={onSyncData}
          disabled={syncStatus === 'syncing'}
        >
          {syncStatus === 'syncing' ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Synchronisation...
            </>
          ) : syncStatus === 'success' ? (
            <>
              <RefreshCw className="h-4 w-4 text-green-500" />
              Synchronisé
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Synchroniser les données
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsCard;
