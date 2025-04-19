
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/Auth/LoginForm';
import { Building2, ChevronRight, ShieldCheck, Users } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Left side - App presentation */}
      <div className="w-full md:w-1/2 bg-bisko-600 dark:bg-bisko-900 text-white p-10 flex flex-col justify-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bisko</h1>
          <p className="text-xl md:text-2xl mb-8 font-light">
            La solution professionnelle pour la gestion des visites commerciales
          </p>
          
          <div className="space-y-6 mt-10">
            <div className="flex items-start space-x-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gestion des points de vente</h3>
                <p className="text-gray-200 mt-1">Gérez efficacement vos magasins et points de vente.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Suivi commercial</h3>
                <p className="text-gray-200 mt-1">Organisez et suivez les visites de vos commerciaux.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sécurité avancée</h3>
                <p className="text-gray-200 mt-1">Accès sécurisé pour les commerciaux autorisés par l'administrateur.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="flex items-center space-x-2 text-sm">
              <span>© 2025 Bisko</span>
              <span>•</span>
              <a href="#" className="hover:underline flex items-center">
                Assistance <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
