import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const PersonaHeader: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="sticky top-0 z-40 bg-foreground text-background py-3 px-4 text-center font-bold shadow-lg">
      您的當前身份：
      <span className="ml-2 px-3 py-1 rounded border border-primary text-primary">
        {user?.persona || user?.username || '訪客 (未評測)'}
      </span>
    </div>
  );
};

export default PersonaHeader;
