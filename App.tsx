import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { EmployeeManagement } from './components/EmployeeManagement';
import { TimeEntryGrid } from './components/TimeEntryGrid';
import { AppState, Employee, Supervisor, WeeklyTimeSheet } from './types';
import { loadState, saveState, clearData } from './services/mockStorage';
import { INITIAL_SUPERVISORS } from './constants';

export default function App() {
  // Simple Hash-based routing without react-router library dependencies for this single-file output requirement
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  
  const [state, setState] = useState<AppState>(loadState());

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save state on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLogin = (email: string) => {
    const user = state.supervisors.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      navigate('/track-hours');
    } else {
      alert('User not found. Please use an authorized email address.');
    }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    navigate('/');
  };

  // State Updaters
  const updateSupervisors = (supervisors: Supervisor[]) => setState(prev => ({ ...prev, supervisors }));
  const updateEmployees = (employees: Employee[]) => setState(prev => ({ ...prev, employees }));
  const updateGoogleScriptUrl = (url: string) => setState(prev => ({ ...prev, googleScriptUrl: url }));
  
  const updateTimeSheet = (sheet: WeeklyTimeSheet) => {
    setState(prev => {
      // Remove old version of this specific sheet and add new one
      const others = prev.timeSheets.filter(
        s => !(s.employeeId === sheet.employeeId && s.weekStartDate === sheet.weekStartDate)
      );
      return { ...prev, timeSheets: [...others, sheet] };
    });
  };

  // --- Views ---

  if (!state.currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Finantx<span className="text-finantx-500">.</span></h1>
            <p className="text-slate-500 mt-2">Contractor Time Tracking Portal</p>
          </div>
          
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
               <input 
                 id="login-email"
                 type="email" 
                 placeholder="name@finantx.com"
                 className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white placeholder-slate-200 font-medium focus:ring-2 focus:ring-finantx-500 outline-none"
                 onKeyDown={(e) => {
                   if(e.key === 'Enter') handleLogin(e.currentTarget.value);
                 }}
               />
             </div>
             <button 
               onClick={() => {
                 const input = document.getElementById('login-email') as HTMLInputElement;
                 handleLogin(input.value);
               }}
               className="w-full bg-finantx-600 hover:bg-finantx-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
             >
               Access Dashboard
             </button>
             
             <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
               <p className="font-bold mb-1">Authorized Users:</p>
               <div className="space-y-1 text-xs font-mono">
                 <p>hhedaya@senditbytext.com</p>
                 <p>sheri33600@gmail.com</p>
                 <p>seye@cardshield.me</p>
                 <p>jvorbeck@cardshield.me</p>
                 <p>atozier@cardshield.me</p>
               </div>
             </div>

             <div className="text-center pt-4">
               <button onClick={clearData} className="text-xs text-slate-400 hover:text-red-500 underline">Reset App Data</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/admin':
        return state.currentUser?.isAdmin ? (
          <SuperAdminDashboard 
            supervisors={state.supervisors} 
            setSupervisors={updateSupervisors} 
            googleScriptUrl={state.googleScriptUrl}
            setGoogleScriptUrl={updateGoogleScriptUrl}
          />
        ) : (
          <div className="p-4 text-red-500">Access Denied</div>
        );
      case '/manage-employees':
        return (
          <EmployeeManagement 
            employees={state.employees} 
            setEmployees={updateEmployees} 
            currentUser={state.currentUser!}
          />
        );
      case '/track-hours':
      default:
        return (
          <TimeEntryGrid 
            employees={state.employees}
            timeSheets={state.timeSheets}
            updateTimeSheet={updateTimeSheet}
            currentUser={state.currentUser!}
            googleScriptUrl={state.googleScriptUrl}
          />
        );
    }
  };

  return (
    <Layout 
      currentUser={state.currentUser} 
      onLogout={handleLogout} 
      navigate={navigate}
      currentPath={currentPath}
    >
      {renderContent()}
    </Layout>
  );
}