'use client';
import { useState } from 'react';
import { Save, User, HardHat, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

export default function NouveauChantierPage() {
  const router = useRouter();
  const addChantier = useAppStore(state => state.addChantier);

  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState('');
  const [linearMeters, setLinearMeters] = useState('');
  const [colorRal, setColorRal] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addChantier({
      clientName,
      address,
      phone: '06 00 00 00 00', // Mock
      type,
      progress: 0,
      phaseActuelle: 'Préparation',
      linearMeters: Number(linearMeters) || 0,
      colorRal,
      notes: ''
    });
    router.push('/chantiers');
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ouvrir un Chantier</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Création depuis un devis ou prospect</p>
        </div>
      </header>

      <div className="flex-1 p-8 overflow-auto flex justify-center">
        <form onSubmit={handleSave} className="w-full max-w-3xl space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><User size={20} className="text-[var(--color-brand)]"/> Informations Client</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom du client" className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Adresse du chantier" className="col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><HardHat size={20} className="text-[var(--color-brand)]"/> Détails Techniques</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder="Type de prestation (Clôture, Portail...)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" required />
              <input type="number" value={linearMeters} onChange={e => setLinearMeters(e.target.value)} placeholder="Métrage linéaire" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              <input type="text" value={colorRal} onChange={e => setColorRal(e.target.value)} placeholder="Couleur RAL" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Annuler</button>
            <button type="submit" className="px-6 py-3 font-bold text-white bg-[var(--color-brand)] rounded-xl shadow-lg shadow-green-900/20 hover:bg-[var(--color-brand-dark)] transition flex items-center gap-2">
              <Save size={18}/> Créer le Chantier
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
