import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Ban,
  Gauge,
  Wifi,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Radar,
  ShieldCheck,
  Zap,
  ChevronRight,
  Server,
} from 'lucide-react';
import { DeviceCard } from '../components/DeviceCard';
import { ActiveTab } from '../components/BottomNav';

interface DashboardScreenProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ setActiveTab }) => {
  const {
    devices,
    routerConfig,
    scanInfo,
    triggerNetworkScan,
    testRouterConnection,
    clearAllRules,
    t,
  } = useApp();

  const activeDevicesCount = devices.filter((d) => d.status === 'Online').length;
  const blockedDevicesCount = devices.filter((d) => d.blocked).length;
  const limitedDevicesCount = devices.filter((d) => d.limited).length;

  const totalDlSpeed = devices
    .filter((d) => !d.blocked)
    .reduce((acc, d) => acc + d.downloadMbps, 0);

  const totalUlSpeed = devices
    .filter((d) => !d.blocked)
    .reduce((acc, d) => acc + d.uploadMbps, 0);

  const topConsumers = [...devices]
    .filter((d) => !d.blocked)
    .sort((a, b) => b.downloadMbps - a.downloadMbps)
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Top Main Dashboard Stats Banner */}
      <div className="bg-gradient-to-br from-[#171A21] via-[#171A21] to-[#0F1117] rounded-3xl p-5 border border-[#262A36] shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#00C2FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-[#262A36] pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#00C2FF] block mb-1">
              Active Network Summary
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#20D080]" />
              NetControl Overview
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerNetworkScan()}
              className="px-3.5 py-2 rounded-xl bg-[#00C2FF]/15 text-[#00C2FF] hover:bg-[#00C2FF]/25 border border-[#00C2FF]/30 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Radar className="w-4 h-4" />
              {t('scanNetwork')}
            </button>

            <button
              onClick={() => testRouterConnection()}
              className="p-2 rounded-xl bg-[#0F1117] text-slate-300 hover:text-[#00C2FF] border border-[#262A36] transition-colors"
              title={t('refresh')}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Core Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Router / Network */}
          <div
            onClick={() => setActiveTab('router')}
            className="bg-[#0F1117]/80 p-3.5 rounded-2xl border border-[#262A36] hover:border-[#00C2FF]/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Router IP</span>
              <Wifi className="w-4 h-4 text-[#20D080]" />
            </div>
            <div className="text-base font-extrabold font-mono text-slate-100">
              {routerConfig.ip}
            </div>
            <div className="text-[10px] text-[#20D080] font-semibold mt-1">
              {routerConfig.isConnected ? '✓ Connected' : 'Disconnected'}
            </div>
          </div>

          {/* Connected Devices */}
          <div
            onClick={() => setActiveTab('devices')}
            className="bg-[#0F1117]/80 p-3.5 rounded-2xl border border-[#262A36] hover:border-[#00C2FF]/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {t('connectedDevices')}
              </span>
              <Smartphone className="w-4 h-4 text-[#00C2FF]" />
            </div>
            <div className="text-xl font-extrabold font-mono text-[#00C2FF]">
              {devices.length}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-1">
              {activeDevicesCount} Online
            </div>
          </div>

          {/* Blocked Devices */}
          <div
            onClick={() => setActiveTab('rules')}
            className="bg-[#0F1117]/80 p-3.5 rounded-2xl border border-[#262A36] hover:border-[#FF4D5E]/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {t('blocked')}
              </span>
              <Ban className="w-4 h-4 text-[#FF4D5E]" />
            </div>
            <div className="text-xl font-extrabold font-mono text-[#FF4D5E]">
              {blockedDevicesCount}
            </div>
            <div className="text-[10px] text-[#FF4D5E] font-medium mt-1">
              nftables Active
            </div>
          </div>

          {/* Limited Devices */}
          <div
            onClick={() => setActiveTab('rules')}
            className="bg-[#0F1117]/80 p-3.5 rounded-2xl border border-[#262A36] hover:border-amber-500/40 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {t('limited')}
              </span>
              <Gauge className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-extrabold font-mono text-amber-400">
              {limitedDevicesCount}
            </div>
            <div className="text-[10px] text-amber-400 font-medium mt-1">
              tc / SQM Limited
            </div>
          </div>
        </div>
      </div>

      {/* Live Bandwidth Traffic Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Download */}
        <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#00C2FF]/10 text-[#00C2FF] flex items-center justify-center">
              <ArrowDown className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase block">
                {t('totalDownload')} Speed
              </span>
              <span className="text-2xl font-black font-mono text-[#00C2FF]">
                {totalDlSpeed.toFixed(1)} Mbps
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('traffic')}
            className="p-2.5 rounded-xl bg-[#0F1117] text-slate-400 hover:text-[#00C2FF] transition-colors"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>

        {/* Total Upload */}
        <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#20D080]/10 text-[#20D080] flex items-center justify-center">
              <ArrowUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase block">
                {t('totalUpload')} Speed
              </span>
              <span className="text-2xl font-black font-mono text-[#20D080]">
                {totalUlSpeed.toFixed(1)} Mbps
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('traffic')}
            className="p-2.5 rounded-xl bg-[#0F1117] text-slate-400 hover:text-[#20D080] transition-colors"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Top Traffic Consumers Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00C2FF]" />
            Top Bandwidth Consumers Right Now
          </h3>
          <button
            onClick={() => setActiveTab('devices')}
            className="text-xs font-bold text-[#00C2FF] hover:underline flex items-center gap-1"
          >
            View All ({devices.length})
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topConsumers.map((dev) => (
            <DeviceCard key={dev.id} device={dev} />
          ))}
        </div>
      </div>

      {/* OpenWrt Architecture Notice Box */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] flex items-start gap-3.5">
        <Server className="w-6 h-6 text-[#00C2FF] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-slate-200 mb-1">
            {t('architectureTitle')}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('architectureDesc')}
          </p>
        </div>
      </div>
    </div>
  );
};
