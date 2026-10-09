import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Trash2, Ban, Gauge, CheckCircle2, AlertOctagon } from 'lucide-react';

export const RulesScreen: React.FC = () => {
  const { rules, deleteRule, clearAllRules, t } = useApp();

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#00C2FF]" />
            {t('rules')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('activeRules')}
          </p>
        </div>

        {rules.length > 0 && (
          <button
            onClick={clearAllRules}
            className="px-3.5 py-2 rounded-xl bg-[#FF4D5E]/15 text-[#FF4D5E] hover:bg-[#FF4D5E]/25 border border-[#FF4D5E]/30 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="bg-[#171A21] rounded-3xl p-10 text-center border border-[#262A36]">
          <CheckCircle2 className="w-12 h-12 text-[#20D080] mx-auto mb-3" />
          <h3 className="text-slate-200 font-bold text-base mb-1">{t('noRules')}</h3>
          <p className="text-slate-400 text-xs">
            All devices are operating without network blocks or bandwidth speed caps.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-[#171A21] p-4 rounded-2xl border border-[#262A36] flex flex-wrap items-center justify-between gap-3 hover:border-[#00C2FF]/40 transition-all shadow-md"
            >
              <div className="flex items-center gap-3 min-w-[200px]">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    rule.type === 'BLOCK'
                      ? 'bg-[#FF4D5E]/15 text-[#FF4D5E] border border-[#FF4D5E]/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {rule.type === 'BLOCK' ? (
                    <Ban className="w-5 h-5" />
                  ) : (
                    <Gauge className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-slate-100 text-sm">
                    {rule.deviceName || 'Unknown Target'}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {rule.deviceIp} • {rule.deviceMac}
                  </p>
                </div>
              </div>

              {/* Rule Specs */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Rule Type</span>
                  <span
                    className={`font-bold ${
                      rule.type === 'BLOCK' ? 'text-[#FF4D5E]' : 'text-amber-400'
                    }`}
                  >
                    {rule.type === 'BLOCK' ? 'DROP (nftables)' : 'TC / SQM Limit'}
                  </span>
                </div>

                {rule.type === 'LIMIT' && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Limits</span>
                    <span className="text-amber-300 font-bold">
                      ↓ {rule.downloadLimit} / ↑ {rule.uploadLimit}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Created</span>
                  <span className="text-slate-400">{rule.createdAt.split(' ')[1]}</span>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => deleteRule(rule.id)}
                className="p-2 rounded-xl bg-[#0F1117] text-slate-400 hover:text-[#FF4D5E] hover:bg-[#FF4D5E]/10 border border-[#262A36] transition-colors"
                title={t('deleteRule')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Rules created in NetControl Mobile persist in the router&apos;s memory and are dynamically enforced via OpenWrt procd background services.
        </p>
      </div>
    </div>
  );
};
