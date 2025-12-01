import React from 'react';
import { Supervisor, Department } from '../types';
import { GOOGLE_SHEET_URL } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: Supervisor | null;
  onLogout: () => void;
  navigate: (path: string) => void;
  currentPath: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, navigate, currentPath }) => {
  if (!currentUser) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-finantx-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-finantx-800">
          <h1 className="text-2xl font-bold tracking-tight">Finantx<span className="text-finantx-500">.</span></h1>
          <p className="text-xs text-slate-400 mt-1">Contractor Tracking</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate('/track-hours')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              currentPath === '/track-hours' ? 'bg-finantx-600 text-white' : 'hover:bg-finantx-800 text-slate-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Track Hours
          </button>

          <button
            onClick={() => navigate('/manage-employees')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
              currentPath === '/manage-employees' ? 'bg-finantx-600 text-white' : 'hover:bg-finantx-800 text-slate-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Employees
          </button>

          {currentUser.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                currentPath === '/admin' ? 'bg-finantx-600 text-white' : 'hover:bg-finantx-800 text-slate-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Super Admin
            </button>
          )}

          <div className="pt-6 mt-6 border-t border-finantx-800">
             <a 
              href={GOOGLE_SHEET_URL} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm text-green-400 hover:text-green-300 transition-colors"
             >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c1.374 0 2.652.324 3.8.895l-1.095 1.776a7.95 7.95 0 0 0-2.705-.671c-4.411 0-8 3.589-8 8s3.589 8 8 8c4.411 0 8-3.589 8-8 0-1.035-.2-2.024-.564-2.936l1.76-1.085A9.957 9.957 0 0 1 22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.33 3.33L12.003 10.5 8.67 5.33a8.03 8.03 0 0 1 6.66 0zM7.5 7.5l2.165 3.5-3.5 2.165a8.028 8.028 0 0 1 1.335-5.665zM5.33 8.67l3.5 2.165-2.165 3.5a8.028 8.028 0 0 1-1.335-5.665zm13.34 0a8.028 8.028 0 0 1-1.335 5.665l-3.5-2.165 2.165-3.5zm-3.5 12.165 2.165-3.5 3.5 2.165a8.028 8.028 0 0 1-5.665 1.335zM12 13.5l3.33 5.17a8.03 8.03 0 0 1-6.66 0L12 13.5z"/></svg>
                View Master Sheet
             </a>
          </div>
        </nav>

        <div className="p-4 border-t border-finantx-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-finantx-500 flex items-center justify-center text-sm font-bold text-white">
              {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentUser.firstName}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.isAdmin ? 'Super Admin' : 'Supervisor'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 text-xs font-medium text-center text-finantx-100 border border-finantx-600 rounded hover:bg-finantx-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 relative">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
