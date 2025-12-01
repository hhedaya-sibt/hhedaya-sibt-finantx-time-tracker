import React, { useState } from 'react';
import { Supervisor, Department } from '../types';
import { DEPARTMENTS } from '../constants';

interface SuperAdminDashboardProps {
  supervisors: Supervisor[];
  setSupervisors: (s: Supervisor[]) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ supervisors, setSupervisors }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Supervisor>>({
    firstName: '',
    lastName: '',
    email: '',
    departments: [],
    isAdmin: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    if (editingId) {
      setSupervisors(supervisors.map(s => s.id === editingId ? { ...s, ...formData } as Supervisor : s));
    } else {
      const newSup: Supervisor = {
        id: `sup-${Date.now()}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        departments: formData.departments || [],
        isAdmin: formData.isAdmin || false
      };
      setSupervisors([...supervisors, newSup]);
    }
    handleCloseModal();
  };

  const handleEdit = (supervisor: Supervisor) => {
    setFormData(supervisor);
    setEditingId(supervisor.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this supervisor?')) {
      setSupervisors(supervisors.filter(s => s.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ firstName: '', lastName: '', email: '', departments: [], isAdmin: false });
  };

  const toggleDepartment = (dept: Department) => {
    const currentDepts = formData.departments || [];
    if (currentDepts.includes(dept)) {
      setFormData({ ...formData, departments: currentDepts.filter(d => d !== dept) });
    } else {
      setFormData({ ...formData, departments: [...currentDepts, dept] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Department Supervisors</h2>
          <p className="text-slate-500">Manage access and department assignments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-finantx-600 hover:bg-finantx-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          Add Supervisor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Departments</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {supervisors.map(sup => (
              <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{sup.firstName} {sup.lastName}</td>
                <td className="px-6 py-4 text-slate-600">{sup.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {sup.departments.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100">
                        {d}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {sup.isAdmin ? <span className="text-purple-600 font-medium">Super Admin</span> : 'Supervisor'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(sup)} className="text-slate-400 hover:text-finantx-600 font-medium text-sm">Edit</button>
                  <button onClick={() => handleDelete(sup.id)} className="text-slate-400 hover:text-red-600 font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{editingId ? 'Edit' : 'Add'} Supervisor</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input 
                    required 
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-finantx-500 focus:border-finantx-500 outline-none"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input 
                    required 
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-finantx-500 focus:border-finantx-500 outline-none"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required 
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-finantx-500 focus:border-finantx-500 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Departments</label>
                <div className="grid grid-cols-1 gap-2">
                  {DEPARTMENTS.map(dept => (
                    <label key={dept} className="flex items-center gap-2 p-2 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.departments?.includes(dept)}
                        onChange={() => toggleDepartment(dept)}
                        className="rounded text-finantx-600 focus:ring-finantx-500"
                      />
                      <span className="text-sm text-slate-700">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onChange={e => setFormData({...formData, isAdmin: e.target.checked})}
                  className="rounded text-finantx-600 focus:ring-finantx-500"
                />
                <label htmlFor="isAdmin" className="text-sm font-medium text-slate-700">Grant Super Admin Privileges</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-finantx-600 text-white hover:bg-finantx-700 rounded-lg shadow-sm">Save Supervisor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
