import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from 'lucide-react';
import { Badge } from './Badge';

export interface EventPhoto {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  caption: string;
  location: string;
}

export const ALL_PHASE1_PHOTOS: EventPhoto[] = [
  {
    id: 'p1',
    title: 'Phase 1 Grand Assembly & Keynote',
    category: 'Keynote & Launch',
    imageSrc: '/assets/events/phase1_hall_assembly.jpg',
    caption: 'Over 200 student engineers and creators assembled in the central hall for the kickoff masterclass on Retrieval-Augmented Generation (RAG).',
    location: 'KIET Central Campus Hall',
  },
  {
    id: 'p2',
    title: 'Live Countdown & Lab Build Sprint',
    category: 'Build Sprint',
    imageSrc: '/assets/events/phase1_lab_countdown.jpg',
    caption: 'Builders working in the computer labs against the live synchronized countdown clock to complete RAG pipelines.',
    location: 'KIET Engineering Labs',
  },
  {
    id: 'p3',
    title: 'Active Hackathon Classroom Sprint',
    category: 'Arena Sprint',
    imageSrc: '/assets/events/phase1_classroom_sprint.jpg',
    caption: 'Student teams deeply focused on laptop workstations, engineering vector retrieval databases and AI agents.',
    location: 'Campus Build Classrooms',
  },
  {
    id: 'p4',
    title: 'Hackathon Arena & Team Workstations',
    category: 'Collaboration',
    imageSrc: '/assets/events/phase1_arena_workspace.jpg',
    caption: 'Teams collaborating on embedding chunking, prompt grounding, and vector search architectures across the arena hall.',
    location: 'Innovation Arena Hall',
  },
  {
    id: 'p5',
    title: 'Industry Architecture Review with Nallanesh',
    category: 'Industry Critique',
    imageSrc: '/assets/events/phase1_evaluator_review.jpg',
    caption: 'Lead Evaluator Nallanesh reviewing technical sheets, pipeline diagrams, and code implementation directly at builder desks.',
    location: 'Evaluation Floor',
  },
  {
    id: 'p6',
    title: 'Faculty & Organizer Memento Presentation',
    category: 'Appreciation',
    imageSrc: '/assets/events/phase1_organizer_memento.jpg',
    caption: 'Token of appreciation presented to Lead Evaluator Nallanesh by the organizing faculty and leadership.',
    location: 'Main Stage Assembly',
  },
  {
    id: 'p7',
    title: 'Awards Presentation & Certificate Honors',
    category: 'Recognition & Podium',
    imageSrc: '/assets/events/phase1_awards_ceremony.jpg',
    caption: 'Celebrating top-performing student builder teams on stage with official certificates of achievement.',
    location: 'Main Auditorium Stage',
  },
  {
    id: 'p8',
    title: 'Phase 1 Podium Winners & Cohort Celebration',
    category: 'Championship',
    imageSrc: '/assets/events/phase1_podium_winners.jpg',
    caption: 'Cohort winners holding their certificates alongside Nallanesh and organizers after final evaluations.',
    location: 'Auditorium Stage',
  },
];

interface CinematicPhotoReelProps {
  compact?: boolean;
  className?: string;
  intervalMs?: number;
}

