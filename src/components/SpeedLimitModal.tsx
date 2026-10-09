import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gauge, X, Check, ArrowDown, ArrowUp } from 'lucide-react';

export const SpeedLimitModal: React.FC = () => {
  const { limitModalDevice, setLimitModalDevice, limitDevice, removeLimit, t } = useApp();

  const presetOptions = [
    { label: 'Unlimited', value: 0 },
    { label: '64 Kbps', value: 0.064 },
    { label: '128 Kbps', value: 0.128 },
    { label: '256 Kbps', value: 0.256 },
    { label: '512 Kbps', value: 0.512 },
    { label: '1 Mbps', value: 1 },
    { label: '2 Mbps', value: 2 },
    { label: '5 Mbps', value: 5 },
    { label: '10 Mbps', value: 10 },
    { label: 'Custom', value: -1 },
  ];

  const [selectedDl, setSelectedDl] = useState<number>(limitModalDevice?.downloadLimitMbps || 5);
  const [selectedUl, setSelectedUl] = useState<number>(limitModalDevice?.uploadLimitMbps || 1);

  const [customDl, setCustomDl] = useState<string>('8');
  const [customUl, setCustomUl] = useState<string>('2');

  if (!limitModalDevice) return null;

  const handleApply = () => {
    const finalDl = selectedDl === -1 ? parseFloat(customDl) || 1 : selectedDl;
    const finalUl = selectedUl === -1 ? parseFloat(customUl) || 1 : selectedUl;

    limitDevice(limitModalDevice.id, finalDl, finalUl);
    setLimitModalDevice(null);
  };

  const handleRemove = () => {
    removeLimit(limitModalDevice.id);
    setLimitModalDevice(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#171A21] border border-[#262A36] w-full max-w-lg rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262A36] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00C2FF]/10 text-[#00C2FF] flex items-center justify-center">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{t('speedLimitTitle')}</h2>
              <p className="text-xs text-slate-400 font-mono">
                {limitModalDevice.alias || limitModalDevice.hostname} ({limitModalDevice.ip})
              </p>
            </div>
          </div>
          <button
            onClick={() => setLimitModalDevice(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Download Speed Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#00C2FF] flex items-center gap-1.5">
              <ArrowDown className="w-4 h-4" />
              {t('downloadLimit')}
            </label>
            <span className="text-xs font-mono text-slate-300 bg-[#0F1117] px-2.5 py-1 rounded-lg border border-[#262A36]">
              {selectedDl === 0
                ? t('unlimited')
                : selectedDl === -1
                ? `${customDl} Mbps`
                : `${selectedDl} Mbps`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {presetOptions.map((opt) => {
              const isSelected = selectedDl === opt.value;
              return (
                <button
                  key={`dl-${opt.label}`}
                  onClick={() => setSelectedDl(opt.value)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#00C2FF] text-slate-950 border-[#00C2FF] shadow-lg shadow-[#00C2FF]/20'
                      : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
                  }`}
                >
                  {opt.label === 'Unlimited' ? t('unlimited') : opt.label}
                </button>
              );
            })}
          </div>

          {selectedDl === -1 && (
            <div className="flex items-center gap-2 mt-2 bg-[#0F1117] p-2 rounded-xl border border-[#00C2FF]/40">
              <span className="text-xs text-slate-400">{t('customMbps')}:</span>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={customDl}
                onChange={(e) => setCustomDl(e.target.value)}
                className="bg-transparent text-slate-100 text-sm font-bold focus:outline-none w-full"
              />
            </div>
          )}
        </div>

        {/* Upload Speed Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#20D080] flex items-center gap-1.5">
              <ArrowUp className="w-4 h-4" />
              {t('uploadLimit')}
            </label>
            <span className="text-xs font-mono text-slate-300 bg-[#0F1117] px-2.5 py-1 rounded-lg border border-[#262A36]">
              {selectedUl === 0
                ? t('unlimited')
                : selectedUl === -1
                ? `${customUl} Mbps`
                : `${selectedUl} Mbps`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {presetOptions.map((opt) => {
              const isSelected = selectedUl === opt.value;
              return (
                <button
                  key={`ul-${opt.label}`}
                  onClick={() => setSelectedUl(opt.value)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#20D080] text-slate-950 border-[#20D080] shadow-lg shadow-[#20D080]/20'
                      : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
                  }`}
                >
                  {opt.label === 'Unlimited' ? t('unlimited') : opt.label}
                </button>
              );
            })}
          </div>

          {selectedUl === -1 && (
            <div className="flex items-center gap-2 mt-2 bg-[#0F1117] p-2 rounded-xl border border-[#20D080]/40">
              <span className="text-xs text-slate-400">{t('customMbps')}:</span>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={customUl}
                onChange={(e) => setCustomUl(e.target.value)}
                className="bg-transparent text-slate-100 text-sm font-bold focus:outline-none w-full"
              />
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center gap-3">
          {limitModalDevice.limited && (
            <button
              onClick={handleRemove}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              {t('removeLimit')}
            </button>
          )}

          <button
            onClick={() => setLimitModalDevice(null)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0F1117] border border-[#262A36] hover:bg-white/5 text-slate-300 text-xs font-bold transition-colors"
          >
            {t('cancel')}
          </button>

          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00C2FF] to-[#20D080] hover:opacity-90 text-slate-950 text-xs font-extrabold shadow-lg shadow-[#00C2FF]/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
};
