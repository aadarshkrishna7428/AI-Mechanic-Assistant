import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Vehicle,
  Mechanic,
  AIDiagnosisResult,
  ServiceRequest,
  ServiceReport,
  MaintenancePrediction,
  ChatMessage,
  UserProfile,
} from '../types';

// ==============================================================================
// 1. VEHICLES
// ==============================================================================

export const apiFetchVehicles = async (): Promise<Vehicle[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      make: row.make,
      model: row.model,
      year: row.year,
      fuelType: row.fuel_type,
      mileage: row.mileage,
      plateNumber: row.plate_number,
      engineType: row.engine_type || '',
      lastServiceDate: row.last_service_date || 'N/A',
      nextServiceKm: row.next_service_km || 3000,
      image: row.image,
      type: row.type,
    }));
  } catch (e) {
    console.warn('Supabase fetchVehicles error:', e);
    return null;
  }
};

export const apiInsertVehicle = async (vehicle: Vehicle): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('vehicles').insert([
      {
        id: vehicle.id,
        user_id: 'user-1',
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        fuel_type: vehicle.fuelType,
        mileage: vehicle.mileage,
        plate_number: vehicle.plateNumber,
        engine_type: vehicle.engineType,
        last_service_date: vehicle.lastServiceDate,
        next_service_km: vehicle.nextServiceKm,
        image: vehicle.image,
        type: vehicle.type,
      },
    ]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase insertVehicle error:', e);
    return false;
  }
};

// ==============================================================================
// 2. MECHANICS
// ==============================================================================

export const apiFetchMechanics = async (): Promise<Mechanic[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('mechanics')
      .select('*')
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      workshop: row.workshop,
      rating: Number(row.rating),
      totalReviews: row.total_reviews,
      specializedBrands: row.specialized_brands || [],
      services: row.services || [],
      distanceKm: Number(row.distance_km),
      priceTier: row.price_tier,
      estimatedLabourRate: Number(row.estimated_labour_rate),
      availability: row.availability,
      location: row.location,
      address: row.address,
      phone: row.phone,
      verified: row.verified,
      experienceYears: row.experience_years,
      image: row.image,
    }));
  } catch (e) {
    console.warn('Supabase fetchMechanics error:', e);
    return null;
  }
};

// ==============================================================================
// 3. AI DIAGNOSES
// ==============================================================================

export const apiInsertDiagnosis = async (
  diag: AIDiagnosisResult,
  extraInputs?: {
    problemDescription?: string;
    onset?: string;
    frequency?: string;
    mileageAtDiagnosis?: number;
    evidenceType?: string;
    uploadedImage?: any;
    recordedAudio?: any;
  }
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('diagnoses').insert([
      {
        id: diag.id,
        vehicle_id: diag.vehicleId,
        symptom_summary: diag.symptomSummary,
        probable_issue: diag.probableIssue,
        confidence: diag.confidence,
        ranked_causes: diag.rankedCauses,
        xai_reasoning: diag.xaiReasoning,
        symptoms_detected: diag.symptomsDetected,
        evidence_used: diag.evidenceUsed,
        evidence_type: extraInputs?.evidenceType || 'multimodal',
        uploaded_image: extraInputs?.uploadedImage || null,
        recorded_audio: extraInputs?.recordedAudio || null,
        recommended_action: diag.recommendedAction,
        possible_repair: diag.possibleRepair,
        urgency: diag.urgency,
        can_i_drive: diag.canIDrive,
        disclaimer: diag.disclaimer,
        cost_estimate: diag.costEstimate,
        problem_description: extraInputs?.problemDescription || diag.symptomSummary,
        onset: extraInputs?.onset || 'today',
        frequency: extraInputs?.frequency || 'always',
        mileage_at_diagnosis: extraInputs?.mileageAtDiagnosis || 0,
      },
    ]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase insertDiagnosis error:', e);
    return false;
  }
};

// ==============================================================================
// 4. SERVICE REQUESTS
// ==============================================================================

export const apiFetchServiceRequests = async (): Promise<ServiceRequest[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      vehicleId: row.vehicle_id,
      diagnosisId: row.diagnosis_id || '',
      mechanicId: row.mechanic_id,
      problemTitle: row.problem_title,
      aiDiagnosis: row.ai_diagnosis,
      aiEstimatedCost: row.ai_estimated_cost,
      currentStageIndex: row.current_stage_index,
      stages: row.stages,
      createdAt: row.created_at,
      estimatedCompletion: row.estimated_completion,
      serviceType: row.service_type,
      actualBill: row.actual_bill,
    }));
  } catch (e) {
    console.warn('Supabase fetchServiceRequests error:', e);
    return null;
  }
};

export const apiInsertServiceRequest = async (req: ServiceRequest): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('service_requests').insert([
      {
        id: req.id,
        vehicle_id: req.vehicleId,
        diagnosis_id: req.diagnosisId || null,
        mechanic_id: req.mechanicId,
        problem_title: req.problemTitle,
        ai_diagnosis: req.aiDiagnosis,
        ai_estimated_cost: req.aiEstimatedCost,
        current_stage_index: req.currentStageIndex,
        stages: req.stages,
        estimated_completion: req.estimatedCompletion,
        service_type: req.serviceType,
        actual_bill: req.actualBill,
        status: 'active',
      },
    ]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase insertServiceRequest error:', e);
    return false;
  }
};

