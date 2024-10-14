import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center">
        <FileText className="w-8 h-8 mr-2" />
        <h1 className="text-2xl font-bold">报销系统</h1>
      </div>
    </header>
  );
};

export default Header;