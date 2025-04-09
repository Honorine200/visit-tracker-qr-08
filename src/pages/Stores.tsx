
import React from 'react';
import { Store } from 'lucide-react';
import StoresList from '@/components/Stores/StoresList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Stores: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Store className="h-8 w-8 text-bisko-500" />
        <h1 className="text-2xl font-bold">Gestion des boutiques</h1>
      </div>
      
      <Card className="border-none shadow-md">
        <CardHeader className="bg-bisko-50 dark:bg-bisko-900/30 rounded-t-lg">
          <CardTitle className="text-xl font-medium text-bisko-700 dark:text-bisko-300">
            Liste des boutiques
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <StoresList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Stores;
