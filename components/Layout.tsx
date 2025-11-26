import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, PlusCircle, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/employees" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-indigo-100 transition-colors">
            <Users className="w-6 h-6" />
            <span>EMS Portal</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              to="/employees"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive('/employees') ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-600 text-indigo-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </Link>
            <Link
              to="/employees/new"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive('/employees/new') ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-600 text-indigo-100'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Employee</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © {new Date().getFullYear()} EMS Portal. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/employees" className="hover:text-white transition-colors">Employees</Link>
            <Link to="/employees/new" className="hover:text-white transition-colors">Add New</Link>
            <span className="cursor-not-allowed opacity-50">Privacy Policy</span>
            <span className="cursor-not-allowed opacity-50">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;