export const apiUpdateServiceStages = async (
  requestId: string,
  stageIndex: number,
  stages: any[]
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({
        current_stage_index: stageIndex,
        stages: stages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase updateServiceStages error:', e);
    return false;
  }
};

// ==============================================================================
// 5. SERVICE REPORTS
// ==============================================================================

export const apiFetchServiceReports = async (): Promise<ServiceReport[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('service_reports')
      .select('*, vehicles(*), mechanics(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      serviceRequestId: row.service_request_id || row.service_id_display,
      serviceIdDisplay: row.service_id_display,
      vehicle: row.vehicles
        ? {
            id: row.vehicles.id,
            make: row.vehicles.make,
            model: row.vehicles.model,
            year: row.vehicles.year,
            fuelType: row.vehicles.fuel_type,
            mileage: row.vehicles.mileage,
            plateNumber: row.vehicles.plate_number,
            engineType: row.vehicles.engine_type || '',
            lastServiceDate: row.vehicles.last_service_date || '',
            nextServiceKm: row.vehicles.next_service_km || 3000,
            image: row.vehicles.image,
            type: row.vehicles.type,
          }
        : ({} as any),
      mechanic: row.mechanics
        ? {
            id: row.mechanics.id,
            name: row.mechanics.name,
            workshop: row.mechanics.workshop,
            rating: Number(row.mechanics.rating),
            totalReviews: row.mechanics.total_reviews,
            specializedBrands: row.mechanics.specialized_brands || [],
            services: row.mechanics.services || [],
            distanceKm: Number(row.mechanics.distance_km),
            priceTier: row.mechanics.price_tier,
            estimatedLabourRate: Number(row.mechanics.estimated_labour_rate),
            availability: row.mechanics.availability,
            location: row.mechanics.location,
            address: row.mechanics.address,
            phone: row.mechanics.phone,
            verified: row.mechanics.verified,
            experienceYears: row.mechanics.experience_years,
            image: row.mechanics.image,
          }
        : ({} as any),
      aiDiagnosis: row.ai_diagnosis,
      aiEstimatedCost: row.ai_estimated_cost,
      mechanicDiagnosis: row.mechanic_diagnosis,
      partsReplaced: row.parts_replaced || [],
      partsCost: Number(row.parts_cost),
      labourCost: Number(row.labour_cost),
      taxes: Number(row.taxes),
      finalBill: Number(row.final_bill),
      isWithinEstimate: row.is_within_estimate,
      completionDate: row.completion_date,
      mechanicNotes: row.mechanic_notes,
      invoiceNumber: row.invoice_number,
    }));
  } catch (e) {
    console.warn('Supabase fetchServiceReports error:', e);
    return null;
  }
};

export const apiInsertServiceReport = async (rep: ServiceReport): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('service_reports').insert([
      {
        id: rep.id,
        service_request_id: rep.serviceRequestId || null,
        service_id_display: rep.serviceIdDisplay,
        vehicle_id: rep.vehicle.id,
        mechanic_id: rep.mechanic.id,
        ai_diagnosis: rep.aiDiagnosis,
        ai_estimated_cost: rep.aiEstimatedCost,
        mechanic_diagnosis: rep.mechanicDiagnosis,
        parts_replaced: rep.partsReplaced,
        parts_cost: rep.partsCost,
        labour_cost: rep.labourCost,
        taxes: rep.taxes,
        final_bill: rep.finalBill,
        is_within_estimate: rep.isWithinEstimate,
        completion_date: rep.completionDate,
        mechanic_notes: rep.mechanicNotes,
        invoice_number: rep.invoiceNumber,
      },
    ]);
    if (error) throw error;
    return true;
  } catch (e) {
    console.warn('Supabase insertServiceReport error:', e);
    return false;
  }
};

// ==============================================================================
// 6. MAINTENANCE PREDICTIONS
// ==============================================================================

export const apiFetchMaintenancePredictions = async (
  vehicleId?: string
): Promise<MaintenancePrediction[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    let query = supabase.from('maintenance_predictions').select('*');
    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    return data.map((row) => ({
      id: row.id,
      vehicleId: row.vehicle_id,
      component: row.component,
      category: row.category,
      currentHealthPct: row.current_health_pct,
      dueInKm: row.due_in_km,
      dueInDays: row.due_in_days,
      priority: row.priority,
      aiInsight: row.ai_insight,
      lastReplacedDate: row.last_replaced_date,
      recommendedService: row.recommended_service,
    }));
  } catch (e) {
    console.warn('Supabase fetchMaintenancePredictions error:', e);
    return null;
  }
};

// ==============================================================================
// 7. USER PROFILE
// ==============================================================================

export const apiFetchUserProfile = async (): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'user-1')
      .single();

    if (error || !data) return null;

    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      avatar: data.avatar,
      memberSince: data.member_since,
    };
  } catch (e) {
    console.warn('Supabase fetchUserProfile error:', e);
    return null;
  }
};
