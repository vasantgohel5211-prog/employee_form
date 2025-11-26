import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-indigo-50 p-6 rounded-full mb-6">
        <FileQuestion className="w-16 h-16 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been removed or renamed.
      </p>
      <Link
        to="/employees"
        className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;