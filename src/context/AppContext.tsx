import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Device, Rule, RouterConfig, NetworkScanInfo, ThemeMode, Language, RefreshRate, TrafficDataPoint } from '../types';
import { initialDevices, initialRules, defaultRouterConfig, defaultNetworkScan } from '../data/mockData';
import { translations } from '../i18n/translations';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // State
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  refreshRate: RefreshRate;
  setRefreshRate: (rate: RefreshRate) => void;
  autoScan: boolean;
  setAutoScan: (autoScan: boolean) => void;
  
  devices: Device[];
  rules: Rule[];
  routerConfig: RouterConfig;
  scanInfo: NetworkScanInfo;
  trafficHistory: TrafficDataPoint[];
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  
  selectedDevice: Device | null;
  setSelectedDevice: (d: Device | null) => void;
  limitModalDevice: Device | null;
  setLimitModalDevice: (d: Device | null) => void;
  
  toasts: Toast[];
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Actions
  blockDevice: (deviceId: string) => void;
  unblockDevice: (deviceId: string) => void;
  limitDevice: (deviceId: string, downloadMbps: number, uploadMbps: number) => void;
  removeLimit: (deviceId: string) => void;
  updateDeviceAlias: (deviceId: string, alias: string) => void;
  triggerNetworkScan: () => void;
  testRouterConnection: () => Promise<boolean>;
  updateRouterConfig: (config: Partial<RouterConfig>) => void;
  deleteRule: (ruleId: string) => void;
  clearAllRules: () => void;
  
  // Translation Helper
  t: (key: keyof typeof translations.ar) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [lang, setLangState] = useState<Language>('ar');
  const [refreshRate, setRefreshRate] = useState<RefreshRate>(1000);
  const [autoScan, setAutoScan] = useState<boolean>(true);

  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [routerConfig, setRouterConfig] = useState<RouterConfig>(defaultRouterConfig);
  const [scanInfo, setScanInfo] = useState<NetworkScanInfo>(defaultNetworkScan);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Download');

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [limitModalDevice, setLimitModalDevice] = useState<Device | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [trafficHistory, setTrafficHistory] = useState<TrafficDataPoint[]>(() => {
    // Generate initial 60 points of history
    const now = Date.now();
    const history: TrafficDataPoint[] = [];
    for (let i = 60; i >= 0; i--) {
      const ts = now - i * 1000;
      const date = new Date(ts);
      const timeStr = date.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
      
      const pt: TrafficDataPoint = {
        time: timeStr,
        timestamp: ts,
        totalDownload: Math.round((Math.random() * 15 + 10) * 10) / 10,
        totalUpload: Math.round((Math.random() * 4 + 1.5) * 10) / 10,
      };
      
      initialDevices.forEach(dev => {
        if (!dev.blocked) {
          pt[dev.id] = Math.round((Math.random() * (dev.downloadMbps || 2)) * 10) / 10;
        } else {
          pt[dev.id] = 0;
        }
      });

      history.push(pt);
    }
    return history;
  });

  // Apply html theme class & dir
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
  const setLang = (l: Language) => setLangState(l);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const t = useCallback((key: keyof typeof translations.ar): string => {
    return translations[lang][key] || translations['en'][key] || String(key);
  }, [lang]);

  // Live traffic refresh loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prevDevices) => {
        return prevDevices.map((dev) => {
          if (dev.blocked || dev.status === 'Offline') {
            return { ...dev, downloadMbps: 0, uploadMbps: 0 };
          }

          // Fluctuating bandwidth based on speed limit if applied
          let maxDl = dev.downloadLimitMbps ?? (dev.type === 'tv' ? 25 : dev.type === 'console' ? 35 : dev.type === 'laptop' ? 20 : 10);
          let maxUl = dev.uploadLimitMbps ?? 5;

          const variation = (Math.random() - 0.48) * 1.8;
          let newDl = Math.max(0.05, Math.min(maxDl, dev.downloadMbps + variation));
          let newUl = Math.max(0.02, Math.min(maxUl, dev.uploadMbps + variation * 0.3));

          newDl = Math.round(newDl * 10) / 10;
          newUl = Math.round(newUl * 10) / 10;

          const totalDl = Math.round((dev.totalDownloadMB + newDl / 8) * 10) / 10;
          const totalUl = Math.round((dev.totalUploadMB + newUl / 8) * 10) / 10;
          const peakDl = Math.max(dev.peakDownloadMbps, newDl);
          const peakUl = Math.max(dev.peakUploadMbps, newUl);

          return {
            ...dev,
            downloadMbps: newDl,
            uploadMbps: newUl,
            totalDownloadMB: totalDl,
            totalUploadMB: totalUl,
            peakDownloadMbps: peakDl,
            peakUploadMbps: peakUl,
          };
        });
      });

      // Update traffic history
      setTrafficHistory((prevHistory) => {
        const now = Date.now();
        const date = new Date(now);
        const timeStr = date.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });

        const activeDevs = devices.filter((d) => !d.blocked && d.status !== 'Offline');
        const totDl = activeDevs.reduce((acc, d) => acc + d.downloadMbps, 0);
        const totUl = activeDevs.reduce((acc, d) => acc + d.uploadMbps, 0);

        const newPoint: TrafficDataPoint = {
          time: timeStr,
          timestamp: now,
          totalDownload: Math.round(totDl * 10) / 10,
          totalUpload: Math.round(totUl * 10) / 10,
        };

        devices.forEach((dev) => {
          newPoint[dev.id] = dev.downloadMbps;
        });

        const updated = [...prevHistory.slice(-59), newPoint];
        return updated;
      });
    }, refreshRate);

    return () => clearInterval(interval);
  }, [refreshRate, devices]);

  // Actions
  const blockDevice = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          return { ...dev, blocked: true, status: 'Blocked', downloadMbps: 0, uploadMbps: 0 };
        }
        return dev;
      })
    );

    // Update or add rule
    const targetDev = devices.find((d) => d.id === deviceId);
    if (targetDev) {
      setRules((prev) => {
        const existing = prev.find((r) => r.deviceMac === targetDev.mac);
        if (existing) {
          return prev.map((r) => (r.deviceMac === targetDev.mac ? { ...r, type: 'BLOCK', enabled: true } : r));
        }
        return [
          ...prev,
          {
            id: `rule-${Date.now()}`,
            deviceMac: targetDev.mac,
            deviceIp: targetDev.ip,
            deviceName: targetDev.alias || targetDev.hostname,
            type: 'BLOCK',
            enabled: true,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          },
        ];
      });
    }

    addToast(t('deviceBlockedMsg'), 'error');
  }, [devices, addToast, t]);

  const unblockDevice = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          const isLimited = dev.downloadLimitMbps !== null || dev.uploadLimitMbps !== null;
          return {
            ...dev,
            blocked: false,
            status: isLimited ? 'Limited' : 'Online',
            downloadMbps: isLimited ? (dev.downloadLimitMbps || 2) : 5.0,
            uploadMbps: isLimited ? (dev.uploadLimitMbps || 1) : 1.2,
          };
        }
        return dev;
      })
    );

    const targetDev = devices.find((d) => d.id === deviceId);
    if (targetDev) {
      setRules((prev) => prev.filter((r) => !(r.deviceMac === targetDev.mac && r.type === 'BLOCK')));
    }

    addToast(t('deviceUnblockedMsg'), 'success');
  }, [devices, addToast, t]);

  const limitDevice = useCallback((deviceId: string, downloadMbps: number, uploadMbps: number) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          return {
            ...dev,
            limited: true,
            downloadLimitMbps: downloadMbps,
            uploadLimitMbps: uploadMbps,
            status: dev.blocked ? 'Blocked' : 'Limited',
            downloadMbps: Math.min(dev.downloadMbps, downloadMbps),
            uploadMbps: Math.min(dev.uploadMbps, uploadMbps),
          };
        }
        return dev;
      })
    );

    const targetDev = devices.find((d) => d.id === deviceId);
    if (targetDev) {
      setRules((prev) => {
        const filtered = prev.filter((r) => !(r.deviceMac === targetDev.mac && r.type === 'LIMIT'));
        return [
          ...filtered,
          {
            id: `rule-${Date.now()}`,
            deviceMac: targetDev.mac,
            deviceIp: targetDev.ip,
            deviceName: targetDev.alias || targetDev.hostname,
            type: 'LIMIT',
            downloadLimit: `${downloadMbps} Mbps`,
            uploadLimit: `${uploadMbps} Mbps`,
            enabled: true,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          },
        ];
      });
    }

    addToast(t('limitAppliedMsg'), 'info');
  }, [devices, addToast, t]);

  const removeLimit = useCallback((deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id === deviceId) {
          return {
            ...dev,
            limited: false,
            downloadLimitMbps: null,
            uploadLimitMbps: null,
            status: dev.blocked ? 'Blocked' : 'Online',
          };
        }
        return dev;
      })
    );

    const targetDev = devices.find((d) => d.id === deviceId);
    if (targetDev) {
      setRules((prev) => prev.filter((r) => !(r.deviceMac === targetDev.mac && r.type === 'LIMIT')));
    }

    addToast(t('limitRemovedMsg'), 'success');
  }, [devices, addToast, t]);

  const updateDeviceAlias = useCallback((deviceId: string, alias: string) => {
    setDevices((prev) =>
      prev.map((dev) => (dev.id === deviceId ? { ...dev, alias } : dev))
    );
    addToast(t('saveAlias'), 'success');
  }, [addToast, t]);

  const triggerNetworkScan = useCallback(() => {
    setScanInfo((prev) => ({ ...prev, isScanning: true, scanProgress: 0 }));
    let progress = 0;
    const scanInterval = setInterval(() => {
      progress += 20;
      setScanInfo((prev) => ({ ...prev, scanProgress: progress }));
      if (progress >= 100) {
        clearInterval(scanInterval);
        setScanInfo((prev) => ({ ...prev, isScanning: false, foundCount: devices.length }));
        addToast(`${t('scanNetwork')}: Found ${devices.length} devices`, 'success');
      }
    }, 300);
  }, [devices.length, addToast, t]);

  const testRouterConnection = useCallback(async (): Promise<boolean> => {
    setRouterConfig((prev) => ({ ...prev, isConnected: false }));
    await new Promise((res) => setTimeout(res, 1200));
    setRouterConfig((prev) => ({
      ...prev,
      isConnected: true,
      lastTested: new Date().toISOString().replace('T', ' ').substring(0, 19),
    }));
    addToast(t('routerConnectedMsg'), 'success');
    return true;
  }, [addToast, t]);

  const updateRouterConfig = useCallback((config: Partial<RouterConfig>) => {
    setRouterConfig((prev) => ({ ...prev, ...config }));
  }, []);

  const deleteRule = useCallback((ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
    addToast('Rule deleted', 'info');
  }, [addToast]);

  const clearAllRules = useCallback(() => {
    setRules([]);
    setDevices((prev) =>
      prev.map((dev) => ({
        ...dev,
        blocked: false,
        limited: false,
        downloadLimitMbps: null,
        uploadLimitMbps: null,
        status: 'Online',
      }))
    );
    addToast('All rules cleared', 'success');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        lang,
        setLang,
        refreshRate,
        setRefreshRate,
        autoScan,
        setAutoScan,
        devices,
        rules,
        routerConfig,
        scanInfo,
        trafficHistory,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        sortBy,
        setSortBy,
        selectedDevice,
        setSelectedDevice,
        limitModalDevice,
        setLimitModalDevice,
        toasts,
        addToast,
        removeToast,
        blockDevice,
        unblockDevice,
        limitDevice,
        removeLimit,
        updateDeviceAlias,
        triggerNetworkScan,
        testRouterConnection,
        updateRouterConfig,
        deleteRule,
        clearAllRules,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
