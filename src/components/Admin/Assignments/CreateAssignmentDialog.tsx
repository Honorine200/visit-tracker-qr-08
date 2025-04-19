
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  commercial_id: string;
  store_ids: string[];
  start_date: Date;
  end_date: Date;
  notes?: string;
}

const CreateAssignmentDialog = () => {
  const [open, setOpen] = useState(false);
  const [commercials, setCommercials] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const { toast } = useToast();
  const form = useForm<FormData>();

  useEffect(() => {
    fetchCommercials();
    fetchStores();
  }, []);

  const fetchCommercials = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, name')
      .eq('role', 'commercial');
    
    if (data) setCommercials(data);
  };

  const fetchStores = async () => {
    const { data } = await supabase
      .from('stores')
      .select('id, name');
    
    if (data) setStores(data);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase
        .from('visit_assignments')
        .insert({
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: 'Assignation créée',
        description: 'L\'assignation de visite a été créée avec succès.'
      });

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création de l\'assignation.'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-bisko-500 hover:bg-bisko-600">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle assignation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nouvelle assignation de visite</DialogTitle>
          <DialogDescription>
            Assignez des boutiques à visiter à un commercial
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="commercial_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commercial</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Sélectionnez un commercial</option>
                        {commercials.map(commercial => (
                          <option key={commercial.id} value={commercial.id}>
                            {commercial.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="store_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boutiques à visiter</FormLabel>
                    <FormControl>
                      <select
                        multiple
                        {...field}
                        className="w-full p-2 border rounded-md"
                      >
                        {stores.map(store => (
                          <option key={store.id} value={store.id}>
                            {store.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Maintenez Ctrl pour sélectionner plusieurs boutiques
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ajoutez des instructions ou des notes supplémentaires..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-bisko-500 hover:bg-bisko-600">
                Créer l'assignation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentDialog;
