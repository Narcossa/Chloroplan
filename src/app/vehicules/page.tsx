'use client';
import { useState, useEffect } from 'react';
import { useAppStore, Vehicle } from '@/store/useAppStore';
import { Truck, Plus, FileText, Calendar, Edit3, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VehiculesPage() {
  const vehicles = useAppStore(state => state.vehicles);
  const updateVehicle = useAppStore(state => state.updateVehicle);
  const addVehicle = useAppStore(state => state.addVehicle);
  const [mounted, setMounted] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [immat, setImmat] = useState('');
  const [motDate, setMotDate] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const openCreateModal = () => {
    setSelectedVehicle(null);
    setName('');
    setImmat('');
    setMotDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setName(vehicle.name);
    setImmat(vehicle.immatriculation);
    setMotDate(vehicle.motDate);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVehicle) {
      updateVehicle(selectedVehicle.id, { name, immatriculation: immat, motDate });
    } else {
      addVehicle({ name, immatriculation: immat, motDate, assignedTo: 'Flotte Générale' });
    }
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Flotte de Véhicules</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{vehicles.length} véhicules actifs</p>
        </div>
        <button onClick={openCreateModal} className="bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-brand-dark)] transition shadow-lg shadow-green-900/20">
          <Plus size={20} /> Nouveau véhicule
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v, i) => {
            const daysToMot = Math.ceil((new Date(v.motDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            const isUrgent = daysToMot < 30;
            return (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative group hover:shadow-md transition">
                <div className="absolute top-4 right-4">
                  <button onClick={() => openEditModal(v)} className="text-gray-400 hover:text-[var(--color-brand)] transition p-2 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100"><Edit3 size={16} /></button>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-[var(--color-brand-gray)] text-[var(--color-brand)]'}`}>
                  <Truck size={28} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{v.name}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 w-fit mt-1">{v.immatriculation}</span>
                <p className="text-sm font-medium text-gray-500 mt-3">Assigné à : <span className="font-bold text-gray-900">{v.assignedTo}</span></p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className={`flex items-center gap-2 text-sm font-bold ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
                    <Calendar size={16} /> CT le {new Date(v.motDate).toLocaleDateString('fr-FR')} {isUrgent && `(J-${daysToMot})`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MODAL ÉDITION VÉHICULE */}
      <AnimatePresence>
        {isModalOpen && selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-black text-gray-900">Éditer le véhicule</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-200 rounded-full transition"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 overflow-auto space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Modèle</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Immatriculation</label>
                  <input type="text" required value={immat} onChange={e => setImmat(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Prochain Contrôle Technique</label>
                  <input type="date" required value={motDate} onChange={e => setMotDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">Annuler</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] rounded-xl transition shadow-lg flex items-center gap-2"><Save size={16}/> Enregistrer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
