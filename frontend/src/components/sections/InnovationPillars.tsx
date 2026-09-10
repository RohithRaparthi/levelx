import React from 'react';
import { Rocket, ShieldCheck, Users2, LineChart } from 'lucide-react';
import { Surface } from '../common/Surface';
import { Badge } from '../common/Badge';

export const InnovationPillars: React.FC = () => {
  const pillars = [
    {
      title: 'Structured Sprints & Validation',
      description: '48-hour build sprints with clear milestone checkpoints, live technical office hours, and structured test criteria.',
      icon: <Rocket className="w-5 h-5 text-brand-400" />,
      badge: 'Execution',
    },
    {
      title: 'Non-Dilutive Grant Capital',
      description: 'Immediate non-dilutive micro-grants for outstanding student MVPs to cover cloud credits, hardware, and APIs.',
      icon: <LineChart className="w-5 h-5 text-emerald-400" />,
      badge: 'Funding',
    },
    {
      title: '1:1 Engineering Mentorship',
      description: 'Direct pairing with senior staff engineers and startup CTOs who review architectures and provide guidance.',
      icon: <Users2 className="w-5 h-5 text-teal-400" />,
      badge: 'Advisory',
    },
    {
      title: 'National Collegiate Stage',
      description: 'Present before top seed funds, angels, and technology partners at the annual XFACTOR Innovation Summit.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />,
      badge: 'Showcase',
    },
  ];

  return (
    <section id="pillars" className="py-20 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="brand" size="md">
            THE LEVELX ADVANTAGE
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Built Specifically For Student Builders
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            We removed the bureaucracy of traditional university incubators and generic competitions to deliver pure, rapid execution support.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <Surface key={idx} variant="elevated" className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-canvas-surface border border-canvas-border">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded bg-canvas-surface border border-canvas-border">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-canvas-border text-[11px] font-mono text-text-muted">
                Pillar 0{idx + 1}
              </div>
            </Surface>
          ))}
        </div>

      </div>
    </section>
  );
};
