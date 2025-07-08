import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
const DashboardLayout: React.FC = () => {
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <ChatBot />
    </div>;
};
export default DashboardLayout;