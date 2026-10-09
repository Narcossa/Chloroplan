'use client';
import { useAppStore } from '@/store/useAppStore';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Plus, Inbox } from 'lucide-react';
import { useState, useEffect } from 'react';

// Helpers pour avoir les dates de la semaine courante
const getWeekDays = () => {
  const curr = new Date();
  const first = curr.getDate() - curr.getDay() + 1; // Lundi
  return [0, 1, 2, 3, 4].map(i => {
    const d = new Date(curr.setDate(first + i));
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });
};

export default function PlanningPage() {
  const tasks = useAppStore(state => state.tasks);
  const allUsers = useAppStore(state => state.users);
  const users = allUsers.filter(u => u.showInPlanning);
  const updateTaskLocation = useAppStore(state => state.updateTaskLocation);
  const updateTaskStatus = useAppStore(state => state.updateTaskStatus);

  const [mounted, setMounted] = useState(false);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  useEffect(() => {
    setWeekDays(getWeekDays());
    setMounted(true);
  }, []);

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  if (!mounted) return null;

  // Drag state
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, assigneeId: string, dayDate: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskLocation(taskId, assigneeId, dayDate);
      updateTaskStatus(taskId, 'EN_COURS');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Tâches non assignées ou sans date (Backlog)
  const unassignedTasks = tasks.filter(t => !t.assigneeId || !t.dueDate);

  const handleUnassignDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskLocation(taskId, '', '');
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Planning & Équipes</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="p-2 hover:bg-white rounded shadow-sm transition"><ChevronLeft size={18}/></button>
            <span className="px-4 py-2 text-sm font-bold text-gray-700">Semaine en cours</span>
            <button className="p-2 hover:bg-white rounded shadow-sm transition"><ChevronRight size={18}/></button>
          </div>
          <button className="bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-brand-dark)] transition">
            <Plus size={20} /> Nouvelle Tâche
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto flex">
        {/* BACKLOG (AFFECTATIONS EN ATTENTE) */}
        <aside 
          className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10 shrink-0"
          onDrop={handleUnassignDrop}
          onDragOver={handleDragOver}
        >
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Inbox size={18} className="text-gray-500" />
            <h2 className="font-bold text-gray-700">À planifier ({unassignedTasks.length})</h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50/50">
            {unassignedTasks.map(task => (
              <div 
                key={task.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-[var(--color-brand)] hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${task.priority === 'URGENTE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {task.priority}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">{task.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
              </div>
            ))}
            {unassignedTasks.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-8 italic">Toutes les tâches sont planifiées.</p>
            )}
          </div>
        </aside>

        {/* GRILLE PLANNING */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs uppercase tracking-wider text-gray-500 font-bold border-r border-gray-100 w-48 shrink-0"><Users size={16} className="inline mr-2"/>Collaborateurs</th>
                  {weekDays.map((date, i) => (
                    <th key={date} className="p-4 text-xs uppercase tracking-wider text-gray-500 font-bold text-center border-r border-gray-50">
                      {dayNames[i]} <span className="block text-[10px] text-gray-400 font-normal">{new Date(date).toLocaleDateString('fr-FR')}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 h-32 transition-colors">
                    <td className="p-4 border-r border-gray-100 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: user.color }}>{user.firstName[0]}</div>
                        <span className="font-bold text-gray-900 text-sm leading-tight">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    {weekDays.map(date => {
                      // Tasks for this user on this day
                      const dayTasks = tasks.filter(t => t.assigneeId === user.id && t.dueDate === date);
                      
                      return (
                        <td 
                          key={`${user.id}-${date}`} 
                          className="p-2 border-r border-gray-50 border-dashed align-top"
                          onDrop={(e) => handleDrop(e, user.id, date)}
                          onDragOver={handleDragOver}
                        >
                          <div className="w-full h-full min-h-[5rem] rounded-lg border-2 border-transparent hover:border-gray-200 border-dashed transition-colors flex flex-col gap-2 p-1">
                            {dayTasks.map(task => (
                              <div 
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                className="bg-[var(--color-brand-gray)] border border-emerald-200 text-emerald-900 p-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition"
                              >
                                <p className="text-xs font-bold line-clamp-2">{task.title}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
