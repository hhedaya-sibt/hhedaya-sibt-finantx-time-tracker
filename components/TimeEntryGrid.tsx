import React, { useState, useEffect } from 'react';
import { Employee, Supervisor, WeeklyTimeSheet } from '../types';
import { SUBMISSION_EMAIL, GOOGLE_SHEET_URL } from '../constants';
import { generateEmailDraft } from '../services/geminiService';

interface TimeEntryGridProps {
  employees: Employee[];
  timeSheets: WeeklyTimeSheet[];
  updateTimeSheet: (sheet: WeeklyTimeSheet) => void;
  currentUser: Supervisor;
}

// Utility to get the Monday of the previous week
const getPreviousMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day - 6 + (day === 0 ? -6 : 1); // adjust when day is sunday
  const prevMon = new Date(d.setDate(diff));
  prevMon.setHours(0, 0, 0, 0);
  return prevMon;
};

// Format date for display: "12/1/25"
const formatDateShort = (d: Date) => {
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
};

// Format date for key: "YYYY-MM-DD"
const formatDateKey = (d: Date) => {
  return d.toISOString().split('T')[0];
};

export const TimeEntryGrid: React.FC<TimeEntryGridProps> = ({ employees, timeSheets, updateTimeSheet, currentUser }) => {
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(getPreviousMonday());
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate the 6 days (Mon-Sat) for columns
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(selectedWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const accessibleEmployees = employees.filter(e => 
    currentUser.isAdmin || currentUser.departments.includes(e.department)
  );

  const getHours = (empId: string, dateStr: string): string => {
    const sheet = timeSheets.find(s => s.employeeId === empId && s.weekStartDate === formatDateKey(selectedWeekStart));
    return sheet?.entries[dateStr]?.toString() || '';
  };

  const handleHourChange = (empId: string, dateStr: string, value: string) => {
    const numVal = value === '' ? 0 : parseFloat(value);
    if (isNaN(numVal) || numVal < 0) return; // Basic validation

    const weekKey = formatDateKey(selectedWeekStart);
    let sheet = timeSheets.find(s => s.employeeId === empId && s.weekStartDate === weekKey);

    if (!sheet) {
      sheet = {
        employeeId: empId,
        weekStartDate: weekKey,
        entries: {},
        submitted: false
      };
    }

    const newEntries = { ...sheet.entries, [dateStr]: numVal };
    // Remove if 0 to keep clean? Optional. Keeping 0 is fine.
    
    updateTimeSheet({ ...sheet, entries: newEntries });
  };

  const calculateRowTotal = (empId: string) => {
    const weekKey = formatDateKey(selectedWeekStart);
    const sheet = timeSheets.find(s => s.employeeId === empId && s.weekStartDate === weekKey);
    if (!sheet) return 0;
    // Fix: cast Object.values to number[] to avoid 'unknown' type errors in reduce
    return (Object.values(sheet.entries) as number[]).reduce((sum, h) => sum + (h || 0), 0);
  };

  const handlePrepareSubmission = async () => {
    setIsGenerating(true);

    // 1. Gather Data in the exact requested format
    const submissionData = accessibleEmployees.map(emp => {
      const totalHours = calculateRowTotal(emp.id);
      if (totalHours === 0) return null; // Skip employees with no hours? Or include 0. Let's skip empty for email clarity.

      const row: any = {
        "Primary company": "Card Shield", // Hardcoded based on example
        "Employee first name": emp.firstName,
        "Employee last name": emp.lastName,
        "Supervisor first name": currentUser.firstName,
        "Supervisor last name": currentUser.lastName,
        "Total hours": totalHours,
        "Rate": emp.rate,
      };

      weekDays.forEach(day => {
        const dateKey = formatDateKey(day);
        const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
        row[`${dayName} Date`] = formatDateShort(day);
        row[`${dayName} Hours`] = getHours(emp.id, dateKey) || 0;
      });

      return row;
    }).filter(Boolean); // Remove nulls

    if (submissionData.length === 0) {
      alert("No hours entered for this week.");
      setIsGenerating(false);
      return;
    }

    // 2. Generate Email with Gemini
    const { subject, body } = await generateEmailDraft(
      currentUser,
      formatDateShort(selectedWeekStart),
      accessibleEmployees,
      submissionData
    );
    
    setIsGenerating(false);

    // 3. Create Mailto Link
    // Note: mailto links have a length limit. For large datasets, this might truncate.
    // In that case, we fallback to copying to clipboard.
    const mailtoLink = `mailto:${SUBMISSION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open standard email client
    window.location.href = mailtoLink;

    // 4. Log "Fake" Google Sheet Submission
    console.group("Simulated Google Sheet Submission");
    console.log(`POST to ${GOOGLE_SHEET_URL}`);
    console.table(submissionData);
    console.groupEnd();

    alert(`
      1. Email client opened with report.
      2. Data prepared for Google Sheet (Simulated - check console).
      
      Please verify the email content before sending!
    `);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Track Hours</h2>
          <p className="text-slate-500">Enter hours for the week beginning {formatDateShort(selectedWeekStart)}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Week of:</label>
          <input 
            type="date" 
            className="px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg shadow-sm focus:ring-finantx-500 focus:border-finantx-500 outline-none [color-scheme:dark]"
            value={formatDateKey(selectedWeekStart)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              // Ensure we snap to Monday if user picks another day? 
              // For simplicity, let's assume they pick the monday, or we just trust the date picker.
              // Better: force calculate monday.
              const day = d.getDay();
              const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
              d.setDate(diff);
              setSelectedWeekStart(d);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 bg-slate-50 z-10 px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Employee
                </th>
                {weekDays.map(day => (
                  <th key={day.toISOString()} className="px-2 py-4 text-center border-l border-slate-100 min-w-[100px]">
                    <div className="text-xs font-bold text-slate-700 uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">{formatDateShort(day)}</div>
                  </th>
                ))}
                <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 w-24 border-l border-slate-200">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessibleEmployees.map(emp => {
                const total = calculateRowTotal(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="sticky left-0 bg-white group-hover:bg-slate-50 z-10 px-4 py-3 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="font-medium text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-xs text-slate-400">{emp.department}</div>
                    </td>
                    {weekDays.map(day => {
                      const dateKey = formatDateKey(day);
                      return (
                        <td key={dateKey} className="p-1 border-r border-slate-50">
                          <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            placeholder="-"
                            className="w-full h-10 text-center rounded bg-slate-700 text-white placeholder-slate-400 focus:bg-slate-600 focus:ring-2 focus:ring-finantx-500 outline-none transition-all font-mono"
                            value={getHours(emp.id, dateKey)}
                            onChange={(e) => handleHourChange(emp.id, dateKey, e.target.value)}
                          />
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-center font-bold text-finantx-700 bg-slate-50 border-l border-slate-200">
                      {total > 0 ? total : '-'}
                    </td>
                  </tr>
                );
              })}
              {accessibleEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No employees assigned to your departments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
           <div className="text-xs text-slate-500">
             <span className="font-semibold text-slate-700">Note:</span> Data is auto-saved locally. Submit to notify Admin.
           </div>
           <button
             onClick={handlePrepareSubmission}
             disabled={isGenerating || accessibleEmployees.length === 0}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all ${
               isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
             }`}
           >
             {isGenerating ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Analyzing...
               </>
             ) : (
               <>
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                 Submit Weekly Report
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};