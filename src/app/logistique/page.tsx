'use client';
import { Package, Search, Plus, Calendar, Settings } from 'lucide-react';

export default function LogistiquePage() {
  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Logistique & Stocks</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Gestion des stocks et commandes de matériaux</p>
        </div>
      </header>
      
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Module Logistique</h2>
          <p className="text-gray-500 text-sm">Ce module permet de suivre l'inventaire, de préparer les commandes fournisseurs et d'allouer le matériel pour les chantiers. Il sera bientôt disponible.</p>
        </div>
      </div>
    </main>
  );
}
