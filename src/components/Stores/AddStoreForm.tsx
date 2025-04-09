
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { MapPin, Locate } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom de la boutique doit contenir au moins 2 caractères." }),
  address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email invalide" }).optional().or(z.literal('')),
  contactName: z.string().optional(),
  latitude: z.string().optional().or(z.literal(''))
    .refine(val => !val || !isNaN(parseFloat(val)), { message: "La latitude doit être un nombre valide" })
    .refine(val => !val || (parseFloat(val) >= -90 && parseFloat(val) <= 90), { message: "La latitude doit être entre -90 et 90" }),
  longitude: z.string().optional().or(z.literal(''))
    .refine(val => !val || !isNaN(parseFloat(val)), { message: "La longitude doit être un nombre valide" })
    .refine(val => !val || (parseFloat(val) >= -180 && parseFloat(val) <= 180), { message: "La longitude doit être entre -180 et 180" }),
  notes: z.string().optional(),
});

export type StoreFormValues = z.infer<typeof formSchema>;

interface AddStoreFormProps {
  onSubmit: (values: StoreFormValues) => void;
  onCancel: () => void;
}

const AddStoreForm: React.FC<AddStoreFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      contactName: "",
      latitude: "",
      longitude: "",
      notes: "",
    },
  });

  const handleSubmit = (values: StoreFormValues) => {
    onSubmit(values);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erreur",
        description: "La géolocalisation n'est pas prise en charge par votre navigateur.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Localisation en cours",
      description: "Veuillez attendre pendant que nous récupérons votre position actuelle...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        form.setValue('latitude', position.coords.latitude.toString());
        form.setValue('longitude', position.coords.longitude.toString());
        toast({
          title: "Localisation réussie",
          description: "Votre position actuelle a été capturée avec succès.",
        });
      },
      (error) => {
        // Error callback
        let errorMessage = "Impossible de récupérer votre position.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Vous avez refusé l'accès à votre position.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Votre position est indisponible.";
            break;
          case error.TIMEOUT:
            errorMessage = "La demande de position a expiré.";
            break;
        }
        
        toast({
          title: "Erreur de localisation",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la boutique*</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Supermarché Excel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse*</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: 123 Rue Centrale, Dakar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: +221 77 123 45 67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: contact@boutique.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du contact</FormLabel>
              <FormControl>
                <Input placeholder="Ex: John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/30 p-4 rounded-lg space-y-4 border border-muted">
          <div className="flex items-center gap-2 text-bisko-600">
            <MapPin className="h-4 w-4" />
            <h3 className="text-sm font-medium">Coordonnées géographiques</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 14.7167" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: -17.4677" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-2 bg-bisko-50 text-bisko-700 hover:bg-bisko-100"
            onClick={getCurrentLocation}
          >
            <Locate className="h-4 w-4" />
            Utiliser ma position actuelle
          </Button>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes additionnelles</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notes sur la boutique, disponibilité, etc." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-bisko-500 hover:bg-bisko-600">
            Ajouter la boutique
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddStoreForm;
