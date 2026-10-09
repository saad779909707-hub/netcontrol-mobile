import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Moon,
  Sun,
  Languages,
  Clock,
  ShieldCheck,
  Bell,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { ThemeMode, Language, RefreshRate } from '../types';

export const SettingsScreen: React.FC = () => {
  const {
    theme,
    setTheme,
    lang,
    setLang,
    refreshRate,
    setRefreshRate,
    autoScan,
    setAutoScan,
    addToast,
    t,
  } = useApp();

  const [notifyJoined, setNotifyJoined] = useState(true);
  const [notifyLeft, setNotifyLeft] = useState(true);
  const [notifyBlocked, setNotifyBlocked] = useState(true);
  const [notifyOffline, setNotifyOffline] = useState(true);

  const refreshOptions: RefreshRate[] = [250, 500, 1000, 2000, 5000];

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#00C2FF]" />
          {t('settings')}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('appSettings')}
        </p>
      </div>

      {/* Theme Preference */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400" />
          {t('theme')}
        </label>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'dark', labelKey: 'themeDark', icon: Moon },
            { id: 'light', labelKey: 'themeLight', icon: Sun },
            { id: 'system', labelKey: 'themeSystem', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id as ThemeMode)}
                className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-[#00C2FF] text-slate-950 border-[#00C2FF] shadow-lg shadow-[#00C2FF]/20'
                    : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{t(item.labelKey as any)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Languages className="w-4 h-4 text-[#00C2FF]" />
          {t('language')}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLang('ar')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              lang === 'ar'
                ? 'bg-[#00C2FF] text-slate-950 border-[#00C2FF] shadow-lg shadow-[#00C2FF]/20'
                : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
            }`}
          >
            <span>العربية (RTL)</span>
          </button>

          <button
            onClick={() => setLang('en')}
            className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              lang === 'en'
                ? 'bg-[#00C2FF] text-slate-950 border-[#00C2FF] shadow-lg shadow-[#00C2FF]/20'
                : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
            }`}
          >
            <span>English (LTR)</span>
          </button>
        </div>
      </div>

      {/* Refresh Rate & Auto Scan */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            {t('autoRefresh')}
          </label>

          <div className="grid grid-cols-5 gap-1.5">
            {refreshOptions.map((rate) => {
              const isActive = refreshRate === rate;
              return (
                <button
                  key={rate}
                  onClick={() => setRefreshRate(rate)}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                    isActive
                      ? 'bg-[#20D080] text-slate-950 border-[#20D080] shadow-md shadow-[#20D080]/20'
                      : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:border-slate-500'
                  }`}
                >
                  {rate >= 1000 ? `${rate / 1000}s` : `${rate}ms`}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#262A36]">
          <span className="text-xs font-bold text-slate-300">{t('autoScan')}</span>
          <input
            type="checkbox"
            checked={autoScan}
            onChange={(e) => setAutoScan(e.target.checked)}
            className="w-5 h-5 rounded accent-[#00C2FF] cursor-pointer"
          />
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#20D080] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-200 mb-1">Android Keystore Security</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{t('securityKeystore')}</p>
        </div>
      </div>

      {/* Notification Options */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#00C2FF]" />
          {t('notifications')}
        </label>

        <div className="space-y-2.5 text-xs">
          <label className="flex items-center justify-between p-2.5 bg-[#0F1117] rounded-xl border border-[#262A36]">
            <span className="text-slate-300 font-medium">{t('notifyJoined')}</span>
            <input
              type="checkbox"
              checked={notifyJoined}
              onChange={(e) => setNotifyJoined(e.target.checked)}
              className="accent-[#00C2FF] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-[#0F1117] rounded-xl border border-[#262A36]">
            <span className="text-slate-300 font-medium">{t('notifyLeft')}</span>
            <input
              type="checkbox"
              checked={notifyLeft}
              onChange={(e) => setNotifyLeft(e.target.checked)}
              className="accent-[#00C2FF] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-[#0F1117] rounded-xl border border-[#262A36]">
            <span className="text-slate-300 font-medium">{t('notifyBlocked')}</span>
            <input
              type="checkbox"
              checked={notifyBlocked}
              onChange={(e) => setNotifyBlocked(e.target.checked)}
              className="accent-[#00C2FF] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-[#0F1117] rounded-xl border border-[#262A36]">
            <span className="text-slate-300 font-medium">{t('notifyOffline')}</span>
            <input
              type="checkbox"
              checked={notifyOffline}
              onChange={(e) => setNotifyOffline(e.target.checked)}
              className="accent-[#00C2FF] w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
