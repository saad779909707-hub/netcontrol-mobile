import React, { useState } from 'react';
import { Device } from '../types';
import { useApp } from '../context/AppContext';
import {
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
  Ban,
  Gauge,
  Edit2,
  Check,
  X,
} from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const {
    blockDevice,
    unblockDevice,
    removeLimit,
    setLimitModalDevice,
    setSelectedDevice,
    updateDeviceAlias,
    t,
  } = useApp();

  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState(device.alias || '');

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="w-5 h-5 text-[#00C2FF]" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-[#00C2FF]" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-purple-400" />;
      case 'desktop':
        return <Monitor className="w-5 h-5 text-indigo-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-cyan-300" />;
      case 'console':
        return <Gamepad2 className="w-5 h-5 text-amber-400" />;
      case 'iot':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = () => {
    if (device.blocked) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF4D5E]/15 text-[#FF4D5E] border border-[#FF4D5E]/30 flex items-center gap-1">
          <Ban className="w-3 h-3" />
          {t('statusBlocked')}
        </span>
      );
    }
    if (device.limited) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <Gauge className="w-3 h-3" />
          {t('statusLimited')}
        </span>
      );
    }
    if (device.status === 'Offline') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
          {t('statusOffline')}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#20D080]/15 text-[#20D080] border border-[#20D080]/30 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#20D080] animate-pulse" />
        {t('statusOnline')}
      </span>
    );
  };

  const handleSaveAlias = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateDeviceAlias(device.id, aliasInput.trim());
    setIsEditingAlias(false);
  };

  return (
    <div
      onClick={() => setSelectedDevice(device)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
        device.blocked
          ? 'bg-[#171A21] border-[#FF4D5E]/30 hover:border-[#FF4D5E]/60'
          : device.limited
          ? 'bg-[#171A21] border-amber-500/30 hover:border-amber-500/60'
          : 'bg-[#171A21] border-[#262A36] hover:border-[#00C2FF]/50 shadow-lg hover:shadow-[#00C2FF]/5'
      }`}
    >
      {/* Top Header: Icon + Name + Alias + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F1117] border border-[#262A36] flex items-center justify-center shrink-0">
            {getDeviceIcon(device.type)}
          </div>
          <div className="min-w-0">
            {isEditingAlias ? (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                  className="bg-[#0F1117] border border-[#00C2FF] text-slate-100 text-xs rounded-lg px-2 py-1 focus:outline-none w-36"
                  autoFocus
                />
                <button
                  onClick={handleSaveAlias}
                  className="p-1 bg-[#20D080]/20 text-[#20D080] rounded-lg hover:bg-[#20D080]/30"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingAlias(false);
                  }}
                  className="p-1 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group/alias">
                <h3 className="font-bold text-slate-100 text-sm truncate max-w-[170px]">
                  {device.alias || device.hostname}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAliasInput(device.alias || device.hostname);
                    setIsEditingAlias(true);
                  }}
                  className="opacity-0 group-hover/alias:opacity-100 p-1 text-slate-400 hover:text-[#00C2FF] transition-opacity"
                  title={t('editAlias')}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 truncate max-w-[180px] font-mono">
              {device.vendor}
            </p>
          </div>
        </div>

        <div>{getStatusBadge()}</div>
      </div>

      {/* Network Identifiers: IP & MAC */}
      <div className="grid grid-cols-2 gap-2 bg-[#0F1117] p-2.5 rounded-xl border border-[#262A36] mb-3 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block mb-0.5">IP Address</span>
          <span className="text-slate-200 font-semibold">{device.ip}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block mb-0.5">MAC Address</span>
          <span className="text-slate-300 truncate block">{device.mac}</span>
        </div>
      </div>

      {/* Live Bandwidth Traffic Counters */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0F1117]/80 rounded-xl border border-[#262A36]/60 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center text-[#00C2FF]">
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Download</span>
            <span className="text-xs font-bold font-mono text-[#00C2FF]">
              {device.downloadMbps.toFixed(1)} Mbps
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-[#262A36]" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#20D080]/10 flex items-center justify-center text-[#20D080]">
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Upload</span>
            <span className="text-xs font-bold font-mono text-[#20D080]">
              {device.uploadMbps.toFixed(1)} Mbps
            </span>
          </div>
        </div>
      </div>

      {/* Speed limit display if active */}
      {device.limited && (
        <div className="mb-3 text-[11px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl flex items-center justify-between">
          <span>Limit Applied:</span>
          <span className="font-mono font-bold">
            ↓ {device.downloadLimitMbps}M / ↑ {device.uploadLimitMbps}M
          </span>
        </div>
      )}

      {/* Action Buttons: Block / Unblock & Limit */}
      <div className="grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
        {device.blocked ? (
          <button
            onClick={() => unblockDevice(device.id)}
            className="w-full py-2 px-3 rounded-xl bg-[#20D080]/15 hover:bg-[#20D080]/25 text-[#20D080] border border-[#20D080]/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            {t('unblock')}
          </button>
        ) : (
          <button
            onClick={() => blockDevice(device.id)}
            className="w-full py-2 px-3 rounded-xl bg-[#FF4D5E]/15 hover:bg-[#FF4D5E]/25 text-[#FF4D5E] border border-[#FF4D5E]/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Ban className="w-3.5 h-3.5" />
            {t('block')}
          </button>
        )}

        {device.limited ? (
          <button
            onClick={() => removeLimit(device.id)}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            {t('removeLimit')}
          </button>
        ) : (
          <button
            onClick={() => setLimitModalDevice(device)}
            className="w-full py-2 px-3 rounded-xl bg-[#00C2FF]/15 hover:bg-[#00C2FF]/25 text-[#00C2FF] border border-[#00C2FF]/40 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Gauge className="w-3.5 h-3.5" />
            {t('limit')}
          </button>
        )}
      </div>
    </div>
  );
};
