import React, { useState, useEffect } from 'react';
import LostLockSite from '@/components/LostLockSite';
import AdminPanel from '@/components/AdminPanel';

const Index: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.hash.startsWith('#/admin'));

  useEffect(() => {
    const handleHash = () => {
      setIsAdmin(window.location.hash.startsWith('#/admin'));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return <LostLockSite />;
};

export default Index;
