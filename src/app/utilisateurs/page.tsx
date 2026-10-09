'use client';
import { useState, useEffect } from 'react';
import { useAppStore, User, UserRole } from '@/store/useAppStore';
import { Plus, Search, Trash2, Edit3, Shield, User as UserIcon, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UtilisateursPage() {
  const users = useAppStore(state => state.users);
  const addUser = useAppStore(state => state.addUser);
  const updateUser = useAppStore(state => state.updateUser);
  const removeUser = useAppStore(state => state.removeUser);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('COLLABORATEUR');
  const [color, setColor] = useState('#fbbf24');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const openCreateModal = () => {
    setSelectedUser(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setRole('COLLABORATEUR');
    setColor('#fbbf24');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setUsername(user.username || '');
    setPassword(user.password || '');
    setRole(user.role);
    setColor(user.color);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUser(selectedUser.id, { firstName, lastName, email, username, password, role, color });
    } else {
      addUser({ firstName, lastName, email, username, password, role, color, isActive: true, showInPlanning: true });
    }
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      {/* HEADER */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Utilisateurs (RH)</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{users.length} collaborateurs enregistrés</p>
        </div>
        <button onClick={openCreateModal} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-gray-900/20">
          <Plus size={20} /> Nouvel Utilisateur
        </button>
      </header>

      {/* TOOLBAR */}
      <div className="bg-white px-8 py-4 border-b border-gray-100 flex gap-4 shrink-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl flex-1 border border-gray-200 focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all max-w-md">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Rechercher un collaborateur..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4 w-16 text-center">Couleur</th>
                <th className="p-4">Identité</th>
                <th className="p-4">Rôle</th>
                <th className="p-4 text-center">Accès App</th>
                <th className="p-4 text-center">Planning</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map((user, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }} 
                  key={user.id} 
                  className="hover:bg-gray-50 transition group"
                >
                  <td className="p-4 flex justify-center">
                    <div className="w-8 h-8 rounded-full shadow-inner border-2 border-white" style={{ backgroundColor: user.color }}></div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 w-max ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'ADMIN' ? <Shield size={12} /> : <UserIcon size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={user.isActive} onChange={() => updateUser(user.id, { isActive: !user.isActive })} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-brand)]"></div>
                    </label>
                  </td>
                  <td className="p-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={user.showInPlanning} onChange={() => updateUser(user.id, { showInPlanning: !user.showInPlanning })} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(user)} className="text-gray-400 hover:text-[var(--color-brand)] transition p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => removeUser(user.id)} className="text-gray-400 hover:text-red-500 transition p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    Aucun collaborateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CRÉATION / ÉDITION UTILISATEUR */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black text-gray-900">{selectedUser ? 'Éditer le profil' : 'Nouvel Utilisateur'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-200 rounded-full transition"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 overflow-auto space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Prénom</label>
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Identifiant App</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="ex: t.poseur" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                    <input type="text" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Rôle</label>
                  <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                    <option value="COLLABORATEUR">Collaborateur (Artisan)</option>
                    <option value="ADMIN">Administrateur (Bureau)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Couleur (Planning)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-none bg-transparent" />
                    <span className="text-sm font-medium text-gray-500">{color}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">Annuler</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition shadow-lg flex items-center gap-2"><Save size={16}/> Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
