
import React from 'react';
import { Plus } from 'lucide-react';
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
  buttonVariant = "outline",
  buttonClassName = "flex items-center gap-1 text-bisko-500" 
}) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (values: StoreFormValues) => {
    // Generate a unique ID for the store
    const newStore = {
      id: `store-${Date.now()}`,
      ...values,
      createdAt: new Date().toISOString()
    };

    // In a real app, you would save this to a database
    // For now, we're just saving it to localStorage
    const existingStores = JSON.parse(localStorage.getItem('stores') || '[]');
    const updatedStores = [...existingStores, newStore];
    localStorage.setItem('stores', JSON.stringify(updatedStores));

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
          <Plus size={16} /> Ajouter une boutique
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle boutique</DialogTitle>
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
