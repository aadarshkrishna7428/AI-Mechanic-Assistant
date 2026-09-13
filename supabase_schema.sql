-- ==============================================================================
-- AI Mechanic Assistant - Supabase Complete Database Schema & Seed Script
-- Project: https://mqibouktqoqaiszjfvhw.supabase.co
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- Table 1: Profiles (Garage Owner / User)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  city TEXT,
  avatar TEXT,
  member_since TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 2: Vehicles (Bikes & Cars in digital garage)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
  mileage INTEGER NOT NULL DEFAULT 0,
  plate_number TEXT NOT NULL,
  engine_type TEXT,
  last_service_date TEXT,
  next_service_km INTEGER DEFAULT 3000,
  image TEXT,
  type TEXT NOT NULL CHECK (type IN ('Bike', 'Car')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 3: Mechanics (Certified workshops network)
CREATE TABLE IF NOT EXISTS public.mechanics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  workshop TEXT NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.5,
  total_reviews INTEGER DEFAULT 0,
  specialized_brands JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  distance_km NUMERIC(4, 1) DEFAULT 2.0,
  price_tier TEXT CHECK (price_tier IN ('Budget', 'Standard', 'Premium')),
  estimated_labour_rate NUMERIC(10, 2) DEFAULT 500,
  availability TEXT,
  location TEXT,
  address TEXT,
  phone TEXT,
  verified BOOLEAN DEFAULT true,
  experience_years INTEGER DEFAULT 5,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 4: Diagnoses (Multimodal AI Diagnostic results)
CREATE TABLE IF NOT EXISTS public.diagnoses (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  symptom_summary TEXT NOT NULL,
  probable_issue TEXT NOT NULL,
  confidence NUMERIC(5, 2) NOT NULL,
  ranked_causes JSONB DEFAULT '[]'::jsonb,
  xai_reasoning TEXT,
  symptoms_detected JSONB DEFAULT '[]'::jsonb,
  evidence_used JSONB DEFAULT '[]'::jsonb,
  evidence_type TEXT CHECK (evidence_type IN ('text', 'image', 'audio', 'multimodal')),
  uploaded_image JSONB,
  recorded_audio JSONB,
  recommended_action TEXT,
  possible_repair TEXT,
  urgency TEXT CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
  can_i_drive JSONB,
  disclaimer TEXT,
  cost_estimate JSONB,
  problem_description TEXT,
  onset TEXT,
  frequency TEXT,
  mileage_at_diagnosis INTEGER,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 5: Service Requests (Active workshop repair tracking & stages)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  diagnosis_id TEXT REFERENCES public.diagnoses(id) ON DELETE SET NULL,
  mechanic_id TEXT REFERENCES public.mechanics(id) ON DELETE SET NULL,
  problem_title TEXT NOT NULL,
  ai_diagnosis TEXT,
  ai_estimated_cost JSONB,
  current_stage_index INTEGER DEFAULT 0,
  stages JSONB DEFAULT '[]'::jsonb,
  estimated_completion TEXT,
  service_type TEXT CHECK (service_type IN ('Shop Visit', 'Doorstep Pickup')),
  actual_bill JSONB,
  customer_notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 6: Service Reports (Completed history & certified invoices)
CREATE TABLE IF NOT EXISTS public.service_reports (
  id TEXT PRIMARY KEY,
  service_request_id TEXT, -- Logical reference to service request (unconstrained to support historical logs & external invoices)
  service_id_display TEXT NOT NULL,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  mechanic_id TEXT REFERENCES public.mechanics(id) ON DELETE SET NULL,
  ai_diagnosis TEXT,
  ai_estimated_cost JSONB,
  mechanic_diagnosis TEXT,
  parts_replaced JSONB DEFAULT '[]'::jsonb,
  parts_cost NUMERIC(10, 2) DEFAULT 0,
  labour_cost NUMERIC(10, 2) DEFAULT 0,
  taxes NUMERIC(10, 2) DEFAULT 0,
  final_bill NUMERIC(10, 2) NOT NULL,
  is_within_estimate BOOLEAN DEFAULT true,
  completion_date TEXT,
  mechanic_notes TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Drop any existing FK constraint on service_request_id if the table was created previously
ALTER TABLE public.service_reports DROP CONSTRAINT IF EXISTS service_reports_service_request_id_fkey;


-- Table 7: Maintenance Predictions (Wear degradation telemetry)
CREATE TABLE IF NOT EXISTS public.maintenance_predictions (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  category TEXT CHECK (category IN ('Fluids', 'Braking', 'Drivetrain', 'Electrical', 'Engine', 'Tyres')),
  current_health_pct INTEGER CHECK (current_health_pct BETWEEN 0 AND 100),
  due_in_km INTEGER,
  due_in_days INTEGER,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  ai_insight TEXT,
  last_replaced_date TEXT,
  recommended_service TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 8: Chat Messages (AI Mechanic Conversational Logs)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT REFERENCES public.vehicles(id) ON DELETE SET NULL,
  sender TEXT CHECK (sender IN ('user', 'assistant')),
  text TEXT NOT NULL,
  suggestions JSONB DEFAULT '[]'::jsonb,
  highlight_category TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table 9: Evidence Samples (Audio waveform & image inspection library)
CREATE TABLE IF NOT EXISTS public.evidence_samples (
  id TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('audio', 'image')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  url TEXT,
  detection_label TEXT,
  confidence_pct NUMERIC(5, 2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_vehicle_id ON public.diagnoses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_vehicle_id ON public.service_requests(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_mechanic_id ON public.service_requests(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_service_reports_vehicle_id ON public.service_reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_predictions_vehicle_id ON public.maintenance_predictions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_vehicle_id ON public.chat_messages(vehicle_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive policies for anon & authenticated roles to enable seamless client access
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_samples ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
  CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

  -- Vehicles policies
  DROP POLICY IF EXISTS "Allow all access to vehicles" ON public.vehicles;
  CREATE POLICY "Allow all access to vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

  -- Mechanics policies
  DROP POLICY IF EXISTS "Allow all access to mechanics" ON public.mechanics;
  CREATE POLICY "Allow all access to mechanics" ON public.mechanics FOR ALL USING (true) WITH CHECK (true);

  -- Diagnoses policies
  DROP POLICY IF EXISTS "Allow all access to diagnoses" ON public.diagnoses;
  CREATE POLICY "Allow all access to diagnoses" ON public.diagnoses FOR ALL USING (true) WITH CHECK (true);

  -- Service Requests policies
  DROP POLICY IF EXISTS "Allow all access to service_requests" ON public.service_requests;
  CREATE POLICY "Allow all access to service_requests" ON public.service_requests FOR ALL USING (true) WITH CHECK (true);

  -- Service Reports policies
  DROP POLICY IF EXISTS "Allow all access to service_reports" ON public.service_reports;
  CREATE POLICY "Allow all access to service_reports" ON public.service_reports FOR ALL USING (true) WITH CHECK (true);

  -- Maintenance Predictions policies
  DROP POLICY IF EXISTS "Allow all access to maintenance_predictions" ON public.maintenance_predictions;
  CREATE POLICY "Allow all access to maintenance_predictions" ON public.maintenance_predictions FOR ALL USING (true) WITH CHECK (true);

  -- Chat Messages policies
  DROP POLICY IF EXISTS "Allow all access to chat_messages" ON public.chat_messages;
  CREATE POLICY "Allow all access to chat_messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

  -- Evidence Samples policies
  DROP POLICY IF EXISTS "Allow all access to evidence_samples" ON public.evidence_samples;
  CREATE POLICY "Allow all access to evidence_samples" ON public.evidence_samples FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ==============================================================================
-- 5. SEED INITIAL DATA (Matching App Dataset)
-- ==============================================================================

-- 5.1 Insert User Profile
INSERT INTO public.profiles (id, name, email, phone, city, avatar, member_since)
VALUES (
  'user-1',
  'Aadarsh Krishna',
  'aadarsh.k@mechanicai.tech',
  '+91 98450 21980',
  'Bengaluru, Karnataka',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'March 2024'
) ON CONFLICT (id) DO NOTHING;

-- 5.2 Insert Vehicles
INSERT INTO public.vehicles (id, user_id, make, model, year, fuel_type, mileage, plate_number, engine_type, last_service_date, next_service_km, image, type)
VALUES
(
  'veh-1', 'user-1', 'Yamaha', 'MT-15 V2', 2023, 'Petrol', 18450, 'KA 03 HY 8492',
  '155cc Liquid-cooled 4V SOHC', '2 months ago', 1500,
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80', 'Bike'
),
(
  'veh-2', 'user-1', 'Royal Enfield', 'Classic 350', 2022, 'Petrol', 24100, 'KA 05 ER 3109',
  '349cc Single Cylinder Air-Oil cooled', '4 months ago', 900,
  'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80', 'Bike'
),
(
  'veh-3', 'user-1', 'Honda', 'Activa 6G', 2021, 'Petrol', 12300, 'KA 01 MQ 1142',
  '109.5cc Fan Cooled 4-Stroke SI', '5 months ago', 2700,
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80', 'Bike'
),
(
  'veh-4', 'user-1', 'Tata', 'Nexon EV Empowered', 2023, 'Electric', 28400, 'KA 04 NJ 9021',
  'Permanent Magnet Synchronous Motor (40.5 kWh)', '3 months ago', 6600,
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80', 'Car'
),
(
  'veh-5', 'user-1', 'Hyundai', 'i20 Asta (O)', 2022, 'Petrol', 21500, 'KA 51 MB 6720',
  '1.2L Kappa Dual VTVT Petrol', '6 months ago', 3500,
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80', 'Car'
) ON CONFLICT (id) DO NOTHING;

-- 5.3 Insert Mechanics Network
INSERT INTO public.mechanics (id, name, workshop, rating, total_reviews, specialized_brands, services, distance_km, price_tier, estimated_labour_rate, availability, location, address, phone, verified, experience_years, image)
VALUES
(
  'mech-1', 'Raj Auto Care', 'Raj Automotive & Performance Hub', 4.8, 342,
  '["Yamaha", "Honda", "TVS", "KTM"]'::jsonb,
  '["Engine Diagnostics", "Electrical & Starter", "General Service", "Brake Systems"]'::jsonb,
  1.8, 'Standard', 650, 'Available Today (Express Slots Open)', 'Indiranagar 100ft Road, Bengaluru',
  'Plot #42, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru - 560038', '+91 98442 81102', true, 12,
  'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=400&auto=format&fit=crop&q=80'
),
(
  'mech-2', 'Apex Moto Tech', 'Apex Superbike & Precision Workshop', 4.9, 528,
  '["Yamaha", "Kawasaki", "Royal Enfield", "KTM"]'::jsonb,
  '["ECU Tuning", "Electrical Systems", "Engine Overhaul", "Track Preparation"]'::jsonb,
  3.4, 'Premium', 850, 'Next slot tomorrow at 10:00 AM', 'Koramangala 4th Block, Bengaluru',
  '88, 80 Feet Road, Near Maharaja Signal, Koramangala 4th Block, Bengaluru - 560034', '+91 99001 77319', true, 16,
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=80'
),
(
  'mech-3', 'QuickFix Multi-Brand Garage', 'QuickFix Auto Care Solutions', 4.6, 284,
  '["Honda", "Yamaha", "Bajaj", "Hero", "TVS"]'::jsonb,
  '["Battery Replacement", "Brake Servicing", "Oil & Filter", "Quick Inspection"]'::jsonb,
  2.1, 'Budget', 500, 'Available in 30 mins', 'HSR Layout Sector 2, Bengaluru',
  '14, 27th Main Road, Sector 2, HSR Layout, Bengaluru - 560102', '+91 97312 90455', true, 9,
  'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80'
),
(
  'mech-4', 'SpeedWheel Automotive', 'SpeedWheel Electrical & Mechanical Studio', 4.7, 310,
  '["Tata", "Hyundai", "Honda", "Yamaha", "Suzuki"]'::jsonb,
  '["Sensors & Wiring", "Starter & Alternator", "Air Conditioning", "Suspension"]'::jsonb,
  4.0, 'Standard', 700, 'Available Today', 'BTM Layout 2nd Stage, Bengaluru',
  '56, Outer Ring Road, Near Silk Board, BTM 2nd Stage, Bengaluru - 560076', '+91 94480 34189', true, 14,
  'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&auto=format&fit=crop&q=80'
),
(
  'mech-5', 'Precision Motor Works', 'Precision 4W & 2W Tech Center', 4.8, 418,
  '["Tata", "Hyundai", "Mahindra", "Volkswagen", "Toyota"]'::jsonb,
  '["Advanced Computer Diagnostics", "Transmission", "Engine Rebuild", "Brake Systems"]'::jsonb,
  5.2, 'Premium', 900, 'Slots available from 2:00 PM', 'Whitefield ITPL Main Road, Bengaluru',
  'Survey 22, Opp. Prestige Shantiniketan, Whitefield, Bengaluru - 560066', '+91 98860 12555', true, 18,
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80'
) ON CONFLICT (id) DO NOTHING;

-- 5.4 Insert Predictive Maintenance Items
INSERT INTO public.maintenance_predictions (id, vehicle_id, component, category, current_health_pct, due_in_km, due_in_days, priority, ai_insight, last_replaced_date, recommended_service)
VALUES
(
  'maint-1', 'veh-1', 'Engine Oil & Filter', 'Fluids', 32, 850, 18, 'Medium',
  'Viscosity breakdown estimated based on 4,150 km since last flush and high average operating temperatures (Yamaha MT-15 10W-40 Synthetic).',
  NULL, 'Full synthetic oil drain and OEM paper oil filter replacement'
),
(
  'maint-2', 'veh-1', 'Front Brake Pads', 'Braking', 24, 1200, 25, 'High',
  'Acoustic inspection and deceleration telemetry suggest friction lining thickness is approaching 2.1mm limit.',
  NULL, 'Brake caliper cleaning, fluid bleed (DOT 4), and Bybre sintered pad replacement'
),
(
  'maint-3', 'veh-1', 'Drive Chain Slack & Lube', 'Drivetrain', 18, 500, 9, 'Medium',
  'Based on mileage and monsoonal driving patterns, chain slack is estimated at 34mm (recommended: 20-25mm). High risk of sprocket tooth wear.',
  NULL, 'O-ring chain degrease, tension adjustment, and Motul chain paste application'
),
(
  'maint-4', 'veh-1', 'Spark Plug (NGK MR8E9)', 'Engine', 62, 3500, 75, 'Low',
  'Electrode gap remaining within nominal 0.8mm clearance. No misfire codes logged.',
  NULL, 'Inspect electrode during 20,000 km periodic overhaul'
),
(
  'maint-5', 'veh-1', 'Radiator Coolant Flush', 'Fluids', 70, 5200, 110, 'Low',
  'Coolant boiling point and pH within optimal green range.',
  NULL, 'Scheduled top-up during major annual service'
) ON CONFLICT (id) DO NOTHING;

-- 5.5 Insert Initial Service Requests (Active Live Tracking + Past Completed)
INSERT INTO public.service_requests (
  id, vehicle_id, diagnosis_id, mechanic_id, problem_title, ai_diagnosis,
  ai_estimated_cost, current_stage_index, stages, estimated_completion,
  service_type, actual_bill, status
)
VALUES
(
  'SRV-8942', 'veh-1', NULL, 'mech-1',
  'Engine Starting Issue & Rapid Clicking Sound',
  'Battery / Starter System Issue (82% Confidence)',
  '{"min": 3000, "max": 5000}'::jsonb,
  3,
  '[
    {"id": "stg-1", "title": "Service Requested", "timestamp": "Today, 10:15 AM", "status": "completed", "technicianNote": "Online request submitted with AI Multimodal Diagnosis attachment (Report #SRV-8942)."},
    {"id": "stg-2", "title": "Vehicle Received", "timestamp": "Today, 11:30 AM", "status": "completed", "technicianNote": "Vehicle checked in at Raj Auto Care. MT-15 odometer verified at 18,450 km."},
    {"id": "stg-3", "title": "Diagnosis Confirmed", "timestamp": "Today, 12:45 PM", "status": "completed", "technicianNote": "Confirmed with digital load tester: OEM 12V 5Ah battery cell 3 degraded (dropped to 9.8V under cranking load). Starter relay is intact."},
    {"id": "stg-4", "title": "Repair in Progress", "timestamp": "Today, 02:15 PM", "status": "current", "technicianNote": "Installing new OEM Exide Xplore 12V 5Ah VRLA battery, cleaned positive/negative copper lugs, applying dielectric grease."},
    {"id": "stg-5", "title": "Quality Check", "status": "pending", "technicianNote": "Will conduct 5 consecutive cold crank starts, alternator charging rate verification (>14.2V at 4000 RPM), and electrical leakage test."},
    {"id": "stg-6", "title": "Ready for Pickup", "status": "pending", "technicianNote": "Final wash, billing verification, and keys handover at the reception desk."}
  ]'::jsonb,
  'Today, 5:30 PM', 'Shop Visit',
  '{
    "mechanicDiagnosis": "Severely degraded battery cell with low cranking amp (CCA < 45A). Starter relay and motor undamaged.",
    "partsReplaced": ["Exide Xplore 12V 5Ah Maintenance-Free Battery (48M Warranty)", "Corrosion Inhibitor Terminal Washer Kit"],
    "partsCost": 3200,
    "labourCost": 700,
    "total": 3900
  }'::jsonb,
  'active'
),
(
  'SRV-8812', 'veh-1', NULL, 'mech-2',
  'Drive Chain Slack & Sprocket Teeth Wear',
  'Drive Chain Slack & Sprocket Teeth Wear (79% Confidence)',
  '{"min": 2400, "max": 3500}'::jsonb,
  5,
  '[]'::jsonb,
  'Completed', 'Shop Visit',
  '{
    "mechanicDiagnosis": "Excessive chain stretch (114 link slack) and front drive sprocket hooked teeth.",
    "partsReplaced": ["Rolon Brass-Coated Drive Chain & Sprocket Set", "Chain Slider Guard"],
    "partsCost": 2150,
    "labourCost": 600,
    "total": 2750
  }'::jsonb,
  'completed'
),
(
  'SRV-8540', 'veh-1', NULL, 'mech-1',
  'Front Brake Judder & Pad Glaze',
  'Front Brake Judder & Pad Glaze (84% Confidence)',
  '{"min": 1200, "max": 1800}'::jsonb,
  5,
  '[]'::jsonb,
  'Completed', 'Shop Visit',
  '{
    "mechanicDiagnosis": "Pad friction layer contaminated with road tar; caliper slide pins seized due to dry grease.",
    "partsReplaced": ["Brembo / Bybre Ceramic Front Disc Brake Pads", "High-Temp Caliper Pin Grease"],
    "partsCost": 950,
    "labourCost": 450,
    "total": 1400
  }'::jsonb,
  'completed'
),
(
  'SRV-8104', 'veh-1', NULL, 'mech-3',
  '15,000 km Scheduled Overhaul & Valve Clearance Check',
  '15,000 km Scheduled Overhaul & Valve Clearance Check',
  '{"min": 2200, "max": 3000}'::jsonb,
  5,
  '[]'::jsonb,
  'Completed', 'Shop Visit',
  '{
    "mechanicDiagnosis": "Routine periodic maintenance. Spark plug cleaned, air filter replaced, Motul 7100 synthetic oil filled.",
    "partsReplaced": ["Motul 7100 10W-40 Synthetic Engine Oil (1L)", "OEM Yamaha Foam Air Filter", "Engine Drain Washer"],
    "partsCost": 1750,
    "labourCost": 750,
    "total": 2500
  }'::jsonb,
  'completed'
)
ON CONFLICT (id) DO NOTHING;


-- 5.6 Insert Service Reports (Past History & Invoices)
INSERT INTO public.service_reports (
  id, service_request_id, service_id_display, vehicle_id, mechanic_id,
  ai_diagnosis, ai_estimated_cost, mechanic_diagnosis, parts_replaced,
  parts_cost, labour_cost, taxes, final_bill, is_within_estimate,
  completion_date, mechanic_notes, invoice_number
)
VALUES
(
  'rep-8812', 'SRV-8812', 'SRV-8812', 'veh-1', 'mech-2',
  'Drive Chain Slack & Sprocket Teeth Wear (79% Confidence)', '{"min": 2400, "max": 3500}'::jsonb,
  'Excessive chain stretch (114 link slack) and front drive sprocket hooked teeth.',
  '["Rolon Brass-Coated Drive Chain & Sprocket Set", "Chain Slider Guard"]'::jsonb,
  2150, 600, 0, 2750, true, '18 Jan 2026',
  'Cleaned swingarm pivot, torqued rear axle nut to 105 Nm. Advised chain lubrication every 500 km.',
  'INV-APX-4921'
),
(
  'rep-8540', 'SRV-8540', 'SRV-8540', 'veh-1', 'mech-1',
  'Front Brake Judder & Pad Glaze (84% Confidence)', '{"min": 1200, "max": 1800}'::jsonb,
  'Pad friction layer contaminated with road tar; caliper slide pins seized due to dry grease.',
  '["Brembo / Bybre Ceramic Front Disc Brake Pads", "High-Temp Caliper Pin Grease"]'::jsonb,
  950, 450, 0, 1400, true, '05 Nov 2025',
  'Cleaned disc rotor with isopropyl alcohol. Bedded in new brake pads over 10 test stops.',
  'INV-RAJ-2109'
),
(
  'rep-8104', 'SRV-8104', 'SRV-8104', 'veh-1', 'mech-3',
  '15,000 km Scheduled Overhaul & Valve Clearance Check', '{"min": 2200, "max": 3000}'::jsonb,
  'Routine periodic maintenance. Spark plug cleaned, air filter replaced, Motul 7100 synthetic oil filled.',
  '["Motul 7100 10W-40 Synthetic Engine Oil (1L)", "OEM Yamaha Foam Air Filter", "Engine Drain Washer"]'::jsonb,
  1750, 750, 0, 2500, true, '14 Aug 2025',
  'Valve clearances within 0.10mm intake and 0.20mm exhaust. Throttle body cleaned.',
  'INV-QFX-9411'
) ON CONFLICT (id) DO NOTHING;
