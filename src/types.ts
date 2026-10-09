export type ThemeMode = 'system' | 'light' | 'dark';
export type Language = 'ar' | 'en';
export type RefreshRate = 250 | 500 | 1000 | 2000 | 5000;

export type DeviceStatus = 'Online' | 'Offline' | 'Blocked' | 'Limited';

export interface Device {
  id: string;
  hostname: string;
  alias?: string;
  ip: string;
  mac: string;
  vendor: string;
  firstSeen: string;
  lastSeen: string;
  status: DeviceStatus;
  blocked: boolean;
  limited: boolean;
  downloadMbps: number;
  uploadMbps: number;
  avgDownloadMbps: number;
  avgUploadMbps: number;
  totalDownloadMB: number;
  totalUploadMB: number;
  peakDownloadMbps: number;
  peakUploadMbps: number;
  downloadLimitMbps: number | null;
  uploadLimitMbps: number | null;
  type: 'phone' | 'laptop' | 'tv' | 'desktop' | 'tablet' | 'iot' | 'console' | 'unknown';
}

export interface Rule {
  id: string;
  deviceMac: string;
  deviceIp: string;
  deviceName?: string;
  type: 'BLOCK' | 'LIMIT';
  downloadLimit?: string;
  uploadLimit?: string;
  enabled: boolean;
  createdAt: string;
}

export interface TrafficDataPoint {
  time: string;
  timestamp: number;
  totalDownload: number;
  totalUpload: number;
  [key: string]: number | string; // per-device speeds dynamically
}

export interface RouterConfig {
  ip: string;
  port: number;
  useHttps: boolean;
  apiToken: string;
  timeoutMs: number;
  isConnected: boolean;
  model: string;
  firmware: string;
  uptime: string;
  lastTested?: string;
}

export interface NetworkScanInfo {
  ssid: string;
  gateway: string;
  localIp: string;
  subnetMask: string;
  interfaceName: string;
  isScanning: boolean;
  scanProgress: number;
  foundCount: number;
}
