import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface IntroExperienceProps {
  onEnter: () => void;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 600);
    const t3 = setTimeout(() => setStage(3), 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#14161B] overflow-hidden select-none"
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-editorial-grid opacity-60" />
        <div className="absolute inset-x-0 top-1/4 h-px bg-[#E8E1D5]" />
        <div className="absolute inset-x-0 bottom-1/4 h-px bg-[#E8E1D5]" />
        <div className="absolute inset-y-0 left-1/4 w-px bg-[#E8E1D5]" />
        <div className="absolute inset-y-0 right-1/4 w-px bg-[#E8E1D5]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Stage 1: Presenter Tag */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : -8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D6CDBF] text-xs font-mono text-[#5D616F] mb-6 shadow-[0_1px_3px_rgba(20,22,27,0.04)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#DF421A]" />
          <span className="tracking-widest uppercase font-bold text-[11px] text-[#DF421A]">XFACTOR INITIATIVE</span>
          <span className="text-[#C8C0B2]">•</span>
          <span className="text-[#7E8290]">COHORT 2026</span>
        </motion.div>

        {/* Stage 2: Hero Brand Title Lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0.96 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-[#14161B] leading-none">
              LEVEL<span className="text-[#DF421A]">X</span>
            </h1>
            <div className="h-12 w-px bg-[#D6CDBF] mx-2 hidden sm:block" />
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#5D616F]">
                XFACTOR
              </span>
              <span className="text-[11px] font-mono text-[#DF421A] font-semibold uppercase tracking-wider">
                Innovation Arena
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg text-[#5D616F] font-normal max-w-lg mx-auto leading-relaxed pt-2">
            The 3-phase collegiate hackathon series empowering student engineers to build production architectures under veteran industry critique.
          </p>
        </motion.div>

        {/* Stage 3: Interactive Enter Action */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: stage >= 3 ? 1 : 0, y: stage >= 3 ? 0 : 16 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mt-8 flex flex-col items-center gap-5 w-full max-w-md"
        >
          <button
            onClick={onEnter}
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-[#DF421A] rounded-2xl hover:bg-[#C83812] shadow-[0_4px_20px_rgba(223,66,26,0.3)] active:scale-[0.99] cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span>Enter LEVELX Platform</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </span>
          </button>

          {/* Metric Bar */}
          <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-[#E8E1D5] text-center font-mono">
            <div className="p-2 rounded-xl bg-white border border-[#E8E1D5] shadow-[0_1px_2px_rgba(20,22,27,0.02)]">
              <div className="text-[10px] text-[#7E8290]">SERIES</div>
              <div className="text-xs font-bold text-[#14161B]">3 PHASES</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-[#E8E1D5] shadow-[0_1px_2px_rgba(20,22,27,0.02)]">
              <div className="text-[10px] text-[#7E8290]">MAX CREDITS</div>
              <div className="text-xs font-bold text-[#DF421A]">300 PTS</div>
            </div>
            <div className="p-2 rounded-xl bg-white border border-[#E8E1D5] shadow-[0_1px_2px_rgba(20,22,27,0.02)]">
              <div className="text-[10px] text-[#7E8290]">CAMPUS</div>
              <div className="text-xs font-bold text-[#156B3F]">KIET ARENA</div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Keyboard Shortcut Note */}
      <div className="absolute bottom-6 inset-x-0 text-center text-xs font-mono text-[#7E8290]">
        Press <kbd className="px-1.5 py-0.5 rounded bg-white text-[#14161B] border border-[#D6CDBF] shadow-[0_1px_1px_rgba(0,0,0,0.04)]">Enter</kbd> or click above to explore
      </div>
    </motion.div>
  );
};
