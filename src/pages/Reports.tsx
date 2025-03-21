
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Download, Calendar, Search } from 'lucide-react';
import VisitsList from "@/components/Visits/VisitsList";
import InvoicesList from "@/components/Invoices/InvoicesList";
import { invoices } from "@/data/invoices";

const Reports: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="space-y-4 pb-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-bisko-600">Mes rapports</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="w-full sm:w-[calc(50%-0.5rem)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-bisko-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-bisko-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Visites du mois</p>
                <h2 className="text-2xl font-bold">24</h2>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full sm:w-[calc(50%-0.5rem)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Factures du mois</p>
                <h2 className="text-2xl font-bold">12</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Novembre 2023</span>
        </div>
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>
      
      <Tabs defaultValue="visits" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visits">Visites</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
        </TabsList>
        <TabsContent value="visits" className="mt-4">
          <VisitsList />
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <InvoicesList invoices={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
