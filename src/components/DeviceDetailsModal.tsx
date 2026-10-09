import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Smartphone,
  Laptop,
  Tv,
  Monitor,
  Tablet,
  Gamepad2,
  Cpu,
  HelpCircle,
  ArrowDown,
  ArrowUp,
  Activity,
  Edit2,
  Check,
  Ban,
  Gauge,
  Clock,
  HardDrive,
} from 'lucide-react';

export const DeviceDetailsModal: React.FC = () => {
  const {
    selectedDevice,
    setSelectedDevice,
    blockDevice,
    unblockDevice,
    removeLimit,
    setLimitModalDevice,
    updateDeviceAlias,
    t,
  } = useApp();

  const [aliasInput, setAliasInput] = useState(selectedDevice?.alias || '');
  const [isEditingAlias, setIsEditingAlias] = useState(false);

  if (!selectedDevice) return null;

  const handleSaveAlias = () => {
    updateDeviceAlias(selectedDevice.id, aliasInput.trim());
    setIsEditingAlias(false);
  };

  const getDeviceIcon = () => {
    switch (selectedDevice.type) {
      case 'phone':
        return <Smartphone className="w-6 h-6 text-[#00C2FF]" />;
      case 'laptop':
        return <Laptop className="w-6 h-6 text-[#00C2FF]" />;
      case 'tv':
        return <Tv className="w-6 h-6 text-purple-400" />;
      case 'desktop':
        return <Monitor className="w-6 h-6 text-indigo-400" />;
      case 'tablet':
        return <Tablet className="w-6 h-6 text-cyan-300" />;
      case 'console':
        return <Gamepad2 className="w-6 h-6 text-amber-400" />;
      case 'iot':
        return <Cpu className="w-6 h-6 text-emerald-400" />;
      default:
        return <HelpCircle className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#171A21] border border-[#262A36] w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#262A36] mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0F1117] border border-[#262A36] flex items-center justify-center">
              {getDeviceIcon()}
            </div>
            <div>
              {isEditingAlias ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aliasInput}
                    onChange={(e) => setAliasInput(e.target.value)}
                    className="bg-[#0F1117] border border-[#00C2FF] text-slate-100 text-sm font-bold rounded-xl px-3 py-1.5 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveAlias}
                    className="p-1.5 bg-[#20D080]/20 text-[#20D080] rounded-xl hover:bg-[#20D080]/30"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-100">
                    {selectedDevice.alias || selectedDevice.hostname}
                  </h2>
                  <button
                    onClick={() => {
                      setAliasInput(selectedDevice.alias || selectedDevice.hostname);
                      setIsEditingAlias(true);
                    }}
                    className="p-1 text-slate-400 hover:text-[#00C2FF] transition-colors"
                    title={t('editAlias')}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {selectedDevice.vendor} • {selectedDevice.hostname}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDevice(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basic Hardware Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
              {t('ipAddress')}
            </span>
            <span className="text-sm font-mono font-bold text-slate-100">
              {selectedDevice.ip}
            </span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
              {t('macAddress')}
            </span>
            <span className="text-xs font-mono text-slate-200 font-semibold truncate block">
              {selectedDevice.mac}
            </span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
              Status
            </span>
            <span
              className={`text-xs font-bold ${
                selectedDevice.blocked
                  ? 'text-[#FF4D5E]'
                  : selectedDevice.limited
                  ? 'text-amber-400'
                  : 'text-[#20D080]'
              }`}
            >
              {selectedDevice.blocked
                ? t('statusBlocked')
                : selectedDevice.limited
                ? t('statusLimited')
                : t('statusOnline')}
            </span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
              {t('vendor')}
            </span>
            <span className="text-xs font-semibold text-slate-300 truncate block">
              {selectedDevice.vendor}
            </span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
              {t('firstSeen')}
            </span>
            <span className="text-[11px] font-mono text-slate-300">
              {selectedDevice.firstSeen.split(' ')[0]}
            </span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
              {t('lastSeen')}
            </span>
            <span className="text-[11px] font-mono text-slate-300">
              {selectedDevice.lastSeen.split(' ')[1]}
            </span>
          </div>
        </div>

        {/* Live & Historical Bandwidth Metrics */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#00C2FF]" />
          Traffic Statistics
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Download Column */}
          <div className="bg-[#0F1117] p-4 rounded-2xl border border-[#00C2FF]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#00C2FF] font-bold text-xs uppercase">
              <ArrowDown className="w-4 h-4" />
              Download
            </div>

            <div className="flex justify-between items-baseline border-b border-[#262A36] pb-2">
              <span className="text-xs text-slate-400">{t('currentSpeed')}:</span>
              <span className="text-base font-extrabold font-mono text-[#00C2FF]">
                {selectedDevice.downloadMbps.toFixed(1)} Mbps
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#262A36] pb-2">
              <span className="text-xs text-slate-400">{t('averageSpeed')}:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {selectedDevice.avgDownloadMbps.toFixed(1)} Mbps
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#262A36] pb-2">
              <span className="text-xs text-slate-400">{t('totalData')}:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {(selectedDevice.totalDownloadMB / 1024).toFixed(2)} GB
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">{t('peakSpeed')}:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {selectedDevice.peakDownloadMbps.toFixed(1)} Mbps
              </span>
            </div>
          </div>

          {/* Upload Column */}
          <div className="bg-[#0F1117] p-4 rounded-2xl border border-[#20D080]/30 space-y-3">
            <div className="flex items-center gap-2 text-[#20D080] font-bold text-xs uppercase">
              <ArrowUp className="w-4 h-4" />
              Upload
            </div>

            <div className="flex justify-between items-baseline border-b border-[#262A36] pb-2">
              <span className="text-xs text-slate-400">{t('currentSpeed')}:</span>
              <span className="text-base font-extrabold font-mono text-[#20D080]">
                {selectedDevice.uploadMbps.toFixed(1)} Mbps
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#262A36] pb-2">
              <span className="text-xs text-slate-400">{t('averageSpeed')}:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {selectedDevice.avgUploadMbps.toFixed(1)} Mbps
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-[#262A36] pb-2">
              <span className="text-xs text-slate-400">{t('totalData')}:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {(selectedDevice.totalUploadMB / 1024).toFixed(2)} GB
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">{t('peakSpeed')}:</span>
              <span className="text-xs font-mono font-semibold text-slate-200">
                {selectedDevice.peakUploadMbps.toFixed(1)} Mbps
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          {selectedDevice.blocked ? (
            <button
              onClick={() => {
                unblockDevice(selectedDevice.id);
                setSelectedDevice(null);
              }}
              className="flex-1 py-3 rounded-2xl bg-[#20D080]/20 text-[#20D080] border border-[#20D080]/40 font-bold text-xs hover:bg-[#20D080]/30 transition-colors"
            >
              {t('unblock')}
            </button>
          ) : (
            <button
              onClick={() => {
                blockDevice(selectedDevice.id);
                setSelectedDevice(null);
              }}
              className="flex-1 py-3 rounded-2xl bg-[#FF4D5E]/20 text-[#FF4D5E] border border-[#FF4D5E]/40 font-bold text-xs hover:bg-[#FF4D5E]/30 transition-colors flex items-center justify-center gap-2"
            >
              <Ban className="w-4 h-4" />
              {t('block')}
            </button>
          )}

          <button
            onClick={() => {
              const dev = selectedDevice;
              setSelectedDevice(null);
              setLimitModalDevice(dev);
            }}
            className="flex-1 py-3 rounded-2xl bg-[#00C2FF]/20 text-[#00C2FF] border border-[#00C2FF]/40 font-bold text-xs hover:bg-[#00C2FF]/30 transition-colors flex items-center justify-center gap-2"
          >
            <Gauge className="w-4 h-4" />
            {t('limit')}
          </button>
        </div>
      </div>
    </div>
  );
};
