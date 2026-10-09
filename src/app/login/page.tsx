'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, ShieldCheck, AlertCircle } from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const users = useAppStore(state => state.users);
  const login = useAppStore(state => state.login);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lowerId = loginId.toLowerCase().trim();
    const pwd = password.trim();

    // Check in database (with fallback for legacy localstorage data)
    const user = users.find(u => {
      const uName = (u.username || (u.role === 'ADMIN' ? 'admin' : 'user')).toLowerCase();
      const uPass = u.password || '123';
      
      return (uName === lowerId || u.email.toLowerCase() === lowerId) && 
             uPass === pwd &&
             u.isActive;
    });

    if (user) {
      login(user);
      if (user.role === 'ADMIN') {
        router.push('/');
      } else {
        router.push('/mobile');
      }
    } else {
      setError("Identifiants invalides ou compte désactivé.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-center font-bold px-6 py-3 rounded-xl shadow-xl flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex justify-center mb-8 gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
            <HardHat size={32} className="text-gray-400" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Chloroplan</h1>
          <p className="text-gray-500 text-sm font-medium">Connectez-vous à votre espace</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Identifiant</label>
            <input 
              type="text" 
              value={loginId} 
              onChange={e => setLoginId(e.target.value)} 
              required 
              placeholder="admin ou user" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus-within:border-[var(--color-brand)] focus-within:ring-2 focus-within:ring-green-100 transition-all outline-none" 
            />
          </div>
          
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-xs font-medium border border-blue-100 mt-4">
            <p className="mb-1"><strong>Comptes de démo :</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Bureau : <code className="bg-white px-1 py-0.5 rounded shadow-sm">admin</code> / <code className="bg-white px-1 py-0.5 rounded shadow-sm">123</code></li>
              <li>Terrain : <code className="bg-white px-1 py-0.5 rounded shadow-sm">user</code> / <code className="bg-white px-1 py-0.5 rounded shadow-sm">123</code></li>
            </ul>
          </div>

          <button type="submit" className="w-full bg-[var(--color-brand)] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-900/20 hover:bg-[var(--color-brand-dark)] transition active:scale-95 mt-2">
            Se connecter
          </button>
        </form>
      </motion.div>
    </div>
  );
}
