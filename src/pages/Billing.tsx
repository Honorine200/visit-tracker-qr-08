
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceForm from "@/components/Invoices/InvoiceForm";
import InvoicesList from "@/components/Invoices/InvoicesList";
import { invoices as mockInvoices } from "@/data/invoices";
import { Invoice } from "@/types/invoice";
import { useToast } from "@/components/ui/use-toast";

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load invoices from mock data
    setInvoices(mockInvoices);
  }, [navigate]);
  
  const handleInvoiceGenerated = (newInvoice: Invoice) => {
    // In a real app, this would send the invoice to a backend
    // Here we just add it to our local state
    setInvoices([newInvoice, ...invoices]);
    
    toast({
      title: "Facture créée",
      description: `Facture ${newInvoice.id} créée avec succès`
    });
  };
  
  return (
    <div className="space-y-4 pb-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-bisko-600">Facturation</h1>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Créer une facture</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-4">
          <InvoiceForm onInvoiceGenerated={handleInvoiceGenerated} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <InvoicesList invoices={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;
