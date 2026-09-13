import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Vehicle,
  AIDiagnosisResult,
  Mechanic,
  ServiceRequest,
  ServiceReport,
  MaintenancePrediction,
} from '../types';
import {
  sampleVehicles,
  sampleMechanics,
  initialActiveServiceRequest,
  sampleServiceHistory,
  sampleMaintenancePredictions,
} from '../data/mockData';

interface AppContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle;
  setActiveVehicle: (v: Vehicle) => void;
  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  mechanics: Mechanic[];
  activeDiagnosis: AIDiagnosisResult | null;
  setActiveDiagnosis: (d: AIDiagnosisResult | null) => void;
  serviceRequests: ServiceRequest[];
  activeServiceRequest: ServiceRequest | null;
  setActiveServiceRequestId: (id: string) => void;
  createServiceRequest: (
    diag: AIDiagnosisResult,
    mechanicId: string,
    serviceType?: 'Shop Visit' | 'Doorstep Pickup'
  ) => ServiceRequest;
  advanceServiceStage: (requestId: string) => void;
  resetServiceStage: (requestId: string) => void;
  serviceReports: ServiceReport[];
  selectedReport: ServiceReport | null;
  setSelectedReport: (r: ServiceReport | null) => void;
  maintenancePredictions: MaintenancePrediction[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('ai_mech_vehicles');
    return saved ? JSON.parse(saved) : sampleVehicles;
  });
  const [activeVehicle, setActiveVehicle] = useState<Vehicle>(() => vehicles[0] || sampleVehicles[0]);
  const [mechanics] = useState<Mechanic[]>(sampleMechanics);

  const [activeDiagnosis, setActiveDiagnosis] = useState<AIDiagnosisResult | null>(() => {
    const saved = localStorage.getItem('ai_mech_active_diag');
    return saved ? JSON.parse(saved) : null;
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('ai_mech_requests');
    return saved ? JSON.parse(saved) : [initialActiveServiceRequest];
  });

  const [activeServiceRequestId, setActiveServiceRequestId] = useState<string>(
    initialActiveServiceRequest.id
  );

  const [serviceReports, setServiceReports] = useState<ServiceReport[]>(() => {
    const saved = localStorage.getItem('ai_mech_reports');
    return saved ? JSON.parse(saved) : sampleServiceHistory;
  });

  const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null);
  const [maintenancePredictions, setMaintenancePredictions] = useState<MaintenancePrediction[]>(
    sampleMaintenancePredictions
  );
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('ai_mech_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    if (activeDiagnosis) {
      localStorage.setItem('ai_mech_active_diag', JSON.stringify(activeDiagnosis));
    }
  }, [activeDiagnosis]);

  useEffect(() => {
    localStorage.setItem('ai_mech_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem('ai_mech_reports', JSON.stringify(serviceReports));
  }, [serviceReports]);

  const activeServiceRequest =
    serviceRequests.find((r) => r.id === activeServiceRequestId) || serviceRequests[0] || null;

  const addVehicle = (newVeh: Omit<Vehicle, 'id'>) => {
    const vehicle: Vehicle = {
      ...newVeh,
      id: `veh-${Date.now()}`,
    };
    const updated = [vehicle, ...vehicles];
    setVehicles(updated);
    setActiveVehicle(vehicle);
  };

  const createServiceRequest = (
    diag: AIDiagnosisResult,
    mechanicId: string,
    serviceType: 'Shop Visit' | 'Doorstep Pickup' = 'Shop Visit'
  ): ServiceRequest => {
    const mech = mechanics.find((m) => m.id === mechanicId) || mechanics[0];
    const newId = `SRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: ServiceRequest = {
      id: newId,
      vehicleId: diag.vehicleId,
      diagnosisId: diag.id,
      mechanicId: mech.id,
      problemTitle: diag.symptomSummary || 'Engine / Starting Diagnostic',
      aiDiagnosis: `${diag.probableIssue} (${diag.confidence}% Confidence)`,
      aiEstimatedCost: {
        min: diag.costEstimate.totalMin,
        max: diag.costEstimate.totalMax,
      },
      currentStageIndex: 0,
      createdAt: 'Just now',
      estimatedCompletion: 'Today, 6:00 PM',
      serviceType,
      stages: [
        {
          id: 'stg-1',
          title: 'Service Requested',
          timestamp: 'Just now',
          status: 'completed',
          technicianNote: `Digital request received for ${activeVehicle.make} ${activeVehicle.model}. AI diagnosis attached.`,
        },
        {
          id: 'stg-2',
          title: 'Vehicle Received',
          status: 'current',
          technicianNote: 'Awaiting arrival at workshop bay or technician doorstep dispatch.',
        },
        {
          id: 'stg-3',
          title: 'Diagnosis Confirmed',
          status: 'pending',
          technicianNote: 'Digital multimeter & scanner bench verification.',
        },
        {
          id: 'stg-4',
          title: 'Repair in Progress',
          status: 'pending',
          technicianNote: 'Parts replacement and technical adjustments.',
        },
        {
          id: 'stg-5',
          title: 'Quality Check',
          status: 'pending',
          technicianNote: 'Multi-point safety verification and road test.',
        },
        {
          id: 'stg-6',
          title: 'Ready for Pickup',
          status: 'pending',
          technicianNote: 'Completed invoice generated. Keys ready.',
        },
      ],
      actualBill: {
        mechanicDiagnosis: `${diag.probableIssue} verified by workshop technician.`,
        partsReplaced: diag.costEstimate.partsBreakdown.map((p) => p.partName),
        partsCost: diag.costEstimate.partsMin + 350,
        labourCost: diag.costEstimate.labourMin + 150,
        total: diag.costEstimate.partsMin + 350 + diag.costEstimate.labourMin + 150,
      },
    };

    const updated = [newRequest, ...serviceRequests];
    setServiceRequests(updated);
    setActiveServiceRequestId(newId);
    return newRequest;
  };

  const advanceServiceStage = (requestId: string) => {
    setServiceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const nextIndex = Math.min(req.currentStageIndex + 1, req.stages.length - 1);
        const updatedStages = req.stages.map((stage, idx) => {
          if (idx < nextIndex) {
            return {
              ...stage,
              status: 'completed' as const,
              timestamp: stage.timestamp || 'Completed earlier',
            };
          } else if (idx === nextIndex) {
            return {
              ...stage,
              status: 'current' as const,
              timestamp: 'Just updated',
            };
          } else {
            return {
              ...stage,
              status: 'pending' as const,
            };
          }
        });

        // If reaching final stage (Ready for Pickup), ensure a final report is generated in history
        if (nextIndex === req.stages.length - 1 && req.actualBill) {
          const mech = mechanics.find((m) => m.id === req.mechanicId) || mechanics[0];
          const repExists = serviceReports.some((r) => r.serviceRequestId === req.id);
          if (!repExists) {
            const newReport: ServiceReport = {
              id: `rep-${req.id.replace('SRV-', '')}`,
              serviceRequestId: req.id,
              serviceIdDisplay: req.id,
              vehicle: activeVehicle,
              mechanic: mech,
              aiDiagnosis: req.aiDiagnosis,
              aiEstimatedCost: req.aiEstimatedCost,
              mechanicDiagnosis: req.actualBill.mechanicDiagnosis,
              partsReplaced: req.actualBill.partsReplaced,
              partsCost: req.actualBill.partsCost,
              labourCost: req.actualBill.labourCost,
              taxes: 0,
              finalBill: req.actualBill.total,
              isWithinEstimate:
                req.actualBill.total >= req.aiEstimatedCost.min &&
                req.actualBill.total <= req.aiEstimatedCost.max,
              completionDate: 'Today',
              mechanicNotes: 'All checks passed. Battery voltage steady at 12.8V resting, 14.3V charging.',
              invoiceNumber: `INV-${mech.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            };
            setServiceReports((rPrev) => [newReport, ...rPrev]);
          }
        }

        return {
          ...req,
          currentStageIndex: nextIndex,
          stages: updatedStages,
        };
      })
    );
  };

  const resetServiceStage = (requestId: string) => {
    setServiceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const resetStages = req.stages.map((stage, idx) => ({
          ...stage,
          status: idx === 0 ? ('completed' as const) : idx === 1 ? ('current' as const) : ('pending' as const),
          timestamp: idx === 0 ? 'Today, 10:15 AM' : undefined,
        }));
        return {
          ...req,
          currentStageIndex: 1,
          stages: resetStages,
        };
      })
    );
  };

  const resetAllDemoData = () => {
    localStorage.removeItem('ai_mech_vehicles');
    localStorage.removeItem('ai_mech_active_diag');
    localStorage.removeItem('ai_mech_requests');
    localStorage.removeItem('ai_mech_reports');
    setVehicles(sampleVehicles);
    setActiveVehicle(sampleVehicles[0]);
    setActiveDiagnosis(null);
    setServiceRequests([initialActiveServiceRequest]);
    setActiveServiceRequestId(initialActiveServiceRequest.id);
    setServiceReports(sampleServiceHistory);
    setMaintenancePredictions(sampleMaintenancePredictions);
    setSelectedReport(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        vehicles,
        activeVehicle,
        setActiveVehicle,
        addVehicle,
        mechanics,
        activeDiagnosis,
        setActiveDiagnosis,
        serviceRequests,
        activeServiceRequest,
        setActiveServiceRequestId,
        createServiceRequest,
        advanceServiceStage,
        resetServiceStage,
        serviceReports,
        selectedReport,
        setSelectedReport,
        maintenancePredictions,
        isChatOpen,
        setIsChatOpen,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
