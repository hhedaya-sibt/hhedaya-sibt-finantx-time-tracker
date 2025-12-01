import React, { useState } from 'react';
import { Employee, Supervisor, Department } from '../types';
import { DEPARTMENTS } from '../constants';

interface EmployeeManagementProps {
  employees: Employee[];
  setEmployees: (e: Employee[]) => void;
  currentUser: Supervisor;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, setEmployees, currentUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter accessible departments for the current supervisor (unless super admin)
  const accessibleDepartments = currentUser.isAdmin 
    ? DEPARTMENTS 
    : DEPARTMENTS.filter(d => currentUser.departments.includes(d));

  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    rate: 0,
    department: accessibleDepartments[0]
  });

  const filteredEmployees = employees.filter(e => 
    currentUser.isAdmin || currentUser.departments.includes(e.department)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.department) return;

    if (editingId) {
      setEmployees(employees.map(emp => emp.id === editingId ? { ...emp, ...formData } as Employee : emp));
    } else {
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email || '',
        rate: Number(formData.rate) || 0,
        department: formData.department!
      };
      setEmployees([...employees, newEmp]);
    }
    handleCloseModal();
  };

  const handleEdit = (emp: Employee) => {
    setFormData(emp);
    setEditingId(emp.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      rate: 0,
      department: accessibleDepartments[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Employees</h2>
          <p className="text-slate-500">Add or edit contractors for your departments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-finantx-600 hover:bg-finantx-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Hourly Rate</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">No employees found in your departments.</td>
              </tr>
            ) : (
              filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                      {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">${emp.rate.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{emp.email}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(emp)} className="text-finantx-600 hover:text-finantx-800 font-medium text-sm">Edit</button>
                    <button onClick={() => handleDelete(emp.id)} className="text-red-400 hover:text-red-600 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{editingId ? 'Edit' : 'New'} Employee</h3>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-finantx-500 focus:border-finantx-500 outline-none bg-white"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value as Department})}
                  >
                    {accessibleDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required 
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-finantx-500 focus:border-finantx-500 outline-none"
                    value={formData.rate}
                    onChange={e => setFormData({...formData, rate: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-finantx-600 text-white hover:bg-finantx-700 rounded-lg shadow-sm">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
