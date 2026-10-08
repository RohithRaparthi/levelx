import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Layers } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import {
  CinematicPhotoReel,
  ALL_PHASE1_PHOTOS,
  ALL_PHASE2_PHOTOS,
  ALL_EVENT_PHOTOS,
  type EventPhoto,
} from '../components/common/CinematicPhotoReel';

export const HighlightsPage: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<'all' | 1 | 2>(2); // Default to Phase 2 to spotlight latest highlights, or can switch
  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);

  const filteredPhotos =
    selectedPhase === 'all'
      ? ALL_EVENT_PHOTOS
      : selectedPhase === 1
      ? ALL_PHASE1_PHOTOS
      : ALL_PHASE2_PHOTOS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3 pb-8 border-b border-[#E8E1D5]">
        <Badge variant="brand" size="md">
          HACKATHON ARCHIVE & MEMORY REEL
        </Badge>
        <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#14161B] tracking-tight">
          Event Memories & Highlights
        </h1>
        <p className="text-base text-[#5D616F] leading-relaxed">
          A visual chronicle of the LEVELX journey—from foundational RAG architectures in Phase 1 to real-world business platforms, agentic workflows, and live panel evaluations in Phase 2.
        </p>
      </div>

      {/* Phase Filter Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_2px_8px_rgba(20,22,27,0.04)]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#DF421A] ml-2" />
          <span className="text-xs font-mono font-bold text-[#14161B] uppercase tracking-wider">
            Filter Chapter:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedPhase(2)}
            className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedPhase === 2
                ? 'bg-[#DF421A] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
            }`}
          >
            <span>Phase 2 — Real Business & Chatbots</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedPhase === 2 ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
              {ALL_PHASE2_PHOTOS.length} Photos
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPhase(1)}
            className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedPhase === 1
                ? 'bg-[#14161B] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
            }`}
          >
            <span>Phase 1 — RAG Chapter</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedPhase === 1 ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
              {ALL_PHASE1_PHOTOS.length} Photos
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPhase('all')}
            className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              selectedPhase === 'all'
                ? 'bg-[#14161B] text-white shadow-sm'
                : 'bg-[#FAF7F2] text-[#5D616F] hover:text-[#14161B] border border-[#E8E1D5]'
            }`}
          >
            <span>All Chapters</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedPhase === 'all' ? 'bg-white/20 text-white' : 'bg-[#E8E1D5] text-[#5D616F]'}`}>
              {ALL_EVENT_PHOTOS.length} Photos
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Cinematic Slideshow Reel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-widest text-[#DF421A] font-bold">
            {selectedPhase === 2
              ? 'PHASE 2 HIGHLIGHTS REEL'
              : selectedPhase === 1
              ? 'PHASE 1 HIGHLIGHTS REEL'
              : 'ALL HIGHLIGHTS REEL'}
          </div>
          <span className="text-xs font-mono text-[#7E8290]">
            {filteredPhotos.length} photographs in reel
          </span>
        </div>
        <CinematicPhotoReel photos={filteredPhotos} />
      </div>

      {/* Editorial Photo Gallery Wall */}
      <div className="space-y-6 pt-6 border-t border-[#E8E1D5]">
        <div className="text-xs font-mono uppercase tracking-widest text-[#7E8290] font-bold">
          {selectedPhase === 2
            ? `PHASE 2 PHOTOGRAPHS (${filteredPhotos.length} IMAGES)`
            : selectedPhase === 1
            ? `PHASE 1 PHOTOGRAPHS (${filteredPhotos.length} IMAGES)`
            : `COMPLETE PHOTO ARCHIVE (${filteredPhotos.length} IMAGES)`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((memory) => {
            const isPhase2 = memory.id.startsWith('p2');
            return (
              <div
                key={memory.id}
                onClick={() => setSelectedPhoto(memory)}
                className="bg-white rounded-3xl border border-[#E8E1D5] shadow-[0_2px_8px_rgba(20,22,27,0.04)] hover:shadow-[0_12px_28px_-4px_rgba(20,22,27,0.08)] hover:border-[#D6CDBF] overflow-hidden cursor-pointer group flex flex-col justify-between transition-all"
              >
                <div className="aspect-[16/10] bg-[#14161B] relative overflow-hidden">
                  <img
                    src={memory.imageSrc}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold border backdrop-blur-sm ${
                      isPhase2
                        ? 'bg-[#DF421A]/85 text-white border-white/20'
                        : 'bg-[#14161B]/80 text-white border-white/20'
                    }`}>
                      {isPhase2 ? 'Phase 2' : 'Phase 1'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#14161B]/80 backdrop-blur-sm text-white font-mono text-[10px] font-medium border border-white/20">
                      {memory.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-5 space-y-1.5">
                  <h3 className="font-display font-bold text-lg text-[#14161B] group-hover:text-[#DF421A] transition-colors line-clamp-1">
                    {memory.title}
                  </h3>
                  <p className="text-xs text-[#5D616F] leading-relaxed line-clamp-2">
                    {memory.caption}
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-[#7E8290]">
                    {memory.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-[#14161B]/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl z-10 my-8 bg-white rounded-3xl overflow-hidden border border-[#D6CDBF] shadow-[0_24px_60px_-10px_rgba(20,22,27,0.3)]"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/10] bg-[#14161B] w-full overflow-hidden">
                <img
                  src={selectedPhoto.imageSrc}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-2 bg-white">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedPhoto.id.startsWith('p2') ? 'brand' : 'neutral'} size="sm">
                    {selectedPhoto.id.startsWith('p2') ? 'Phase 2' : 'Phase 1'} • {selectedPhoto.category}
                  </Badge>
                  <span className="text-xs font-mono text-[#7E8290]">
                    {selectedPhoto.location}
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl text-[#14161B]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-[#5D616F] leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
