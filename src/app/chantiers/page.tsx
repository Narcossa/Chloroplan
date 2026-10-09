'use client';
import { useState } from 'react';
import { useAppStore, Chantier } from '@/store/useAppStore';
import { Search, Plus, HardHat, MapPin, Phone, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ChantiersPage() {
  const chantiers = useAppStore(state => state.chantiers);
  const updateChantier = useAppStore(state => state.updateChantier);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedChantier, setSelectedChantier] = useState<Chantier | null>(null);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editProgress, setEditProgress] = useState(0);

  const handleOpenDetail = (chantier: Chantier) => {
    setSelectedChantier(chantier);
    setEditType(chantier.type);
    setEditNotes(chantier.notes || '');
    setEditProgress(chantier.progress);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (selectedChantier) {
      updateChantier(selectedChantier.id, {
        type: editType,
        notes: editNotes,
        progress: editProgress
      });
      setSelectedChantier({ ...selectedChantier, type: editType, notes: editNotes, progress: editProgress });
      setIsEditing(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chantiers en cours</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{chantiers.length} chantiers actifs</p>
        </div>
        <Link href="/chantiers/nouveau" className="bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-brand-dark)] transition shadow-lg shadow-green-900/20">
          <Plus size={20} /> Ouvrir un chantier
        </Link>
      </header>

      <div className="bg-white px-8 py-4 border-b border-gray-100 flex gap-4 shrink-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl flex-1 border border-gray-200 focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Rechercher par nom de client, adresse..." className="bg-transparent border-none outline-none w-full text-sm text-gray-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {chantiers.filter(c => c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.address.toLowerCase().includes(searchTerm.toLowerCase())).map((chantier, i) => (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={chantier.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <HardHat size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${chantier.progress === 100 ? 'bg-green-100 text-green-700' : chantier.progress === 0 ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                    {chantier.phaseActuelle}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2">Chantier : {chantier.clientName}</h3>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="truncate">{chantier.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} className="text-gray-400" />
                    <span>{chantier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-bold text-gray-700">Prestation :</span> {chantier.type} ({chantier.linearMeters}ml)
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Avancement</span>
                    <span>{chantier.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[var(--color-brand)] h-2 rounded-full transition-all" style={{ width: `${chantier.progress}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => handleOpenDetail(chantier)} className="text-sm font-bold text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] flex items-center gap-1 transition">
                  <Eye size={16}/> Voir le dossier
                </button>
              </div>
            </motion.div>
          ))}
          {chantiers.length === 0 && (
             <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">Aucun chantier en cours.</div>
          )}
        </div>
      </div>

      {/* MODAL DOSSIER CHANTIER */}
      <AnimatePresence>
        {selectedChantier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black text-gray-900">Dossier Chantier : {selectedChantier.clientName}</h2>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-sm font-bold bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition">Modifier</button>
                  ) : (
                    <button onClick={handleSaveEdit} className="px-3 py-1.5 text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Enregistrer</button>
                  )}
                  <button onClick={() => setSelectedChantier(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-200 rounded-full transition"><X size={20}/></button>
                </div>
              </div>
              
              <div className="p-6 overflow-auto space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Informations Générales</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm">Type</span>
                        {isEditing ? (
                          <input type="text" value={editType} onChange={(e) => setEditType(e.target.value)} className="border border-gray-300 rounded px-2 py-0.5 text-sm w-32" />
                        ) : (
                          <span className="font-bold text-sm text-gray-900">{selectedChantier.type}</span>
                        )}
                      </li>
                      <li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 text-sm">Couleur RAL</span><span className="font-bold text-sm text-gray-900">{selectedChantier.colorRal}</span></li>
                      <li className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500 text-sm">Métrage (ml)</span><span className="font-bold text-sm text-gray-900">{selectedChantier.linearMeters} ml</span></li>
                    </ul>
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Statut Actuel</h3>
                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="text-xs font-bold text-[var(--color-brand)] mb-1">Phase : {selectedChantier.phaseActuelle}</div>
                        {isEditing ? (
                          <div className="mt-2">
                            <input type="range" min="0" max="100" value={editProgress} onChange={(e) => setEditProgress(Number(e.target.value))} className="w-full" />
                            <div className="text-center text-xs font-bold mt-1">{editProgress}%</div>
                          </div>
                        ) : (
                          <>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div className="bg-[var(--color-brand)] h-2 rounded-full transition-all" style={{ width: `${selectedChantier.progress}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500">Le chantier est actuellement à {selectedChantier.progress}% d'avancement.</p>
                          </>
                        )}
                     </div>
                  </div>
                </div>
                <div>
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Notes Techniques</h3>
                   {isEditing ? (
                     <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="w-full bg-yellow-50 text-yellow-900 p-4 rounded-xl border border-yellow-200 text-sm h-32" />
                   ) : (
                     <div className="bg-yellow-50 text-yellow-900 p-4 rounded-xl border border-yellow-100 text-sm">
                       {selectedChantier.notes || "Aucune note technique spécifiée pour ce chantier."}
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
