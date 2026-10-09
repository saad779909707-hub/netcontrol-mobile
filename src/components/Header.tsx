import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Wifi, Moon, Sun, Languages, Smartphone, Monitor } from 'lucide-react';

interface HeaderProps {
  isPhoneFrame: boolean;
  setIsPhoneFrame: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isPhoneFrame, setIsPhoneFrame }) => {
  const { theme, setTheme, lang, setLang, routerConfig, t } = useApp();

  return (
    <header className="bg-[#171A21] border-b border-[#262A36] px-4 py-3 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00C2FF] to-[#20D080] flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-[#00C2FF]/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-wide text-slate-100">
                {t('appTitle')}
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/30 font-bold">
                OpenWrt
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('subTitle')}
            </p>
          </div>
        </div>

        {/* Status & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Router Connection Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#262A36] text-xs">
            <Wifi
              className={`w-4 h-4 ${
                routerConfig.isConnected ? 'text-[#20D080] animate-pulse' : 'text-[#FF4D5E]'
              }`}
            />
            <span className="hidden md:inline font-mono text-slate-300">
              {routerConfig.ip}
            </span>
            <span
              className={`font-semibold text-[11px] ${
                routerConfig.isConnected ? 'text-[#20D080]' : 'text-[#FF4D5E]'
              }`}
            >
              {routerConfig.isConnected ? t('connected') : t('disconnected')}
            </span>
          </div>

          {/* Phone Frame vs Full View Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            title="Toggle Android Device Frame"
            className="p-2 rounded-xl bg-[#0F1117] border border-[#262A36] text-slate-300 hover:text-[#00C2FF] hover:border-[#00C2FF]/40 transition-all"
          >
            {isPhoneFrame ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
            className="p-2 rounded-xl bg-[#0F1117] border border-[#262A36] text-slate-300 hover:text-[#00C2FF] hover:border-[#00C2FF]/40 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            title="Change Language"
            className="px-2.5 py-1.5 rounded-xl bg-[#0F1117] border border-[#262A36] text-slate-200 text-xs font-bold hover:text-[#00C2FF] hover:border-[#00C2FF]/40 transition-all flex items-center gap-1.5"
          >
            <Languages className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
