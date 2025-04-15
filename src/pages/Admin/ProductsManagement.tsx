
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
import { Package, Search, Plus, Edit, Trash2, Save } from 'lucide-react';
import { products as initialProducts } from '@/data/products';
import { Product } from '@/types/invoice';

const ProductsManagement: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Biscuits',
  });
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setProducts(initialProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    // Validation basique
    if (!newProduct.name || !newProduct.price) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires.',
      });
      return;
    }

    const price = parseFloat(newProduct.price);
    if (isNaN(price) || price <= 0) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez entrer un prix valide.',
      });
      return;
    }

    // Simuler l'ajout d'un produit
    const newProductData: Product = {
      id: `p${products.length + 1}`,
      name: newProduct.name,
      price: price,
      category: newProduct.category,
    };

    setProducts([...products, newProductData]);
    setIsAddDialogOpen(false);
    setNewProduct({
      name: '',
      price: '',
      category: 'Biscuits',
    });

    toast({
      title: 'Produit ajouté',
      description: `${newProduct.name} a été ajouté avec succès.`,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Simuler la suppression
    setProducts(products.filter((p) => p.id !== productId));
    toast({
      title: 'Produit supprimé',
      description: `${product.name} a été supprimé avec succès.`,
    });
  };

  const startEdit = (product: Product) => {
    setEditMode(product.id);
    setEditedProduct({ ...product });
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditedProduct(null);
  };

  const saveEdit = () => {
    if (!editedProduct) return;

    setProducts(
      products.map((product) =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
    setEditMode(null);
    setEditedProduct(null);

    toast({
      title: 'Produit mis à jour',
      description: `${editedProduct.name} a été mis à jour avec succès.`,
    });
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
              <Package className="h-5 w-5" /> Gestion des produits
            </CardTitle>
            <CardDescription>
              Gérez votre catalogue de produits
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bisko-500 hover:bg-bisko-600">
                <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Ajouter un produit
                </DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau produit au catalogue
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
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Prix (FCFA)*
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    className="col-span-3"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Catégorie
                  </Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, category: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Biscuits">Biscuits</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Boissons">Boissons</SelectItem>
                      <SelectItem value="Confiseries">Confiseries</SelectItem>
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
                  onClick={handleAddProduct}
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
                  placeholder="Rechercher un produit..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center"
                    >
                      Aucun produit trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell className="font-medium">
                        {editMode === product.id ? (
                          <Input
                            value={editedProduct?.name || ''}
                            onChange={(e) =>
                              setEditedProduct({
                                ...editedProduct!,
                                name: e.target.value,
                              })
                            }
                            className="h-8 py-1"
                          />
                        ) : (
                          product.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode === product.id ? (
                          <Input
                            type="number"
                            value={editedProduct?.price || 0}
                            onChange={(e) =>
                              setEditedProduct({
                                ...editedProduct!,
                                price: parseFloat(e.target.value),
                              })
                            }
                            className="h-8 py-1 w-28"
                          />
                        ) : (
                          `${product.price.toLocaleString()} FCFA`
                        )}
                      </TableCell>
                      <TableCell>
                        {editMode === product.id ? (
                          <Select
                            value={editedProduct?.category || ''}
                            onValueChange={(value) =>
                              setEditedProduct({
                                ...editedProduct!,
                                category: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 py-1 w-32">
                              <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Biscuits">Biscuits</SelectItem>
                              <SelectItem value="Snacks">Snacks</SelectItem>
                              <SelectItem value="Boissons">Boissons</SelectItem>
                              <SelectItem value="Confiseries">
                                Confiseries
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.category === 'Biscuits'
                                ? 'bg-amber-100 text-amber-800'
                                : product.category === 'Snacks'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {product.category}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editMode === product.id ? (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-500 hover:text-green-600"
                                onClick={saveEdit}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={cancelEdit}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => startEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

export default ProductsManagement;
