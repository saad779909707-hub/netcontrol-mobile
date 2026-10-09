import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Smartphone,
  Activity,
  ShieldAlert,
  Radar,
  Server,
  Settings,
  FileCode,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'devices'
  | 'traffic'
  | 'rules'
  | 'scanner'
  | 'router'
  | 'settings'
  | 'codebase';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useApp();

  const tabs: { id: ActiveTab; labelKey: keyof typeof import('../i18n/translations').translations.ar; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'devices', labelKey: 'devices', icon: Smartphone },
    { id: 'traffic', labelKey: 'traffic', icon: Activity },
    { id: 'rules', labelKey: 'rules', icon: ShieldAlert },
    { id: 'scanner', labelKey: 'scanner', icon: Radar },
    { id: 'router', labelKey: 'routerConfig', icon: Server },
    { id: 'settings', labelKey: 'settings', icon: Settings },
    { id: 'codebase', labelKey: 'codebase', icon: FileCode },
  ];

  return (
    <nav className="bg-[#171A21] border-t border-[#262A36] sticky bottom-0 z-30 shadow-2xl overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[62px] py-1.5 px-2 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#00C2FF] font-bold bg-[#00C2FF]/10 scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] leading-tight text-center whitespace-nowrap">
                {t(tab.labelKey)}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-6 h-1 rounded-full bg-[#00C2FF] shadow-sm shadow-[#00C2FF]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
