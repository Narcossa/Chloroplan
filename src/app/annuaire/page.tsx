'use client';
import { useAppStore, Supplier } from '@/store/useAppStore';
import { Building2, Search, Phone, Mail, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnnuairePage() {
  const suppliers = useAppStore(state => state.suppliers);
  const addSupplier = useAppStore(state => state.addSupplier);
  const updateSupplier = useAppStore(state => state.updateSupplier);
  const removeSupplier = useAppStore(state => state.removeSupplier);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const openCreateModal = () => {
    setSelectedSupplier(null);
    setCompanyName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setCategory('Matériaux');
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setCompanyName(supplier.companyName);
    setContactName(supplier.contactName);
    setPhone(supplier.phone);
    setEmail(supplier.email);
    setCategory(supplier.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, { companyName, contactName, phone, email, category });
    } else {
      addSupplier({ companyName, contactName, phone, email, category });
    }
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Annuaire Fournisseurs</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{suppliers.length} fournisseurs enregistrés</p>
        </div>
        <button onClick={openCreateModal} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-gray-900/20">
          <Plus size={20} /> Ajouter Contact
        </button>
      </header>
      
      <div className="bg-white px-8 py-4 border-b border-gray-100 flex shrink-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl flex-1 border border-gray-200 focus-within:ring-2 max-w-xl">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Rechercher une entreprise..." className="bg-transparent border-none outline-none w-full text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white border border-dashed rounded-xl">Aucun fournisseur.</div>
          ) : (
            suppliers.filter(s => s.companyName.toLowerCase().includes(searchTerm.toLowerCase())).map((supplier, i) => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.05 }} key={supplier.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative group hover:shadow-md transition">
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(supplier)} className="text-gray-400 hover:text-[var(--color-brand)] p-2 bg-gray-50 rounded-lg"><Edit3 size={16}/></button>
                  <button onClick={() => removeSupplier(supplier.id)} className="text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-lg"><Trash2 size={16}/></button>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{supplier.companyName}</h3>
                    <p className="text-sm text-gray-500 font-medium">{supplier.contactName}</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{supplier.category}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {supplier.phone}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {supplier.email}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* MODAL CRÉATION / ÉDITION FOURNISSEUR */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black text-gray-900">{selectedSupplier ? 'Éditer le fournisseur' : 'Nouveau Fournisseur'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-200 rounded-full transition"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 overflow-auto space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nom de l'entreprise</label>
                  <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Contact principal</label>
                  <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                  <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="ex: Matériaux, Outillage..." />
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
