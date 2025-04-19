
import { LocalStorageManager } from './localStorageUtils';

// Interface pour les utilisateurs
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'commercial';
  zone: string;
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
}

// Gestionnaire pour les utilisateurs
export class UsersManager {
  private usersManager: LocalStorageManager<User>;
  
  constructor() {
    this.usersManager = new LocalStorageManager<User>('users');
    this.initialize();
  }
  
  // Initialiser les données de base si besoin
  private initialize() {
    const users = this.usersManager.getAll();
    if (users.length === 0) {
      // Créer l'utilisateur admin par défaut (ne sera pas dans la liste, mais toujours autorisé)
      // Les commerciaux seront créés via l'interface d'administration
    }
  }
  
  // Obtenir tous les utilisateurs
  getAllUsers(): User[] {
    return this.usersManager.getAll();
  }
  
  // Obtenir un utilisateur par email
  getUserByEmail(email: string): User | null {
    const users = this.usersManager.getAll();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }
  
  // Créer un nouvel utilisateur
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): User {
    const now = new Date().toISOString();
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: now,
      lastActive: now
    } as User;
    
    return this.usersManager.create(newUser);
  }
  
  // Mettre à jour un utilisateur
  updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    return this.usersManager.update(id, updates);
  }
  
  // Supprimer un utilisateur
  deleteUser(id: string): boolean {
    return this.usersManager.delete(id);
  }
  
  // Vérifier si un utilisateur est autorisé à se connecter
  isUserAuthorized(email: string): boolean {
    // L'admin est toujours autorisé
    if (email.toLowerCase() === 'admin@bisko.com') {
      return true;
    }
    
    // Vérifier si l'utilisateur existe et est actif
    const user = this.getUserByEmail(email);
    return user !== null && user.status === 'active';
  }
}

// Exporter une instance pour un accès facile
export const usersManager = new UsersManager();
