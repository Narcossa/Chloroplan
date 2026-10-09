'use client';
import { useState } from 'react';
import { useAppStore, Task, Priority, TaskStatus } from '@/store/useAppStore';
import { Plus, Search, Filter, Trash2, Calendar, User as UserIcon, AlertCircle, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TachesPage() {
  const tasks = useAppStore(state => state.tasks);
  const users = useAppStore(state => state.users);
  const clients = useAppStore(state => state.clients);
  const addTask = useAppStore(state => state.addTask);
  const removeTask = useAppStore(state => state.removeTask);
  const updateTaskStatus = useAppStore(state => state.updateTaskStatus);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [priority, setPriority] = useState<Priority>('MOYENNE');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const getAssignee = (id?: string) => users.find(u => u.id === id);
  const getClient = (id: string) => clients.find(c => c.id === id);

  const openCreateModal = () => {
    setSelectedTask(null);
    setTitle('');
    setDescription('');
    setClientId(clients[0]?.id || '');
    setPriority('MOYENNE');
    setAssigneeId('');
    setDueDate('');
    setIsModalOpen(true);
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setClientId(task.clientId);
    setPriority(task.priority);
    setAssigneeId(task.assigneeId || '');
    setDueDate(task.dueDate || '');
    setIsModalOpen(true);
  };

  const updateTask = useAppStore(state => state.updateTask);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      updateTask(selectedTask.id, {
        title,
        description,
        clientId,
        priority,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined
      });
    } else {
      addTask({
        title,
        description,
        clientId,
        chantierId: '',
        priority,
        status: 'A_FAIRE',
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined
      });
    }
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion des Tâches</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{tasks.length} tâches au total</p>
        </div>
        <button onClick={openCreateModal} className="bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-brand-dark)] transition shadow-lg shadow-green-900/20">
          <Plus size={20} /> Créer une tâche
        </button>
      </header>

      {/* TOOLBAR */}
      <div className="bg-white px-8 py-4 border-b border-gray-100 flex gap-4 shrink-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl flex-1 border border-gray-200 focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Rechercher par mot-clé..." className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Tâche</th>
                <th className="p-4">Client</th>
                <th className="p-4">Priorité</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Assigné à</th>
                <th className="p-4">Échéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())).map((task, i) => {
                const assignee = getAssignee(task.assigneeId);
                const client = getClient(task.clientId);
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} 
                    key={task.id} 
                    onClick={() => openTaskDetail(task)}
                    className="hover:bg-gray-50 transition group cursor-pointer"
                  >
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{task.description}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700">{client?.name || 'Inconnu'}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.priority === 'URGENTE' ? 'bg-red-100 text-red-700' : task.priority === 'HAUTE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{task.priority}</span>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        className="text-xs font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-700 border-none cursor-pointer outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      >
                        <option value="A_FAIRE">À FAIRE</option>
                        <option value="EN_COURS">EN COURS</option>
                        <option value="EN_PAUSE">EN PAUSE</option>
                        <option value="TERMINEE">TERMINÉE</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ backgroundColor: assignee.color }}>{assignee.firstName[0]}{assignee.lastName[0]}</div>
                          <span className="text-sm font-medium text-gray-700">{assignee.firstName}</span>
                        </div>
                      ) : <span className="text-xs text-gray-400 font-medium italic">Non assigné</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                        <Calendar size={14} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : '-'}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CRÉATION / ÉDITION TÂCHE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black text-gray-900">{selectedTask ? 'Fiche Tâche' : 'Nouvelle Tâche'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-200 rounded-full transition"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 overflow-auto space-y-6 flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Titre de la tâche</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Ex: Réaliser les fouilles..." />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Détails de la tâche..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Client affecté</label>
                      <select required value={clientId} onChange={e => setClientId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium">
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Priorité</label>
                      <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold">
                        <option value="BASSE">Basse</option>
                        <option value="MOYENNE">Moyenne</option>
                        <option value="HAUTE">Haute</option>
                        <option value="URGENTE">Urgente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Assigner à (Collaborateur)</label>
                      <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium">
                        <option value="">-- Non assigné --</option>
                        {users.filter(u => u.role === 'COLLABORATEUR').map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Date d'échéance</label>
                      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  {selectedTask && (
                     <button type="button" onClick={() => {removeTask(selectedTask.id); setIsModalOpen(false);}} className="px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition mr-auto flex items-center gap-2"><Trash2 size={16}/> Supprimer</button>
                  )}
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">Annuler</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-xl transition shadow-lg flex items-center gap-2"><Save size={16}/> {selectedTask ? 'Enregistrer' : 'Créer la tâche'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
