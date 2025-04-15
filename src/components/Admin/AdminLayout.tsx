
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { getCurrentUser } from '@/utils/authUtils';

const AdminLayout: React.FC = () => {
  const user = getCurrentUser();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col space-y-2 mb-6">
            <div className="inline-flex self-start px-2.5 py-1 bg-bisko-100 dark:bg-bisko-900 rounded-full text-xs font-medium text-bisko-700 dark:text-bisko-300 mb-1">
              Administration
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Administration</h1>
              {user && (
                <div className="text-sm text-muted-foreground">
                  Connecté en tant que: <span className="font-medium">{user.name}</span>
                </div>
              )}
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
