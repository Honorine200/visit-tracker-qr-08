
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Users, 
  Store, 
  Package, 
  Settings, 
  FileText, 
  ArrowLeft,
  Home
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      active 
        ? "bg-bisko-100 text-bisko-800 font-medium dark:bg-bisko-900/50 dark:text-bisko-300" 
        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const isActive = (path: string) => pathname === path;
  
  const links = [
    { to: "/admin", icon: <BarChart3 size={20} />, label: "Tableau de bord" },
    { to: "/admin/users", icon: <Users size={20} />, label: "Utilisateurs" },
    { to: "/admin/stores", icon: <Store size={20} />, label: "Boutiques" },
    { to: "/admin/products", icon: <Package size={20} />, label: "Produits" },
    { to: "/admin/reports", icon: <FileText size={20} />, label: "Rapports" },
    { to: "/admin/settings", icon: <Settings size={20} />, label: "Paramètres" },
  ];
  
  return (
    <aside className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-xl font-bold text-bisko-600 dark:text-bisko-400">Bisko</span>
            <span className="text-xs px-2 py-0.5 bg-bisko-100 text-bisko-800 rounded dark:bg-bisko-900 dark:text-bisko-300">
              Admin
            </span>
          </div>
          
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-bisko-600 dark:hover:text-bisko-400 mb-6"
          >
            <ArrowLeft size={16} />
            <span>Retour à l'application</span>
          </Link>
        </div>
        
        <nav className="space-y-1 flex-1">
          {links.map(link => (
            <SidebarLink 
              key={link.to} 
              to={link.to} 
              icon={link.icon} 
              label={link.label} 
              active={isActive(link.to)} 
            />
          ))}
        </nav>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
          <Link 
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-bisko-600 dark:hover:text-bisko-400"
          >
            <Home size={16} />
            <span>Accueil principal</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
