
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Extraire le nom d'utilisateur de l'adresse Gmail
    let userName = 'Utilisateur Démo';
    let role = 'commercial'; // Rôle par défaut
    
    // Vérifier si c'est l'admin qui se connecte
    if (email.toLowerCase() === 'admin@bisko.com') {
      userName = 'Admin Système';
      role = 'admin';
    } else if (email.endsWith('@gmail.com')) {
      // Prend la partie avant @gmail.com et remplace les points par des espaces
      // puis met en majuscule la première lettre de chaque mot
      userName = email.split('@')[0]
        .replace(/\./g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Simuler une connexion
    setTimeout(() => {
      // Pour l'instant, on accepte n'importe quelles informations
      localStorage.setItem('user', JSON.stringify({ 
        id: '1',
        name: userName,
        email: email,
        role: role,
        zone: role === 'admin' ? 'Tous' : 'Dakar'
      }));
      
      setIsLoading(false);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur l'application Bisko.",
      });
      
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-slide-up glass-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Bisko</CardTitle>
        <CardDescription>
          Connectez-vous pour accéder à votre espace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Pour tester l'accès administrateur, utilisez:</p>
            <p><strong>Email:</strong> admin@bisko.com</p>
            <p><strong>Mot de passe:</strong> [n'importe quel mot de passe]</p>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-bisko-500 hover:bg-bisko-600 transition-all duration-200" 
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Vous n'avez pas de compte? Contactez votre administrateur
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
