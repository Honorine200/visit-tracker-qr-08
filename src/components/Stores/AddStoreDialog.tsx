
import React from 'react';
import { Plus, Store } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddStoreForm, { StoreFormValues } from './AddStoreForm';
import { useToast } from '@/components/ui/use-toast';

interface AddStoreDialogProps {
  onStoreAdded?: (store: any) => void;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  buttonClassName?: string;
}

const AddStoreDialog: React.FC<AddStoreDialogProps> = ({ 
  onStoreAdded,
  buttonVariant = "default",
  buttonClassName = "bg-bisko-500 hover:bg-bisko-600 text-white" 
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (values: StoreFormValues) => {
    // Convert latitude and longitude to numbers if provided
    const processedValues = {
      ...values,
      latitude: values.latitude ? values.latitude.trim() : undefined,
      longitude: values.longitude ? values.longitude.trim() : undefined
    };

    // Generate a unique ID for the store
    const newStore = {
      id: `store-${Date.now()}`,
      ...processedValues,
      createdAt: new Date().toISOString()
    };

    // In a real app, you would save this to a database
    // For now, we're just saving it to localStorage
    const existingStores = JSON.parse(localStorage.getItem('stores') || '[]');
    const updatedStores = [...existingStores, newStore];
    localStorage.setItem('stores', JSON.stringify(updatedStores));

    // Trigger an event for the admin dashboard to pick up
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'stores',
      newValue: JSON.stringify(updatedStores)
    }));

    // Close the dialog
    setOpen(false);

    // Show success message
    toast({
      title: "Boutique ajoutée",
      description: `La boutique ${values.name} a été ajoutée avec succès.`,
    });

    // Notify parent component
    if (onStoreAdded) {
      onStoreAdded(newStore);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName} size="sm">
          <Plus size={16} className="mr-1" /> Ajouter une boutique
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Store className="h-5 w-5 text-bisko-500" />
            <DialogTitle>Ajouter une nouvelle boutique</DialogTitle>
          </div>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter une nouvelle boutique.
          </DialogDescription>
        </DialogHeader>
        <AddStoreForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddStoreDialog;
