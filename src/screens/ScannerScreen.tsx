import React from 'react';
import { useApp } from '../context/AppContext';
import { Radar, Wifi, HardDrive, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DeviceCard } from '../components/DeviceCard';

export const ScannerScreen: React.FC = () => {
  const { scanInfo, triggerNetworkScan, devices, t } = useApp();

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Radar className="w-6 h-6 text-[#00C2FF]" />
          {t('scanner')}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Local Subnet Discovery & ARP Neighbor Scanner
        </p>
      </div>

      {/* Network Info Details Box */}
      <div className="bg-[#171A21] p-5 rounded-3xl border border-[#262A36] shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-[#20D080]" />
          {t('networkInfo')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono mb-5">
          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">{t('ssid')}</span>
            <span className="text-slate-100 font-bold">{scanInfo.ssid}</span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">{t('gateway')}</span>
            <span className="text-slate-100 font-bold">{scanInfo.gateway}</span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">{t('localIp')}</span>
            <span className="text-slate-100 font-bold">{scanInfo.localIp}</span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">{t('subnet')}</span>
            <span className="text-slate-300">{scanInfo.subnetMask}</span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">{t('interface')}</span>
            <span className="text-slate-300">{scanInfo.interfaceName}</span>
          </div>

          <div className="bg-[#0F1117] p-3 rounded-2xl border border-[#262A36]">
            <span className="text-[10px] text-slate-500 uppercase block mb-0.5">Found Devices</span>
            <span className="text-[#00C2FF] font-bold">{devices.length} Hosts</span>
          </div>
        </div>

        {/* Scan Button & Radar Animation */}
        {scanInfo.isScanning ? (
          <div className="space-y-3 p-4 bg-[#0F1117] rounded-2xl border border-[#00C2FF]/30">
            <div className="flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-[#00C2FF] flex items-center gap-2">
                <Radar className="w-4 h-4 animate-spin text-[#00C2FF]" />
                {t('scanning')}
              </span>
              <span className="text-slate-300">{scanInfo.scanProgress}%</span>
            </div>

            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-[#262A36]">
              <div
                className="h-full bg-gradient-to-r from-[#00C2FF] to-[#20D080] transition-all duration-300"
                style={{ width: `${scanInfo.scanProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => triggerNetworkScan()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#00C2FF] to-[#20D080] hover:opacity-95 text-slate-950 font-black text-sm shadow-lg shadow-[#00C2FF]/20 transition-all flex items-center justify-center gap-2"
          >
            <Radar className="w-5 h-5 stroke-[2.5]" />
            {t('scanNetwork')}
          </button>
        )}
      </div>

      {/* Discovered Hosts List */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#20D080]" />
            Discovered Devices ({devices.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((dev) => (
            <DeviceCard key={dev.id} device={dev} />
          ))}
        </div>
      </div>
    </div>
  );
};
