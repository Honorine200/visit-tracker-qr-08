
// Simulateur de client Supabase utilisant le stockage local

import { LocalStorageManager } from '@/utils/localStorageUtils';

// Types simulés pour la compatibilité avec Supabase
export const supabase = {
  from: (tableName: string) => ({
    select: () => {
      const manager = getManagerForTable(tableName);
      return {
        data: manager.getAll(),
        error: null,
        then: (callback: (data: any) => void) => callback({ data: manager.getAll(), error: null })
      };
    },
    insert: (data: any) => {
      const manager = getManagerForTable(tableName);
      const result = manager.create(data);
      return { data: result, error: null };
    },
    update: (data: any) => {
      const manager = getManagerForTable(tableName);
      const result = manager.update(data.id, data);
      return { data: result, error: null };
    },
    delete: () => ({
      eq: (column: string, value: any) => {
        const manager = getManagerForTable(tableName);
        const success = manager.delete(value);
        return { data: {}, error: success ? null : new Error('Item not found') };
      }
    }),
    eq: (column: string, value: any) => {
      const manager = getManagerForTable(tableName);
      const items = manager.getAll();
      return {
        data: items.filter((item: any) => item[column] === value),
        error: null
      };
    }
  }),
  // Simulation simplifiée d'un canal en temps réel
  channel: (channelName: string) => {
    return {
      on: () => {
        // Simulation de l'enregistrement d'un écouteur
        return { 
          subscribe: (callback?: () => void) => {
            if (callback) callback();
            return { 
              unsubscribe: () => {} 
            };
          }
        };
      }
    };
  }
};

// Fonction auxiliaire pour obtenir le gestionnaire approprié en fonction du nom de la table
function getManagerForTable(tableName: string): LocalStorageManager<any> {
  switch (tableName) {
    case 'stores':
      return new LocalStorageManager<any>('stores');
    case 'visits':
      return new LocalStorageManager<any>('visits');
    case 'products':
      return new LocalStorageManager<any>('products');
    case 'sales':
      return new LocalStorageManager<any>('sales');
    default:
      return new LocalStorageManager<any>(tableName);
  }
}

// Simuler l'abonnement aux changements de table
export const subscribeToTable = (tableName: string, callback: () => void) => {
  console.log(`Abonnement aux changements sur ${tableName}`);
  
  // Ajouter un écouteur d'événements pour les événements de stockage
  window.addEventListener('storage', callback);
  
  // Retourner une fonction pour se désabonner (supprimer l'écouteur d'événements)
  return () => {
    window.removeEventListener('storage', callback);
  };
};
