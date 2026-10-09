import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, ArrowUpDown, Smartphone } from 'lucide-react';
import { DeviceCard } from '../components/DeviceCard';

export const DevicesScreen: React.FC = () => {
  const {
    devices,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    t,
  } = useApp();

  const filterOptions = [
    { id: 'All', labelKey: 'filterAll' },
    { id: 'Online', labelKey: 'filterOnline' },
    { id: 'Offline', labelKey: 'filterOffline' },
    { id: 'Blocked', labelKey: 'filterBlocked' },
    { id: 'Limited', labelKey: 'filterLimited' },
    { id: 'High Usage', labelKey: 'filterHighUsage' },
    { id: 'Unknown', labelKey: 'filterUnknown' },
  ];

  const sortOptions = [
    { id: 'Download', labelKey: 'sortDownload' },
    { id: 'Upload', labelKey: 'sortUpload' },
    { id: 'Total Usage', labelKey: 'sortTotalUsage' },
    { id: 'Name', labelKey: 'sortName' },
    { id: 'IP', labelKey: 'sortIp' },
    { id: 'Last Seen', labelKey: 'sortLastSeen' },
  ];

  // Search, Filter & Sort logic
  const filteredDevices = devices.filter((dev) => {
    // Search match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      dev.hostname.toLowerCase().includes(q) ||
      dev.ip.toLowerCase().includes(q) ||
      dev.mac.toLowerCase().includes(q) ||
      dev.vendor.toLowerCase().includes(q) ||
      (dev.alias && dev.alias.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Filter match
    if (activeFilter === 'Online') return dev.status === 'Online' && !dev.blocked;
    if (activeFilter === 'Offline') return dev.status === 'Offline';
    if (activeFilter === 'Blocked') return dev.blocked;
    if (activeFilter === 'Limited') return dev.limited;
    if (activeFilter === 'High Usage') return dev.downloadMbps > 5 || dev.uploadMbps > 2;
    if (activeFilter === 'Unknown') return dev.type === 'unknown' || dev.vendor.includes('Espressif');

    return true; // All
  });

  // Sorting
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sortBy === 'Download') return b.downloadMbps - a.downloadMbps;
    if (sortBy === 'Upload') return b.uploadMbps - a.uploadMbps;
    if (sortBy === 'Total Usage') return b.totalDownloadMB - a.totalDownloadMB;
    if (sortBy === 'Name') return (a.alias || a.hostname).localeCompare(b.alias || b.hostname);
    if (sortBy === 'IP') return a.ip.localeCompare(b.ip);
    if (sortBy === 'Last Seen') return b.lastSeen.localeCompare(a.lastSeen);
    return 0;
  });

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-300">
      {/* Header & Device Counter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-[#00C2FF]" />
            {t('connectedDevices')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {sortedDevices.length} of {devices.length} network targets
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full bg-[#171A21] border border-[#262A36] text-slate-100 placeholder-slate-500 text-sm rounded-2xl pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 focus:outline-none focus:border-[#00C2FF] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 mr-1 rtl:mr-0 rtl:ml-1 font-bold">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#00C2FF] text-slate-950 border-[#00C2FF] shadow-md shadow-[#00C2FF]/20'
                  : 'bg-[#171A21] text-slate-300 border-[#262A36] hover:border-slate-500'
              }`}
            >
              {t(opt.labelKey as any)}
            </button>
          );
        })}
      </div>

      {/* Sort Selector Bar */}
      <div className="flex items-center justify-between bg-[#171A21] px-4 py-2.5 rounded-2xl border border-[#262A36] text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#00C2FF]" />
          {t('sortBy')}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#0F1117] text-slate-200 font-bold px-3 py-1.5 rounded-xl border border-[#262A36] focus:outline-none focus:border-[#00C2FF]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {t(opt.labelKey as any)}
            </option>
          ))}
        </select>
      </div>

      {/* Device Cards Grid */}
      {sortedDevices.length === 0 ? (
        <div className="bg-[#171A21] rounded-3xl p-8 text-center border border-[#262A36]">
          <Smartphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-slate-300 font-bold text-base mb-1">No Devices Found</h3>
          <p className="text-slate-500 text-xs">
            Try adjusting your search query or active filter settings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedDevices.map((dev) => (
            <DeviceCard key={dev.id} device={dev} />
          ))}
        </div>
      )}
    </div>
  );
};
