
export type PaymentMethod = 'cash' | 'mobile' | 'transfer' | 'other';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface InvoiceItem {
  product: Product;
  quantity: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  storeId: string;
  storeName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'sent' | 'paid' | 'pending';
}
