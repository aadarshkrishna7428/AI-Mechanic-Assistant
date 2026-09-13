import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { AIDiagnosisPage } from './components/diagnosis/AIDiagnosisPage';
import { MechanicFinder } from './components/mechanics/MechanicFinder';
import { ServiceTrackingPage } from './components/tracking/ServiceTrackingPage';
import { ServiceHistoryPage } from './components/history/ServiceHistoryPage';
import { SmartMaintenancePage } from './components/maintenance/SmartMaintenancePage';
import { VehicleModal } from './components/dashboard/VehicleModal';
import { ProfileModal } from './components/dashboard/ProfileModal';
import { ImageDiagnosisModal } from './components/multimodal/ImageDiagnosisModal';
import { AudioDiagnosisModal } from './components/multimodal/AudioDiagnosisModal';
import { AIChatAssistant } from './components/chat/AIChatAssistant';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#080c14] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && (
          <Dashboard
            onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
            onOpenImageModal={() => setIsImageModalOpen(true)}
            onOpenAudioModal={() => setIsAudioModalOpen(true)}
          />
        )}
        {(currentView === 'diagnose' || currentView === 'result') && (
          <AIDiagnosisPage onOpenVehicleModal={() => setIsVehicleModalOpen(true)} />
        )}
        {currentView === 'mechanics' && <MechanicFinder />}
        {currentView === 'tracking' && <ServiceTrackingPage />}
        {currentView === 'history' && <ServiceHistoryPage />}
        {currentView === 'maintenance' && <SmartMaintenancePage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Floatings */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <ImageDiagnosisModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />

      <AudioDiagnosisModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
      />

      <AIChatAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
