
import { v4 as uuidv4 } from 'uuid';

// Types génériques pour les entités
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Classe de base pour la gestion du stockage local
export class LocalStorageManager<T extends BaseEntity> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  // Obtenir toutes les entités
  getAll(): T[] {
    const items = localStorage.getItem(this.storageKey);
    if (!items) return [];
    return JSON.parse(items) as T[];
  }

  // Obtenir une entité par ID
  getById(id: string): T | null {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  // Ajouter une nouvelle entité
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const items = this.getAll();
    const now = new Date().toISOString();
    
    const newItem = {
      ...item,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    } as T;
    
    items.push(newItem);
    this.saveItems(items);
    
    // Déclencher un événement storage pour notifier les autres onglets/composants
    window.dispatchEvent(new Event('storage'));
    
    return newItem;
  }

  // Mettre à jour une entité existante
  update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): T | null {
    const items = this.getAll();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return null;
    
    const updatedItem = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    items[itemIndex] = updatedItem;
    this.saveItems(items);
    
    // Déclencher un événement storage
    window.dispatchEvent(new Event('storage'));
    
    return updatedItem;
  }

  // Supprimer une entité
  delete(id: string): boolean {
    const items = this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    this.saveItems(filteredItems);
    
    // Déclencher un événement storage
    window.dispatchEvent(new Event('storage'));
    
    return true;
  }

  // Rechercher des entités
  search(searchTerm: string, fields: (keyof T)[]): T[] {
    const items = this.getAll();
    if (!searchTerm) return items;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return items.filter(item => {
      return fields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearchTerm);
        }
        return false;
      });
    });
  }

  // Enregistrer des éléments dans le localStorage
  private saveItems(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  // Vider toutes les données
  clear(): void {
    localStorage.removeItem(this.storageKey);
    
    // Déclencher un événement storage
    window.dispatchEvent(new Event('storage'));
  }
}

// Fonction pour initialiser les données si le localStorage est vide
export function initializeLocalStorageData(): void {
  // Vérifier si les données de base existent déjà
  if (!localStorage.getItem('stores')) {
    // Données initiales pour les boutiques
    const stores = [
      {
        id: "1",
        name: "Boutique Centrale",
        address: "123 Avenue Pompidou, Dakar",
        latitude: "14.7167",
        longitude: "-17.4677",
        phone: "+221 77 123 45 67",
        contactName: "Moussa Diop",
        createdAt: new Date().toISOString(),
        zone: "Dakar"
      },
      {
        id: "2",
        name: "Mini-Market Sébikotane",
        address: "45 Rue Principale, Sébikotane",
        latitude: "14.7468",
        longitude: "-17.1432",
        contactName: "Aminata Sow",
        createdAt: new Date().toISOString(),
        zone: "Dakar"
      }
    ];
    localStorage.setItem('stores', JSON.stringify(stores));
  }

  if (!localStorage.getItem('visits')) {
    // Données initiales pour les visites
    const visits = [
      {
        id: "1",
        storeId: "1",
        storeName: "Boutique Centrale",
        date: new Date().toISOString(),
        status: "completed",
        notes: "Stock vérifié, commande passée pour réapprovisionnement",
        agentId: "2",
        agentName: "Amadou Sow"
      },
      {
        id: "2",
        storeId: "2",
        storeName: "Mini-Market Sébikotane",
        date: new Date().toISOString(),
        status: "pending",
        agentId: "2",
        agentName: "Amadou Sow"
      }
    ];
    localStorage.setItem('visits', JSON.stringify(visits));
  }

  // Autres données d'initialisation si nécessaire
}

// Exportation d'instances spécifiques pour un accès facile
export const storesManager = new LocalStorageManager<any>('stores');
export const visitsManager = new LocalStorageManager<any>('visits');
export const productsManager = new LocalStorageManager<any>('products');
export const salesManager = new LocalStorageManager<any>('sales');

// Initialiser les données au démarrage de l'application
initializeLocalStorageData();
