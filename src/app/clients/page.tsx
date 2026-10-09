'use client';
import { useState } from 'react';
import { useAppStore, Client } from '@/store/useAppStore';
import { Plus, Search, MapPin, Phone, Mail, ChevronRight, Briefcase, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientsPage() {
  const clients = useAppStore(state => state.clients);
  const tasks = useAppStore(state => state.tasks);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const getClientTasksCount = (clientId: string) => tasks.filter(t => t.clientId === clientId).length;

  const addClient = useAppStore(state => state.addClient);
  const updateClient = useAppStore(state => state.updateClient);

  const openCreateModal = () => {
    setSelectedClient(null);
    setName('');
    setAddress('');
    setPhone('');
    setEmail('');
    setIsModalOpen(true);
  };

  const openClientDetail = (client: Client) => {
    setSelectedClient(client);
    setName(client.name);
    setAddress(client.address);
    setPhone(client.phone);
    setEmail(client.email);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
      updateClient(selectedClient.id, { name, address, phone, email });
    } else {
      addClient({ name, address, phone, email });
    }
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Base Clients</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{clients.length} clients référencés</p>
        </div>
        <button onClick={openCreateModal} className="bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-brand-dark)] transition shadow-lg shadow-green-900/20">
          <Plus size={20} /> Nouveau Client
        </button>
      </header>

      {/* TOOLBAR */}
      <div className="bg-white px-8 py-4 border-b border-gray-100 flex gap-4 shrink-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl flex-1 border border-gray-200 focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all max-w-md">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Rechercher un client (nom, email)..." className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((client, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} 
              key={client.id} 
              onClick={() => openClientDetail(client)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Briefcase size={12} /> {getClientTasksCount(client.id)} tâches
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{client.name}</h3>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} className="text-gray-400" /><span className="truncate">{client.address}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Phone size={14} className="text-gray-400" /><span>{client.phone}</span></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Mail size={14} className="text-gray-400" /><span className="truncate">{client.email}</span></div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-bold text-[var(--color-brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                Voir la fiche client <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL CRÉATION / ÉDITION CLIENT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black text-gray-900">{selectedClient ? 'Fiche Client' : 'Nouveau Client'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-200 rounded-full transition"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 overflow-auto space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet / Raison sociale</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Ex: Jean Dupont" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Adresse postale</label>
                  <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Ex: 12 rue des Fleurs, 44000 Nantes" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="06 12 34 56 78" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="contact@client.fr" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">Annuler</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-xl transition shadow-lg flex items-center gap-2"><Save size={16}/> {selectedClient ? 'Mettre à jour' : 'Ajouter le client'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
