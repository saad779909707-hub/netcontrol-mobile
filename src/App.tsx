import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { ToastContainer } from './components/ToastContainer';
import { SpeedLimitModal } from './components/SpeedLimitModal';
import { DeviceDetailsModal } from './components/DeviceDetailsModal';

import { DashboardScreen } from './screens/DashboardScreen';
import { DevicesScreen } from './screens/DevicesScreen';
import { TrafficScreen } from './screens/TrafficScreen';
import { RulesScreen } from './screens/RulesScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { RouterScreen } from './screens/RouterScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { CodebaseScreen } from './screens/CodebaseScreen';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen setActiveTab={setActiveTab} />;
      case 'devices':
        return <DevicesScreen />;
      case 'traffic':
        return <TrafficScreen />;
      case 'rules':
        return <RulesScreen />;
      case 'scanner':
        return <ScannerScreen />;
      case 'router':
        return <RouterScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'codebase':
        return <CodebaseScreen />;
      default:
        return <DashboardScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 font-sans selection:bg-[#00C2FF] selection:text-slate-950 flex flex-col">
      <ToastContainer />
      <Header isPhoneFrame={isPhoneFrame} setIsPhoneFrame={setIsPhoneFrame} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {isPhoneFrame ? (
          /* Mobile Phone Frame Simulator Wrapper */
          <div className="max-w-md mx-auto bg-[#171A21] rounded-[40px] border-[6px] border-[#262A36] shadow-2xl overflow-hidden relative flex flex-col my-2 min-h-[750px]">
            {/* Phone Camera Notch / Dynamic Island */}
            <div className="w-28 h-4 bg-[#0F1117] rounded-b-xl mx-auto mb-2 shrink-0 border-b border-x border-[#262A36]" />

            {/* Scrollable Screen Content */}
            <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
              {renderScreen()}
            </div>

            {/* In-Frame Bottom Navigation */}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        ) : (
          /* Desktop / Tablet Full View Mode */
          <div className="space-y-6">
            {renderScreen()}
            <div className="fixed bottom-0 left-0 right-0 z-30">
              <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
          </div>
        )}
      </main>

      <SpeedLimitModal />
      <DeviceDetailsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
