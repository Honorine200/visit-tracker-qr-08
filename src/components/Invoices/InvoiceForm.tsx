import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, FileText, Send, Store } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Product, InvoiceItem, PaymentMethod } from '@/types/invoice';
import { products } from '@/data/products';
import AddStoreDialog from '@/components/Stores/AddStoreDialog';

interface Store {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  contactName?: string;
  notes?: string;
  createdAt: string;
}

interface InvoiceFormProps {
  store?: Store;
  onInvoiceGenerated: (invoice: any) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ store, onInvoiceGenerated }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(store || null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [stores, setStores] = useState<Store[]>([]);
  
  useEffect(() => {
    const loadStores = () => {
      const storedStores = JSON.parse(localStorage.getItem('stores') || '[]');
      setStores(storedStores);
    };
    
    loadStores();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stores') {
        loadStores();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (store) {
      setSelectedStore(store);
    }
  }, [store]);

  const handleStoreAdded = (newStore: Store) => {
    setStores(prevStores => [...prevStores, newStore]);
    setSelectedStore(newStore);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      product: products[0],
      quantity: 1,
      discount: 0,
      total: products[0].price
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'product') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.product = product;
        item.total = calculateItemTotal(product.price, item.quantity, item.discount);
      }
    } else if (field === 'quantity') {
      item.quantity = Number(value);
      item.total = calculateItemTotal(item.product.price, Number(value), item.discount);
    } else if (field === 'discount') {
      item.discount = Number(value);
      item.total = calculateItemTotal(item.product.price, item.quantity, Number(value));
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const calculateItemTotal = (price: number, quantity: number, discount: number): number => {
    return price * quantity * (1 - discount / 100);
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = (subtotal: number): number => {
    return subtotal * 0.18;
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleGenerateInvoice = () => {
    if (!selectedStore) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une boutique"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez ajouter au moins un produit"
      });
      return;
    }

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = subtotal + tax;

    const invoice = {
      id: `INV-${Date.now()}`,
      storeId: selectedStore.id,
      storeName: selectedStore.name,
      date: new Date().toISOString(),
      items: [...items],
      subtotal,
      tax,
      total,
      paymentMethod,
      status: 'pending' as const
    };

    onInvoiceGenerated(invoice);

    toast({
      title: "Facture générée",
      description: "La facture a été générée avec succès"
    });

    setItems([]);
  };

  const handleSendInvoice = () => {
    toast({
      title: "Facture envoyée",
      description: "La facture a été envoyée par email/WhatsApp"
    });
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-bisko-600">Créer une facture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="store">Boutique</Label>
            <AddStoreDialog 
              onStoreAdded={handleStoreAdded}
              buttonVariant="ghost"
              buttonClassName="text-xs"
            />
          </div>
          {stores.length === 0 ? (
            <div className="text-center py-4 border rounded-md">
              <Store className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Aucune boutique enregistrée</p>
              <p className="text-xs text-muted-foreground">Ajoutez d'abord une boutique</p>
            </div>
          ) : (
            <>
              <Select
                value={selectedStore?.id || ''}
                onValueChange={(value) => {
                  const store = stores.find(s => s.id === value);
                  if (store) setSelectedStore(store);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une boutique" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedStore && (
                <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Produits</Label>
            <Button 
              onClick={addItem} 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1 text-bisko-500"
            >
              <Plus size={16} /> Ajouter
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              Aucun produit ajouté
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md">
                  <div className="col-span-12 sm:col-span-4">
                    <Label>Produit</Label>
                    <Select
                      value={item.product.id}
                      onValueChange={(value) => updateItem(index, 'product', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {product.price.toLocaleString()} FCFA
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-4 sm:col-span-2">
                    <Label>Prix unitaire</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
                      {item.product.price.toLocaleString()} FCFA
                    </div>
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <Label>Remise %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => updateItem(index, 'discount', e.target.value)}
                    />
                  </div>

                  <div className="col-span-8 sm:col-span-1">
                    <Label>Total</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
                      {item.total.toLocaleString()} FCFA
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 space-y-2 border-t">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total:</span>
              <span>{calculateSubtotal().toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVA (18%):</span>
              <span>{calculateTax(calculateSubtotal()).toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>{calculateTotal().toLocaleString()} FCFA</span>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Label htmlFor="payment">Mode de paiement</Label>
          <Select
            value={paymentMethod}
            onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
          >
            <SelectTrigger id="payment">
              <SelectValue placeholder="Sélectionner un mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Espèces</SelectItem>
              <SelectItem value="mobile">Mobile Money</SelectItem>
              <SelectItem value="transfer">Virement</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="w-full bg-bisko-500 hover:bg-bisko-600" 
          onClick={handleGenerateInvoice}
          disabled={items.length === 0 || !selectedStore}
        >
          <FileText className="mr-2 h-4 w-4" />
          Générer facture PDF
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleSendInvoice}
          disabled={items.length === 0 || !selectedStore}
        >
          <Send className="mr-2 h-4 w-4" />
          Envoyer facture
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InvoiceForm;
