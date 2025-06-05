import React from 'react';
import { Header } from '@shadcn/ui';
import { Button } from '@shadcn/ui';
import { LucideIcons } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Legal Drafter</h1>
          <nav>
            <Button variant="ghost" className="mr-2">Home</Button>
            <Button variant="ghost">About</Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Legal Drafter. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
