'use client';
import { useAppStore } from '@/store/useAppStore';
import { Receipt, Search, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FraisPage() {
  const expenses = useAppStore(state => state.expenses);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notes de Frais</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Validation et suivi des dépenses terrain</p>
        </div>
      </header>
      
      <div className="flex-1 p-8 overflow-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Date</th>
                <th className="p-4">Collaborateur</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((expense, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }} 
                  key={expense.id} 
                  className="hover:bg-gray-50 transition group"
                >
                  <td className="p-4 text-sm font-medium text-gray-900">{new Date(expense.date).toLocaleDateString('fr-FR')}</td>
                  <td className="p-4 text-sm text-gray-600">{expense.userId}</td>
                  <td className="p-4 text-sm font-bold text-gray-900">{expense.amount.toFixed(2)} €</td>
                  <td className="p-4 text-sm text-gray-600">{expense.category}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 w-max ${
                      expense.status === 'APPROUVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {expense.status === 'APPROUVE' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      {expense.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-medium border-dashed">
                    Aucune note de frais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
