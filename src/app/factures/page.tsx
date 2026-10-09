'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FileText, Search, Plus, Eye, Printer, Download, Trash2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FacturesPage() {
  const invoices = useAppStore(state => state.invoices);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Suivi des Factures</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">{invoices.length} factures générées</p>
        </div>
      </header>

      <div className="bg-white px-8 py-4 border-b border-gray-100 flex gap-4 shrink-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl flex-1 border border-gray-200">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Recherche par artisan, date..." className="bg-transparent border-none outline-none w-full text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100"><Filter size={16} /> Statut</button>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
                <th className="p-4">Date</th>
                <th className="p-4">Artisan</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Heures</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Aucune facture trouvée.</td></tr>
              ) : invoices.map((inv, i) => (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.05 }} key={inv.id} className="hover:bg-gray-50 group">
                  <td className="p-4 text-sm font-medium">{new Date(inv.date).toLocaleDateString('fr-FR')}</td>
                  <td className="p-4 font-bold text-gray-900">{inv.artisanId}</td>
                  <td className="p-4 text-sm text-gray-500">{inv.description}</td>
                  <td className="p-4 text-center font-bold">{inv.hours}h</td>
                  <td className="p-4 text-right font-black text-[var(--color-brand)]">{inv.amount} €</td>
                  <td className="p-4">
                    <select className="text-xs font-bold px-2 py-1 rounded-md bg-gray-100 outline-none" defaultValue={inv.status}>
                      <option value="VERIFIEE">VERIFIÉE</option>
                      <option value="TRANSMISSION_PAIE">EN PAIE</option>
                      <option value="PAYEE">PAYÉE</option>
                      <option value="ARCHIVEE">ARCHIVÉE</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => alert("Affichage de la facture (PDF)")} className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-[var(--color-brand)]"><Eye size={16}/></button>
                    <button onClick={() => alert("Téléchargement du PDF en cours...")} className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-blue-500"><Download size={16}/></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
