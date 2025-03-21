
import React from 'react';
import StoresList from '@/components/Stores/StoresList';

const Stores: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des boutiques</h1>
      <StoresList />
    </div>
  );
};

export default Stores;
