
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, QrCode, Clock, User, FileText, BarChart3 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center px-2 py-2 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out",
        isActive 
          ? "text-bisko-600 bg-bisko-50 dark:bg-bisko-950 dark:text-bisko-300" 
          : "text-gray-500 hover:text-bisko-500 hover:bg-bisko-50 dark:hover:bg-bisko-950/30 dark:hover:text-bisko-400"
      )}
    >
      <div className="w-6 h-6 mb-1">{icon}</div>
      <span>{label}</span>
    </Link>
  );
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Ne pas afficher la barre de navigation sur la page de connexion
  const isLoginPage = pathname === '/login';
  
  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <main className="flex-1 pb-20 overflow-auto">
        <div className="max-w-lg mx-auto p-4">
          <Outlet />
        </div>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 z-50">
        <div className="max-w-lg mx-auto px-2 py-2">
          <div className="grid grid-cols-6 gap-1">
            <NavItem 
              to="/dashboard" 
              label="Accueil" 
              icon={<Home className={cn(pathname === '/dashboard' ? "text-bisko-500" : "")} />}
              isActive={pathname === '/dashboard' || pathname === '/'}
            />
            <NavItem 
              to="/scanner" 
              label="Scanner" 
              icon={<QrCode className={cn(pathname === '/scanner' ? "text-bisko-500" : "")} />}
              isActive={pathname === '/scanner'}
            />
            <NavItem 
              to="/visits" 
              label="Visites" 
              icon={<Clock className={cn(pathname === '/visits' ? "text-bisko-500" : "")} />} 
              isActive={pathname === '/visits'}
            />
            <NavItem 
              to="/billing" 
              label="Factures" 
              icon={<FileText className={cn(pathname === '/billing' ? "text-bisko-500" : "")} />}
              isActive={pathname === '/billing'}
            />
            <NavItem 
              to="/reports" 
              label="Rapports" 
              icon={<BarChart3 className={cn(pathname === '/reports' ? "text-bisko-500" : "")} />}
              isActive={pathname === '/reports'}
            />
            <NavItem 
              to="/profile" 
              label="Profil" 
              icon={<User className={cn(pathname === '/profile' ? "text-bisko-500" : "")} />}
              isActive={pathname === '/profile'}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