export const CinematicPhotoReel: React.FC<CinematicPhotoReelProps> = ({
  compact = false,
  className = '',
  intervalMs = 2800, // Faster slideshow timing
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<EventPhoto | null>(null);

  // Faster auto-advancing slideshow
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ALL_PHASE1_PHOTOS.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, intervalMs]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ALL_PHASE1_PHOTOS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ALL_PHASE1_PHOTOS.length) % ALL_PHASE1_PHOTOS.length);
  };

  const currentPhoto = ALL_PHASE1_PHOTOS[currentIndex];

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        
        {/* Main Reel Frame with 3D Depth */}
        <div
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          className="relative bg-[#14161B] rounded-3xl overflow-hidden border border-[#D6CDBF] shadow-[0_12px_36px_-4px_rgba(20,22,27,0.18)] max-w-4xl mx-auto"
          style={{ perspective: 1000 }}
        >
          {/* Main Image Slideshow with Slow-Moving 3D Ken-Burns Fill */}
          <div className={`${compact ? 'aspect-[16/10] sm:aspect-[16/9] max-h-[360px]' : 'aspect-[16/10] sm:aspect-[16/9] max-h-[420px]'} w-full relative overflow-hidden bg-[#14161B]`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                {/* Slow 3D Ken-Burns Pan & Zoom effect filling the frame */}
                <motion.img
                  src={currentPhoto.imageSrc}
                  alt={currentPhoto.title}
                  initial={{ scale: 1.16, x: -8, y: 4, rotate: -0.5 }}
                  animate={{ scale: 1.02, x: 0, y: 0, rotate: 0 }}
                  transition={{ duration: (intervalMs / 1000) + 0.4, ease: 'linear' }}
                  className="w-full h-full object-cover object-center transform-gpu"
                />
              </motion.div>
            </AnimatePresence>

            {/* Cinematic Gradient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#14161B]/95 via-[#14161B]/25 to-[#14161B]/15 pointer-events-none" />

            {/* Top Bar Controls */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-auto z-10">
              <div className="flex items-center gap-2">
                <Badge variant="brand" size="sm">
                  {currentPhoto.category}
                </Badge>
                <span className="px-2.5 py-0.5 rounded-md bg-[#14161B]/80 text-white font-mono text-[11px] font-bold border border-white/20 backdrop-blur-sm shadow-sm">
                  {currentIndex + 1} / {ALL_PHASE1_PHOTOS.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-[#14161B]/70 text-white hover:bg-[#14161B] border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
                  title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setLightboxPhoto(currentPhoto)}
                  className="p-2 rounded-xl bg-[#14161B]/70 text-white hover:bg-[#14161B] border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
                  title="Fullscreen Lightbox"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Floating Caption Panel */}
            <div className="absolute bottom-4 inset-x-5 text-white space-y-1 z-10 pointer-events-none">
              <h3 className="font-display font-bold text-lg sm:text-xl text-white drop-shadow-md line-clamp-1">
                {currentPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#E2E5F0] line-clamp-2 drop-shadow-md font-normal">
                {currentPhoto.caption}
              </p>
            </div>

            {/* Arrow Navigators */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#14161B] shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-transform active:scale-90 cursor-pointer pointer-events-auto"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#14161B] shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-transform active:scale-90 cursor-pointer pointer-events-auto"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Thumbnail Selector Strip */}
        <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto overflow-x-auto py-2 px-2">
          {ALL_PHASE1_PHOTOS.map((photo, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={photo.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`relative shrink-0 rounded-xl overflow-hidden transition-all cursor-pointer ${
                  isSelected
                    ? 'w-16 h-11 ring-2 ring-[#DF421A] ring-offset-2 ring-offset-[#FAF7F2] scale-105 shadow-md'
                    : 'w-12 h-9 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.imageSrc}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>

      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxPhoto(null)}
              className="fixed inset-0 bg-[#14161B]/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl z-10 my-8 bg-white rounded-3xl overflow-hidden border border-[#D6CDBF] shadow-[0_24px_60px_-10px_rgba(20,22,27,0.3)]"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[16/10] bg-[#14161B] w-full overflow-hidden">
                <img
                  src={lightboxPhoto.imageSrc}
                  alt={lightboxPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-2 bg-white">
                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="sm">
                    {lightboxPhoto.category}
                  </Badge>
                  <span className="text-xs font-mono text-[#7E8290]">
                    {lightboxPhoto.location}
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl text-[#14161B]">
                  {lightboxPhoto.title}
                </h3>
                <p className="text-sm text-[#5D616F] leading-relaxed">
                  {lightboxPhoto.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
