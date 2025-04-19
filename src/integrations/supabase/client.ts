
// Simulateur de client Supabase utilisant le stockage local

import { LocalStorageManager } from '@/utils/localStorageUtils';

// Types simulés pour la compatibilité avec Supabase
export const supabase = {
  from: (tableName: string) => ({
    select: (query = '*') => {
      const manager = getManagerForTable(tableName);
      return {
        data: manager.getAll(),
        error: null,
        eq: (column: string, value: any) => {
          const items = manager.getAll();
          return {
            data: items.filter((item: any) => item[column] === value),
            error: null
          };
        },
        in: (column: string, values: any[]) => {
          const items = manager.getAll();
          return {
            data: items.filter((item: any) => values.includes(item[column])),
            error: null
          };
        },
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
  // Ajout d'un objet auth simulé
  auth: {
    getUser: () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return { data: { user: null }, error: null };
      try {
        const user = JSON.parse(userStr);
        return { data: { user }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },
    signOut: () => {
      localStorage.removeItem('user');
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simuler un événement d'authentification initial
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          callback('SIGNED_IN', { user });
        } catch (error) {
          console.error('Erreur lors de la lecture des données utilisateur:', error);
        }
      }
      
      // Retourner un objet avec une méthode de désabonnement
      return { 
        data: { 
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
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
    case 'visit_assignments':
      return new LocalStorageManager<any>('visit_assignments');
    case 'users':
      return new LocalStorageManager<any>('users');
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

// Fonction pour réinitialiser toutes les données de l'application
export const resetAppData = () => {
  const keysToPreserve = ['user']; // On garde l'utilisateur connecté
  
  // Récupérer l'utilisateur connecté avant de tout effacer
  const userStr = localStorage.getItem('user');
  
  // Effacer tout le localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !keysToPreserve.includes(key)) {
      localStorage.removeItem(key);
    }
  }
  
  // Déclencher un événement storage pour notifier les composants
  window.dispatchEvent(new Event('storage'));
  
  console.log('Données de l\'application réinitialisées');
  
  return true;
};

