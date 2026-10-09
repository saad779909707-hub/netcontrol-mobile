import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const TrafficScreen: React.FC = () => {
  const { trafficHistory, devices, t } = useApp();
  const [timeframe, setTimeframe] = useState<'60s' | '1m' | '5m' | '15m' | '1h'>('60s');

  const timeframeOptions = [
    { id: '60s', labelKey: 'time60s' },
    { id: '1m', labelKey: 'time1m' },
    { id: '5m', labelKey: 'time5m' },
    { id: '15m', labelKey: 'time15m' },
    { id: '1h', labelKey: 'time1h' },
  ];

  // Slice history based on timeframe
  const getSliceCount = () => {
    switch (timeframe) {
      case '60s':
        return 60;
      case '1m':
        return 30;
      case '5m':
        return 20;
      case '15m':
        return 15;
      case '1h':
        return 10;
      default:
        return 60;
    }
  };

  const chartData = trafficHistory.slice(-getSliceCount());

  const activeDevices = devices.filter((d) => !d.blocked);
  const totalDownload = activeDevices.reduce((sum, d) => sum + d.downloadMbps, 0);
  const totalUpload = activeDevices.reduce((sum, d) => sum + d.uploadMbps, 0);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00C2FF]" />
            {t('liveTraffic')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('trafficChartTitle')}
          </p>
        </div>
      </div>

      {/* Timeframe Selector Bar */}
      <div className="flex items-center justify-between bg-[#171A21] p-2.5 rounded-2xl border border-[#262A36]">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Clock className="w-4 h-4 text-[#00C2FF]" />
          <span>{t('timeframe')}</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {timeframeOptions.map((tf) => {
            const isActive = timeframe === tf.id;
            return (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-[#00C2FF] text-slate-950 border-[#00C2FF] shadow-md shadow-[#00C2FF]/20'
                    : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
                }`}
              >
                {t(tf.labelKey as any)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Recharts Area Chart */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="flex items-center gap-1.5 text-[#00C2FF]">
              <span className="w-3 h-3 rounded-full bg-[#00C2FF]" />
              Download ({totalDownload.toFixed(1)} Mbps)
            </span>
            <span className="flex items-center gap-1.5 text-[#20D080]">
              <span className="w-3 h-3 rounded-full bg-[#20D080]" />
              Upload ({totalUpload.toFixed(1)} Mbps)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20D080" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#20D080" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262A36" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} unit="M" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1117',
                  borderColor: '#262A36',
                  borderRadius: '12px',
                  color: '#F1F5F9',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Area
                type="monotone"
                dataKey="totalDownload"
                name="Download Speed"
                stroke="#00C2FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dlGrad)"
              />
              <Area
                type="monotone"
                dataKey="totalUpload"
                name="Upload Speed"
                stroke="#20D080"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#ulGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Consumers Progress Bar Breakdown */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00C2FF]" />
          {t('topConsumers')}
        </h3>

        <div className="space-y-4">
          {activeDevices
            .sort((a, b) => b.downloadMbps - a.downloadMbps)
            .map((dev) => {
              const percentage = Math.min(100, (dev.downloadMbps / (totalDownload || 1)) * 100);
              return (
                <div key={dev.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-200 font-bold truncate max-w-[200px]">
                      {dev.alias || dev.hostname}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#00C2FF] font-bold">
                        ↓ {dev.downloadMbps.toFixed(1)} Mbps
                      </span>
                      <span className="text-[#20D080] font-bold">
                        ↑ {dev.uploadMbps.toFixed(1)} Mbps
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#0F1117] overflow-hidden border border-[#262A36]">
                    <div
                      className="h-full bg-gradient-to-r from-[#00C2FF] to-[#20D080] rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
