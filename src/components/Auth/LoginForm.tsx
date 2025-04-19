
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { usersManager } from '@/utils/usersUtils';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Verify if the user is authorized to connect (except admin)
      const isAdmin = email.toLowerCase() === 'admin@bisko.com';
      
      if (!isAdmin) {
        const isUserAuthorized = usersManager.isUserAuthorized(email);
        
        if (!isUserAuthorized) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'êtes pas autorisé à vous connecter. Veuillez contacter un administrateur."
          });
          setLoading(false);
          return;
        }
      }

      // Get user from local storage
      const user = usersManager.getUserByEmail(email);
      
      // Store the user data in localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          name: user.name,
          role: user.role,
          zone: user.zone
        }));
      } else if (isAdmin) {
        localStorage.setItem('user', JSON.stringify({
          email: 'admin@bisko.com',
          name: 'Administrateur',
          role: 'admin',
          zone: 'Tous'
        }));
      }

      // Redirect to the appropriate page based on user role
      const role = isAdmin ? 'admin' : (user?.role || 'commercial');
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("Une erreur est survenue lors de la connexion.");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue sur Bisko</h1>
        <p className="text-muted-foreground mt-2">
          Connectez-vous pour accéder à votre tableau de bord
        </p>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="votre@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
