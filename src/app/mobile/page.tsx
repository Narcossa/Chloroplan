'use client';
import { useState, useEffect } from 'react';
import { useAppStore, Task } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, AlertTriangle, Clock, MapPin, Truck, Camera, CheckCircle, FileText, CheckSquare, PlusCircle, LogOut, X, Phone, User as UserIcon } from 'lucide-react';

export default function MobileAppPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'TACHES' | 'POINTAGE' | 'FRAIS' | 'URGENCE'>('TACHES');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const tasks = useAppStore(state => state.tasks);
  const chantiers = useAppStore(state => state.chantiers);
  const clients = useAppStore(state => state.clients);
  const currentUser = useAppStore(state => state.currentUser);
  const logout = useAppStore(state => state.logout);
  const updateTaskStatus = useAppStore(state => state.updateTaskStatus);
  const addFieldAlert = useAppStore(state => state.addFieldAlert);
  const addInvoice = useAppStore(state => state.addInvoice);
  const addExpense = useAppStore(state => state.addExpense);

  const [toastMessage, setToastMessage] = useState('');
  
  // Pointage state
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [workedHours, setWorkedHours] = useState<string>('8');
  const [clockInTime, setClockInTime] = useState<Date | null>(null);

  // Note de frais state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Urgence state
  const [selectedUrgence, setSelectedUrgence] = useState<{type: string, title: string, desc: string} | null>(null);
  const [urgenceMessage, setUrgenceMessage] = useState('');

  useEffect(() => setMounted(true), []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUrgence = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUrgence) {
      addFieldAlert({ chantierId: '1', type: selectedUrgence.type, message: urgenceMessage });
      showToast('Alerte envoyée au bureau');
      setSelectedUrgence(null);
      setUrgenceMessage('');
    }
  };

  const handlePointage = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      artisanId: `${currentUser?.firstName} ${currentUser?.lastName}`,
      date: selectedDate,
      description: `Saisie journalière`,
      hours: parseFloat(workedHours) || 8,
      amount: (parseFloat(workedHours) || 8) * 45, // 45€/h mock rate
      status: 'VERIFIEE'
    });
    showToast('Heures validées et pré-facturées !');
  };

  const handleNoteFrais = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      userId: currentUser?.id || 'u2',
      clientId: 'c1',
      amount: parseFloat(expenseAmount),
      date: new Date().toISOString(),
      description: expenseDescription || 'Frais de déplacement',
      status: 'EN_ATTENTE'
    });
    setExpenseAmount('');
    setExpenseDescription('');
    showToast('Note de frais transmise !');
  };

  // Get tasks for logged-in user
  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 pb-24 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-200">
      
      {/* HEADER */}
      <div className="bg-gray-900 text-white p-6 rounded-b-[2rem] shadow-lg sticky top-0 z-20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-400 text-sm font-medium">Connecté(e)</p>
            <h1 className="text-2xl font-black">{currentUser?.firstName || 'Utilisateur'} {currentUser?.lastName || ''}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { logout(); window.location.href = '/login'; }} className="p-2 bg-gray-800 text-gray-400 hover:text-red-500 rounded-full transition">
              <LogOut size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white border-2 border-white shadow-md">
              <HardHat size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 left-4 right-4 z-50 bg-green-500 text-white font-bold p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-md mx-auto">
            <CheckCircle size={20} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-6">
        {/* TABS */}
        <div className="flex bg-gray-200 p-1 rounded-xl overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab('TACHES')} className={`flex-1 min-w-[80px] py-2 text-xs sm:text-sm font-bold rounded-lg transition ${activeTab === 'TACHES' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Tâches</button>
          <button onClick={() => setActiveTab('POINTAGE')} className={`flex-1 min-w-[80px] py-2 text-xs sm:text-sm font-bold rounded-lg transition ${activeTab === 'POINTAGE' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Heures</button>
          <button onClick={() => setActiveTab('FRAIS')} className={`flex-1 min-w-[80px] py-2 text-xs sm:text-sm font-bold rounded-lg transition ${activeTab === 'FRAIS' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Frais</button>
          <button onClick={() => setActiveTab('URGENCE')} className={`flex-1 min-w-[80px] py-2 text-xs sm:text-sm font-bold rounded-lg transition ${activeTab === 'URGENCE' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Terrain</button>
        </div>

        {/* TAB 1 : MES TACHES */}
        {activeTab === 'TACHES' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><CheckSquare className="text-[var(--color-brand)]" /> Mon Programme</h2>
            <div className="space-y-4">
              {myTasks.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl text-gray-500 border border-dashed">Aucune tâche assignée.</div>
              ) : myTasks.map(task => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:bg-gray-50 transition">
                  <div className="shrink-0 mt-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(task.id, task.status === 'TERMINEE' ? 'A_FAIRE' : 'TERMINEE');
                      }}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${task.status === 'TERMINEE' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className={`font-bold text-gray-900 ${task.status === 'TERMINEE' ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    {task.priority === 'URGENTE' && <span className="inline-block mt-2 text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded">URGENT</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 2 : POINTAGE */}
        {activeTab === 'POINTAGE' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-xl text-gray-900 mb-2">Saisie des heures</h2>
              <p className="text-sm text-gray-500 mb-6">Déclarez vos heures travaillées.</p>
              
              <form onSubmit={handlePointage} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Heures effectuées</label>
                  <input 
                    type="number" 
                    step="0.5"
                    min="0"
                    max="24"
                    value={workedHours}
                    onChange={(e) => setWorkedHours(e.target.value)}
                    placeholder="Ex: 8" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900" 
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                  <Clock size={18}/> Valider les heures
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 3 : FRAIS */}
        {activeTab === 'FRAIS' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2"><FileText className="text-gray-400"/> Note de frais</h2>
              <form onSubmit={handleNoteFrais} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100">
                    <Camera size={24} />
                    <span className="text-xs font-bold text-center">Prendre<br/>photo</span>
                  </div>
                  <div className="flex-1 space-y-4 flex flex-col justify-center">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Montant (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="Ex: 45.50" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <input 
                    type="text" 
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="Ex: Repas du midi, péage..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" 
                    required 
                  />
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                  <PlusCircle size={18}/> Soumettre la dépense
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 4 : URGENCE & REMONTÉES */}
        {activeTab === 'URGENCE' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-black text-gray-900 mb-1">Un problème ?</h2>
            <p className="text-sm text-gray-500 mb-6">Prévenez le bureau instantanément.</p>

            <AnimatePresence mode="wait">
              {!selectedUrgence ? (
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-4">
                  <button onClick={() => setSelectedUrgence({type: 'BLOCAGE_CHANTIER', title: 'Blocage Chantier', desc: "Sol imprévu, intempéries, problème d'accès."})} className="bg-red-50 hover:bg-red-100 border border-red-200 p-5 rounded-2xl flex items-start gap-4 transition text-left group">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-red-900 text-lg">Blocage Chantier</h3>
                      <p className="text-red-700/80 text-sm mt-1">Sol imprévu, intempéries, problème d'accès.</p>
                    </div>
                  </button>

                  <button onClick={() => setSelectedUrgence({type: 'TRAVAIL_SUPP', title: 'Travail Supplémentaire', desc: 'Le client demande un ajout non prévu au devis.'})} className="bg-orange-50 hover:bg-orange-100 border border-orange-200 p-5 rounded-2xl flex items-start gap-4 transition text-left group">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-orange-900 text-lg">Travail Supplémentaire</h3>
                      <p className="text-orange-700/80 text-sm mt-1">Le client demande un ajout non prévu au devis.</p>
                    </div>
                  </button>

                  <button onClick={() => setSelectedUrgence({type: 'MATERIEL', title: 'Manque Matériel', desc: 'Rupture de stock sur le chantier, demande de livraison.'})} className="bg-amber-50 hover:bg-amber-100 border border-amber-200 p-5 rounded-2xl flex items-start gap-4 transition text-left group">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-900 text-lg">Manque Matériel</h3>
                      <p className="text-amber-700/80 text-sm mt-1">Rupture de stock sur le chantier, demande de livraison.</p>
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <button onClick={() => setSelectedUrgence(null)} className="text-sm font-bold text-gray-500 hover:text-gray-900 mb-4 flex items-center gap-1">
                    ← Retour
                  </button>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{selectedUrgence.title}</h3>
                  <p className="text-sm text-gray-500 mb-6">{selectedUrgence.desc}</p>
                  
                  <form onSubmit={handleUrgence} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Détails du problème</label>
                      <textarea 
                        rows={4}
                        value={urgenceMessage}
                        onChange={(e) => setUrgenceMessage(e.target.value)}
                        placeholder="Précisez la situation (ex: Sol trop dur pour creuser, besoin brise-roche...)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100">
                        <Camera size={24} />
                        <span className="text-xs font-bold text-center">Ajouter une photo<br/>(Optionnel)</span>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg mt-4">
                      Envoyer l'alerte
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* TASK DETAILS MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: '100%' }} 
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-50 bg-gray-50 flex flex-col max-w-md mx-auto"
          >
            {(() => {
               const chantier = chantiers.find(c => c.id === selectedTask.chantierId);
               const client = clients.find(c => c.id === selectedTask.clientId) || (chantier ? { name: chantier.clientName, phone: chantier.phone, address: chantier.address } : null);
               
               return (
                 <>
                  {/* Modal Header */}
                  <div className="bg-gray-900 text-white p-6 pb-8 rounded-b-[2rem] shadow-lg shrink-0 relative">
                    <button 
                      onClick={() => setSelectedTask(null)}
                      className="absolute top-6 right-6 p-2 bg-gray-800 text-gray-400 hover:text-white rounded-full transition"
                    >
                      <X size={20} />
                    </button>
                    <div className="pr-12">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${selectedTask.status === 'TERMINEE' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {selectedTask.status.replace('_', ' ')}
                        </span>
                        {selectedTask.priority === 'URGENTE' && (
                          <span className="px-2 py-1 text-xs font-bold rounded bg-red-500/20 text-red-400">URGENT</span>
                        )}
                      </div>
                      <h2 className="text-2xl font-black leading-tight">{selectedTask.title}</h2>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Description */}
                    <section>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FileText size={16} /> Description
                      </h3>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-gray-700 whitespace-pre-wrap">
                        {selectedTask.description || "Aucune description fournie."}
                      </div>
                    </section>

                    {/* Chantier / Client Info */}
                    {(chantier || client) && (
                      <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <MapPin size={16} /> Lieu & Contact
                        </h3>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                          {chantier && (
                            <div className="p-4 border-b border-gray-50 flex items-start gap-3">
                              <HardHat className="text-gray-400 shrink-0 mt-0.5" size={20} />
                              <div>
                                <p className="text-xs text-gray-400 font-bold">CHANTIER</p>
                                <p className="font-bold text-gray-900">{chantier.name || chantier.type || 'Chantier'}</p>
                                {chantier.address && <p className="text-sm text-gray-600 mt-1">{chantier.address}</p>}
                              </div>
                            </div>
                          )}
                          
                          {client && (
                            <div className="p-4 border-b border-gray-50 flex items-start gap-3">
                              <UserIcon className="text-gray-400 shrink-0 mt-0.5" size={20} />
                              <div>
                                <p className="text-xs text-gray-400 font-bold">CLIENT</p>
                                <p className="font-bold text-gray-900">{client.name}</p>
                              </div>
                            </div>
                          )}

                          {client?.phone && (
                            <div className="p-4 flex items-center justify-between gap-3 bg-gray-50/50">
                              <div className="flex items-center gap-3">
                                <Phone className="text-gray-400 shrink-0" size={20} />
                                <span className="font-bold text-gray-700">{client.phone}</span>
                              </div>
                              <a href={`tel:${client.phone.replace(/\s/g, '')}`} className="px-4 py-2 bg-[var(--color-brand)] text-white text-sm font-bold rounded-xl shadow-md">
                                Appeler
                              </a>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {/* Useful Info */}
                    {chantier && (chantier as any).notes && (
                      <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <AlertTriangle size={16} /> Notes du chantier
                        </h3>
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-orange-800 text-sm">
                          {(chantier as any).notes}
                        </div>
                      </section>
                    )}

                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <button 
                      onClick={() => {
                        updateTaskStatus(selectedTask.id, selectedTask.status === 'TERMINEE' ? 'A_FAIRE' : 'TERMINEE');
                        setSelectedTask({ ...selectedTask, status: selectedTask.status === 'TERMINEE' ? 'A_FAIRE' : 'TERMINEE' });
                      }}
                      className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition shadow-lg ${
                        selectedTask.status === 'TERMINEE' 
                          ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                          : 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/30'
                      }`}
                    >
                      <CheckCircle size={24} />
                      {selectedTask.status === 'TERMINEE' ? 'Marquer comme À faire' : 'Valider la tâche'}
                    </button>
                  </div>
                 </>
               )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
