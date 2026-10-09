'use client';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { Briefcase, CheckCircle2, CloudLightning, FileText, HardHat, PackageOpen, Users, LogOut, Search, Bell, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const chantiers = useAppStore(state => state.chantiers);
  const materialRequests = useAppStore(state => state.materialRequests);
  const leads = useAppStore(state => state.leads);
  const alerts = useAppStore(state => state.alerts);
  const isTrackingTime = useAppStore(state => state.isTrackingTime);
  const markAlertAsRead = useAppStore(state => state.markAlertAsRead);

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative w-full">
      {/* Topbar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-0">
        <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl w-96 border border-gray-200 focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Rechercher un client, un chantier..." className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400" />
        </div>
        <div className="flex items-center gap-6">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative text-gray-500 hover:text-[var(--color-brand)] transition">
            <Bell size={20} />
            {alerts.filter(a => a.status === 'NON_LU').length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </motion.button>
          <div className="flex items-center gap-3 border-l pl-6 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-brand)] to-[var(--color-accent)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900">Admin</span>
              <span className="text-xs text-gray-500">Gérant</span>
            </div>
          </div>
        </div>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-auto p-8 space-y-8"
      >
        <motion.div variants={item} className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bonjour Admin 👋</h1>
            <p className="text-gray-500 mt-1">Voici le résumé de l'activité d'aujourd'hui.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI Cards */}
          <motion.div variants={item} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-medium text-sm">Chantiers en cours</span>
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg"><HardHat size={20} /></div>
            </div>
            <span className="text-3xl font-black text-gray-900">{chantiers.filter(c => c.status === 'EN_COURS').length}</span>
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-medium text-sm">Leads à recontacter</span>
              <div className="bg-amber-50 text-amber-600 p-2 rounded-lg"><Users size={20} /></div>
            </div>
            <span className="text-3xl font-black text-gray-900">{leads.filter(l => l.status === 'NOUVEAU').length}</span>
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 relative overflow-hidden transition-all">
            <div className="flex justify-between items-start z-10">
              <span className="text-gray-500 font-medium text-sm">Urgences Terrain</span>
              <div className="bg-red-50 text-red-600 p-2 rounded-lg"><Bell size={20} /></div>
            </div>
            <span className="text-3xl font-black text-red-600 z-10">{alerts.filter(a => a.status === 'NON_LU').length}</span>
            {alerts.filter(a => a.status === 'NON_LU').length > 0 && (
              <div className="absolute -bottom-4 -right-4 text-red-50 opacity-50"><Bell size={100} /></div>
            )}
          </motion.div>

          <motion.div variants={item} whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} className="bg-gradient-to-br from-[var(--color-brand-dark)] to-[var(--color-brand)] p-6 rounded-2xl shadow-lg flex flex-col justify-between h-36 text-white transition-all">
            <div className="flex justify-between items-start">
              <span className="text-gray-100 font-medium text-sm">Météo du jour</span>
              <CloudLightning size={20} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <span className="text-3xl font-black text-[var(--color-accent)]">Ensoleillé</span>
              <p className="text-xs text-green-100 font-medium mt-1">✓ Conditions idéales</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Colonne 1: Suivi Administratif & Temps */}
          <div className="space-y-8">
            {/* Table des Leads */}
            <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Pipeline Commercial (Leads)</h3>
                <Link href="#" className="text-sm font-bold text-[var(--color-brand)] hover:underline">Voir tout</Link>
              </div>
              <div className="divide-y divide-gray-100">
                {leads.map((lead, i) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={lead.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer">
                    <div>
                      <p className="font-bold text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Reçu hier à 14:30</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${lead.status === 'NOUVEAU' ? 'bg-[var(--color-accent)]/20 text-amber-900 shadow-sm' : 'bg-emerald-100 text-emerald-800'}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pointage Heures */}
            <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Suivi Rentabilité & Heures</h3>
              </div>
              <div className="p-6">
                {isTrackingTime ? (
                  <div className="flex items-center gap-4 bg-green-50 border border-green-100 p-4 rounded-xl">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <div>
                      <p className="font-bold text-green-900">Thomas (Équipe 1) est sur le chantier</p>
                      <p className="text-xs text-green-700 mt-1">Pointage actif</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-4">Aucune équipe ne pointe en ce moment.</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Colonne 2 : Temps Réel Terrain (Alertes et Matériel) */}
          <div className="space-y-8">
            {/* Alertes du terrain */}
            <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Remontées Terrain en Direct
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {alerts.filter(a => a.status === 'NON_LU').length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm font-medium flex flex-col items-center gap-3">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                    Tout va bien sur les chantiers.
                  </div>
                ) : (
                  alerts.filter(a => a.status === 'NON_LU').map((alert, i) => (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={alert.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition border-l-4 border-l-red-500 bg-red-50/30">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block ${
                          alert.type === 'BLOCAGE' ? 'bg-red-100 text-red-700' : 
                          alert.type === 'TRAVAIL_SUPP' ? 'bg-purple-100 text-purple-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {alert.type}
                        </span>
                        <p className="font-bold text-gray-900 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">Équipe 1 • À l'instant</p>
                      </div>
                      <button onClick={() => markAlertAsRead(alert.id)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition shadow-sm">
                        Traiter
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Table des Demandes Matériel */}
            <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Demandes Matériel (Logistique)</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {materialRequests.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm font-medium flex flex-col items-center gap-3">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                    Aucune demande en attente.
                  </div>
                ) : (
                  materialRequests.map((req, i) => (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={req.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                          <PackageOpen size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{req.item}</p>
                          <p className="text-xs text-gray-500 mt-1">Demandé par <strong>Équipe 1</strong> sur Chantier ID {req.chantierId.slice(0,4)}</p>
                        </div>
                      </div>
                      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[var(--color-brand)] transition shadow-md">
                        Valider
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </motion.div>
    </main>
  );
}
