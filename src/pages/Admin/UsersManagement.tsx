
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Users, Search, Plus, Edit, Trash2, UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  zone: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

const UsersManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'commercial',
    zone: 'Dakar',
    password: '',
  });

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          name: 'Admin Système',
          email: 'admin@bisko.com',
          role: 'admin',
          zone: 'Tous',
          status: 'active',
          lastActive: '2023-11-25T10:30:00',
        },
        {
          id: '2',
          name: 'Amadou Sow',
          email: 'amadou@bisko.com',
          role: 'commercial',
          zone: 'Dakar',
          status: 'active',
          lastActive: '2023-11-25T09:15:00',
        },
        {
          id: '3',
          name: 'Marie Diop',
          email: 'marie@bisko.com',
          role: 'commercial',
          zone: 'Thiès',
          status: 'active',
          lastActive: '2023-11-24T16:45:00',
        },
        {
          id: '4',
          name: 'Ousmane Ndiaye',
          email: 'ousmane@bisko.com',
          role: 'commercial',
          zone: 'Saint-Louis',
          status: 'inactive',
          lastActive: '2023-11-10T11:20:00',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    // Validation basique
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires.',
      });
      return;
    }

    // Simuler l'ajout d'un utilisateur
    const newUserData: User = {
      id: `${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      zone: newUser.zone,
      status: 'active',
      lastActive: new Date().toISOString(),
    };

    setUsers([...users, newUserData]);
    setIsAddDialogOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'commercial',
      zone: 'Dakar',
      password: '',
    });

    toast({
      title: 'Utilisateur ajouté',
      description: `${newUser.name} a été ajouté avec succès.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    // Simuler la suppression
    setUsers(users.filter((u) => u.id !== userId));
    toast({
      title: 'Utilisateur supprimé',
      description: `${user.name} a été supprimé avec succès.`,
    });
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'active' ? 'inactive' : 'active',
            }
          : user
      )
    );

    const user = users.find((u) => u.id === userId);
    if (!user) return;

    toast({
      title: `Utilisateur ${
        user.status === 'active' ? 'désactivé' : 'activé'
      }`,
      description: `${user.name} a été ${
        user.status === 'active' ? 'désactivé' : 'activé'
      } avec succès.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-bisko-200 border-t-bisko-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5" /> Gestion des utilisateurs
            </CardTitle>
            <CardDescription>
              Gérez vos commerciaux et administrateurs
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bisko-500 hover:bg-bisko-600">
                <Plus className="h-4 w-4 mr-2" /> Ajouter un utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Ajouter un utilisateur
                </DialogTitle>
                <DialogDescription>
                  Créez un nouvel utilisateur dans le système
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom*
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="col-span-3"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mot de passe*
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zone" className="text-right">
                    Zone
                  </Label>
                  <Select
                    value={newUser.zone}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, zone: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dakar">Dakar</SelectItem>
                      <SelectItem value="Thiès">Thiès</SelectItem>
                      <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                      <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="bg-bisko-500 hover:bg-bisko-600"
                  onClick={handleAddUser}
                >
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un utilisateur..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center"
                    >
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Commercial'}
                        </span>
                      </TableCell>
                      <TableCell>{user.zone}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(user.lastActive)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusToggle(user.id)}
                          >
                            {user.status === 'active'
                              ? 'Désactiver'
                              : 'Activer'}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
