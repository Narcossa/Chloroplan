import { motion } from 'framer-motion';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div 
        initial={{ rotate: -90, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-green-900/20 bg-white"
      >
        <img src="/logo-amiot.png" alt="AMIOT espaces verts" className="w-full h-full object-cover" />
      </motion.div>
      <div className="flex flex-col leading-none">
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-black tracking-tight"
        >
          CHLOROPLAN
        </motion.span>
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] font-bold text-[var(--color-accent)] tracking-widest uppercase"
        >
          Espaces Verts
        </motion.span>
      </div>
    </div>
  );
}
