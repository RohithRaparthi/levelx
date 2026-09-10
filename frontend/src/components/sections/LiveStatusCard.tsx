import React from 'react';
import { Terminal, RefreshCw, Clock, Server, Shield, Database } from 'lucide-react';
import { Surface } from '../common/Surface';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import type { BackendHealthResponse } from '../../types';

interface LiveStatusCardProps {
  healthData: BackendHealthResponse | null;
  isLoading: boolean;
  isError: boolean;
  latencyMs: number | null;
  lastChecked: Date | null;
  onRefresh: () => void;
}

export const LiveStatusCard: React.FC<LiveStatusCardProps> = ({
  healthData,
  isLoading,
  isError,
  latencyMs,
  lastChecked,
  onRefresh,
}) => {
  return (
    <section id="live-status" className="py-20 border-t border-canvas-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-semibold">
                SYSTEM TELEMETRY
              </span>
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Phase 1 Backend Health & Connectivity
            </h2>
          </div>

          <Button
            size="sm"
            variant="secondary"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Polling API...' : 'Ping /api/v1/health'}
          </Button>
        </div>

        {/* Morphism Diagnostic Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Diagnostic Summary */}
          <div className="lg:col-span-5 space-y-4">
            <Surface variant="elevated" className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-canvas-border mb-4">
                <span className="text-xs font-mono text-text-muted uppercase">FastAPI Health State</span>
                {isError ? (
                  <Badge variant="neutral" className="border-red-500/30 text-red-400">
                    Connection Refused
                  </Badge>
                ) : (
                  <Badge variant="emerald" pulse>
                    API Online
                  </Badge>
                )}
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-canvas-border/50">
                  <span className="text-text-muted flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-text-secondary" /> Service
                  </span>
                  <span className="font-semibold text-text-primary">
                    {healthData?.platform || 'LEVELX × XFACTOR'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-canvas-border/50">
                  <span className="text-text-muted flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-text-secondary" /> Latency
                  </span>
                  <span className="font-semibold text-brand-400">
                    {latencyMs !== null ? `${latencyMs} ms` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-canvas-border/50">
                  <span className="text-text-muted flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-text-secondary" /> Database Setup
                  </span>
                  <span className="font-semibold text-text-secondary">
                    SQLAlchemy 2.0 (Configured)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-text-muted flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-text-secondary" /> Environment
                  </span>
                  <span className="font-semibold text-text-secondary">
                    {healthData?.environment || 'development'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-canvas-border text-[11px] font-mono text-text-muted">
                Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Pending...'}
              </div>
            </Surface>
          </div>

          {/* Raw JSON Stream Viewer */}
          <div className="lg:col-span-7">
            <Surface variant="base" className="p-0 flex flex-col h-full bg-[#07090D] border-canvas-border font-mono">
              <div className="flex items-center justify-between px-4 py-3 border-b border-canvas-border bg-canvas-subtle/50 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                  <span>GET /api/v1/health</span>
                </div>
                <span className="text-[11px] text-text-muted">200 OK • application/json</span>
              </div>

              <div className="p-4 text-xs overflow-x-auto text-text-secondary flex-1 font-mono-tabular leading-relaxed">
                {isError ? (
                  <div className="text-red-400 space-y-2">
                    <p className="font-semibold">⚠️ Cannot connect to backend server at http://localhost:8000/api/v1/health</p>
                    <p className="text-text-muted text-[11px]">Make sure the FastAPI server is running (`uvicorn app.main:app --port 8000`).</p>
                  </div>
                ) : (
                  <pre className="text-text-primary">
                    {JSON.stringify(healthData || { status: 'loading...', endpoint: '/api/v1/health' }, null, 2)}
                  </pre>
                )}
              </div>
            </Surface>
          </div>

        </div>

      </div>
    </section>
  );
};
