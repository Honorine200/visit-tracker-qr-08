
import { Invoice } from "@/types/invoice";
import { products } from "./products";

// Sample invoices data
export const invoices: Invoice[] = [
  {
    id: "INV-20230001",
    storeId: "store1",
    storeName: "Supermarché Excel",
    date: "2023-11-15T10:30:00Z",
    items: [
      {
        product: products[0],
        quantity: 10,
        discount: 5,
        total: 23750
      },
      {
        product: products[2],
        quantity: 5,
        discount: 0,
        total: 9000
      }
    ],
    subtotal: 32750,
    tax: 5895,
    total: 38645,
    paymentMethod: "cash",
    status: "paid"
  },
  {
    id: "INV-20230002",
    storeId: "store2",
    storeName: "Mini Market Plus",
    date: "2023-11-20T14:45:00Z",
    items: [
      {
        product: products[1],
        quantity: 8,
        discount: 0,
        total: 24000
      }
    ],
    subtotal: 24000,
    tax: 4320,
    total: 28320,
    paymentMethod: "mobile",
    status: "sent"
  },
  {
    id: "INV-20230003",
    storeId: "store3",
    storeName: "Market Express",
    date: "2023-11-25T09:15:00Z",
    items: [
      {
        product: products[0],
        quantity: 15,
        discount: 10,
        total: 33750
      },
      {
        product: products[3],
        quantity: 12,
        discount: 5,
        total: 31920
      },
      {
        product: products[5],
        quantity: 20,
        discount: 0,
        total: 24000
      }
    ],
    subtotal: 89670,
    tax: 16141,
    total: 105811,
    paymentMethod: "transfer",
    status: "pending"
  }
];
