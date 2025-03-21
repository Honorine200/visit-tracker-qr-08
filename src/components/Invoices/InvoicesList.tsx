
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, Search, Filter } from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoicesListProps {
  invoices: Invoice[];
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices: initialInvoices }) => {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      invoice.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'sent':
        return 'Envoyée';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const exportToExcel = () => {
    alert('Export Excel non implémenté');
  };

  const exportToPdf = () => {
    alert('Export PDF non implémenté');
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice', invoice);
    // Implementation would open invoice details or PDF
    alert(`Affichage de la facture ${invoice.id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-bisko-600">Mes factures</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une facture..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="sent">Envoyées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs" 
              onClick={exportToExcel}
            >
              <Download className="mr-1 h-3 w-3" />
              Excel
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs" 
              onClick={exportToPdf}
            >
              <Download className="mr-1 h-3 w-3" />
              PDF
            </Button>
          </div>

          {/* Invoices list */}
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune facture trouvée
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col sm:flex-row justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{invoice.storeName}</h4>
                    <div className="flex flex-col sm:flex-row sm:gap-3 text-sm text-muted-foreground">
                      <span>{invoice.id}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatDate(invoice.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-3 justify-between sm:justify-end">
                    <div className="flex items-center">
                      <span className="font-medium">{invoice.total.toLocaleString()} FCFA</span>
                      <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesList;
