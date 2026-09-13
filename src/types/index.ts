export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  mileage: number;
  plateNumber: string;
  engineType: string;
  lastServiceDate: string;
  nextServiceKm: number;
  image: string;
  type: 'Bike' | 'Car';
}

export interface DiagnosisRequest {
  vehicleId: string;
  problemDescription: string;
  onset: string;
  frequency: string;
  mileageAtDiagnosis: number;
  recentServiceNotes?: string;
  warningLights: string[];
  performanceChanges: string[];
  evidenceType: 'text' | 'image' | 'audio' | 'multimodal';
  uploadedImage?: {
    name: string;
    previewUrl: string;
    category: string;
  };
  recordedAudio?: {
    name: string;
    durationSec: number;
    detectedFrequency: string;
    audioPattern: string;
  };
}

export interface RankedCause {
  title: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface PartCostItem {
  partName: string;
  estimatedCost: number;
  isRequired: boolean;
}

export interface CostEstimate {
  partsMin: number;
  partsMax: number;
  labourMin: number;
  labourMax: number;
  totalMin: number;
  totalMax: number;
  localMarketRange: {
    min: number;
    max: number;
  };
  partsBreakdown: PartCostItem[];
}

export interface AIDiagnosisResult {
  id: string;
  vehicleId: string;
  symptomSummary: string;
  probableIssue: string;
  confidence: number;
  rankedCauses: RankedCause[];
  xaiReasoning: string;
  symptomsDetected: string[];
  evidenceUsed: string[];
  recommendedAction: string;
  possibleRepair: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  canIDrive: {
    safe: boolean;
    advice: string;
  };
  disclaimer: string;
  costEstimate: CostEstimate;
  createdAt: string;
}

export interface Mechanic {
  id: string;
  name: string;
  workshop: string;
  rating: number;
  totalReviews: number;
  specializedBrands: string[];
  services: string[];
  distanceKm: number;
  priceTier: 'Budget' | 'Standard' | 'Premium';
  estimatedLabourRate: number;
  availability: string;
  location: string;
  address: string;
  phone: string;
  verified: boolean;
  experienceYears: number;
  image: string;
}

export type ServiceStageStatus = 'pending' | 'current' | 'completed';

export interface ServiceStage {
  id: string;
  title: string;
  timestamp?: string;
  status: ServiceStageStatus;
  technicianNote?: string;
}

export interface ServiceRequest {
  id: string;
  vehicleId: string;
  diagnosisId: string;
  mechanicId: string;
  problemTitle: string;
  aiDiagnosis: string;
  aiEstimatedCost: {
    min: number;
    max: number;
  };
  currentStageIndex: number;
  stages: ServiceStage[];
  createdAt: string;
  estimatedCompletion: string;
  serviceType: 'Shop Visit' | 'Doorstep Pickup';
  actualBill?: {
    mechanicDiagnosis: string;
    partsReplaced: string[];
    partsCost: number;
    labourCost: number;
    total: number;
  };
}

export interface ServiceReport {
  id: string;
  serviceRequestId: string;
  serviceIdDisplay: string;
  vehicle: Vehicle;
  mechanic: Mechanic;
  aiDiagnosis: string;
  aiEstimatedCost: {
    min: number;
    max: number;
  };
  mechanicDiagnosis: string;
  partsReplaced: string[];
  partsCost: number;
  labourCost: number;
  taxes: number;
  finalBill: number;
  isWithinEstimate: boolean;
  completionDate: string;
  mechanicNotes: string;
  invoiceNumber: string;
}

export interface MaintenancePrediction {
  id: string;
  vehicleId: string;
  component: string;
  category: 'Fluids' | 'Braking' | 'Drivetrain' | 'Electrical' | 'Engine' | 'Tyres';
  currentHealthPct: number;
  dueInKm: number;
  dueInDays: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  aiInsight: string;
  lastReplacedDate?: string;
  recommendedService: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  highlightCategory?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  memberSince: string;
}
