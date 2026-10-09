'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Briefcase, FileText, HardHat, PackageOpen, Users, MonitorPlay, CheckSquare, Calendar, CreditCard, Truck, UserPlus, BookOpen, Plus, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Sidebar() {
  const pathname = usePathname();
  const materialRequests = useAppStore(state => state.materialRequests);

  // Cacher la sidebar sur certaines vues
  if (pathname === '/mobile' || pathname === '/login') return null;

  return (
    <aside className="w-64 bg-[var(--color-brand-dark)] text-gray-300 flex flex-col shadow-2xl z-20 relative shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-gray-800">
        <Logo className="text-white" />
      </div>
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
        
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-2 px-3">Centre de contrôle</div>
        <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <Briefcase size={18} /> Tableau de Bord
        </Link>
        <Link href="/taches" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/taches' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <CheckSquare size={18} /> Tâches
        </Link>
        <Link href="/clients" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/clients' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <Users size={18} /> Base Clients
        </Link>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-6 px-3">Opérationnel</div>
        <Link href="/chantiers" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/chantiers' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <HardHat size={18} /> Chantiers en cours
        </Link>
        <Link href="/chantiers/nouveau" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/chantiers/nouveau' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <Plus size={18} /> Ouvrir Chantier
        </Link>
        <Link href="/planning" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/planning' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <Calendar size={18} /> Planning & Équipes
        </Link>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-6 px-3">Administratif</div>
        <Link href="/factures" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/factures' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <FileText size={18} /> Factures
        </Link>
        <Link href="/frais" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/frais' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <CreditCard size={18} /> Notes de Frais
        </Link>
        <Link href="/logistique" className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-transform hover:scale-105 ${pathname === '/logistique' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <div className="flex items-center gap-3"><PackageOpen size={18} /> Logistique</div>
          {materialRequests.filter(m => m.status === 'PENDING').length > 0 && (
            <span className="bg-[var(--color-accent)] text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
              {materialRequests.filter(m => m.status === 'PENDING').length}
            </span>
          )}
        </Link>

        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-6 px-3">Organisation & RH</div>
        <Link href="/utilisateurs" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/utilisateurs' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <UserPlus size={18} /> Utilisateurs
        </Link>
        <Link href="/vehicules" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/vehicules' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <Truck size={18} /> Véhicules
        </Link>
        <Link href="/annuaire" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-transform hover:scale-105 ${pathname === '/annuaire' ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-green-900/40' : 'hover:bg-gray-800 hover:text-white'}`}>
          <BookOpen size={18} /> Annuaire
        </Link>

      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link href="/login" className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-gray-800 text-white font-bold hover:bg-red-500 transition border border-gray-700 shadow-md">
          <LogOut size={18} /> Déconnexion
        </Link>
      </div>
    </aside>
  );
}
