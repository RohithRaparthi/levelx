import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroExperience } from './components/intro/IntroExperience';
import { PageShell } from './components/layout/PageShell';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TeamDetailModal } from './components/common/TeamDetailModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { HackathonsPage } from './pages/HackathonsPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { HighlightsPage } from './pages/HighlightsPage';
import { JourneyPage } from './pages/JourneyPage';
import { AboutPage } from './pages/AboutPage';

import type { PageView } from './types';

export function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // Sync with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validViews: PageView[] = [
        'home',
        'hackathons',
        'results',
        'projects',
        'achievements',
        'highlights',
        'journey',
        'about',
      ];
      if (validViews.includes(hash as PageView)) {
        setCurrentView(hash as PageView);
        setHasEntered(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: PageView) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut listener for intro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasEntered && (e.key === 'Enter' || e.key === ' ')) {
        setHasEntered(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered]);

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'hackathons':
        return <HackathonsPage onNavigate={navigateTo} />;
      case 'results':
        return <ResultsPage onSelectTeam={setSelectedTeamId} />;
      case 'projects':
        return <ProjectsPage onSelectTeam={setSelectedTeamId} />;
      case 'achievements':
        return <AchievementsPage onSelectTeam={setSelectedTeamId} />;
      case 'highlights':
        return <HighlightsPage />;
      case 'journey':
        return <JourneyPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onSelectTeam={setSelectedTeamId}
          />
        );
    }
  };

  return (
    <>
      {/* 1. Intro Reveal Curtain */}
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <IntroExperience
            key="intro"
            onEnter={() => setHasEntered(true)}
          />
        )}
      </AnimatePresence>

      {/* 2. Main Platform App Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasEntered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <PageShell>
          <Navbar
            currentView={currentView}
            onNavigate={navigateTo}
          />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <ErrorBoundary>
                  {renderCurrentPage()}
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer onNavigate={navigateTo} />
        </PageShell>
      </motion.div>

      {/* 3. Team Detail Modal Overlay */}
      <TeamDetailModal
        teamId={selectedTeamId}
        onClose={() => setSelectedTeamId(null)}
      />
    </>
  );
}

export default App;
