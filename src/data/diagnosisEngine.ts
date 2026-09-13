import { DiagnosisRequest, AIDiagnosisResult, Vehicle } from '../types';

export function runAIDiagnosis(
  request: DiagnosisRequest,
  vehicle: Vehicle
): AIDiagnosisResult {
  const query = request.problemDescription.toLowerCase();
  const warningLights = request.warningLights.join(' ').toLowerCase();

  // 1. Primary Showcase Case: Clicking sound / starter / battery issue
  if (
    query.includes('click') ||
    query.includes('start') ||
    query.includes('crank') ||
    query.includes('battery') ||
    warningLights.includes('battery') ||
    request.recordedAudio?.audioPattern.toLowerCase().includes('clicking')
  ) {
    return {
      id: `diag-${Date.now()}`,
      vehicleId: vehicle.id,
      symptomSummary: request.problemDescription,
      probableIssue: 'Battery / Starter System Issue',
      confidence: 82,
      rankedCauses: [
        {
          title: 'Weak battery',
          confidence: 82,
          severity: 'medium',
          description: 'Terminal voltage dropping below 10.2V under starter draw due to degraded internal plates.',
        },
        {
          title: 'Starter motor issue',
          confidence: 61,
          severity: 'high',
          description: 'Worn starter carbon brushes or armature winding resistance preventing adequate torque delivery.',
        },
        {
          title: 'Loose electrical connection',
          confidence: 43,
          severity: 'low',
          description: 'Oxidized battery terminal clamp or loose grounding wire creating high contact resistance.',
        },
        {
          title: 'Starter relay problem',
          confidence: 31,
          severity: 'low',
          description: 'Pitted internal contact points causing relay chatter without transferring high-current pulse.',
        },
      ],
      xaiReasoning:
        'The clicking sound during startup combined with difficulty starting the engine commonly indicates insufficient battery power or a starter-system issue. When the starter button is pressed, the starter relay energizes and closes its internal solenoid contacts; however, because the battery lacks sufficient cold cranking amperage (CCA), the voltage drops instantaneously, causing the solenoid to release and rapidly click in an oscillating cycle.',
      symptomsDetected: [
        'Clicking sound during ignition',
        'Starting difficulty / no crank rotation',
        'No engine ignition',
        request.warningLights.length > 0 ? `Active cluster warnings: ${request.warningLights.join(', ')}` : 'Voltage drop during ignition draw',
      ],
      evidenceUsed: [
        'User description matching high-frequency starter solenoid chattering',
        `Vehicle specification: ${vehicle.make} ${vehicle.model} (${vehicle.year}, ${vehicle.engineType})`,
        request.recordedAudio ? `Audio signature analysis: ${request.recordedAudio.audioPattern} (${request.recordedAudio.detectedFrequency})` : 'Acoustic waveform analysis of rapid relay engagement',
        request.uploadedImage ? `Visual inspection artifact: ${request.uploadedImage.name}` : 'Telemetry: 22 months elapsed since original factory battery installation',
      ],
      recommendedAction: 'Check battery voltage and starter connections first.',
      possibleRepair: 'Battery inspection / replacement (OEM 12V 5Ah VRLA) and terminal terminal lug cleaning.',
      urgency: 'Medium',
      canIDrive: {
        safe: false,
        advice: 'Drive only if the vehicle starts normally and no additional warning signs are present. If jump-started, proceed immediately to the nearest workshop without switching off the engine.',
      },
      disclaimer: 'AI recommendations are for decision support and do not replace professional mechanical inspection.',
      costEstimate: {
        partsMin: 2500,
        partsMax: 4000,
        labourMin: 500,
        labourMax: 1000,
        totalMin: 3000,
        totalMax: 5000,
        localMarketRange: {
          min: 3200,
          max: 5400,
        },
        partsBreakdown: [
          { partName: 'OEM Sealed VRLA Battery (12V 5Ah / 48M Warranty)', estimatedCost: 2850, isRequired: true },
          { partName: 'Starter Solenoid Relay Unit', estimatedCost: 450, isRequired: false },
          { partName: 'Anti-Corrosion Terminal Treatment Kit', estimatedCost: 180, isRequired: true },
        ],
      },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // 2. Brake Squeal / Friction Wear Case
  if (
    query.includes('brake') ||
    query.includes('squeak') ||
    query.includes('grind') ||
    query.includes('stopping') ||
    warningLights.includes('abs')
  ) {
    return {
      id: `diag-${Date.now()}`,
      vehicleId: vehicle.id,
      symptomSummary: request.problemDescription,
      probableIssue: 'Front Brake Pad Wear & Rotor Glazing',
      confidence: 86,
      rankedCauses: [
        {
          title: 'Worn brake pad friction layer',
          confidence: 86,
          severity: 'high',
          description: 'Wear indicator contacting rotor disc or pad compound worn down past 2mm threshold.',
        },
        {
          title: 'Brake rotor heat glazing / warping',
          confidence: 58,
          severity: 'medium',
          description: 'Glazed surface crystallization causing low-friction high-frequency resonance.',
        },
        {
          title: 'Contaminated caliper guide pins',
          confidence: 42,
          severity: 'low',
          description: 'Sticking caliper slider causing uneven dragging against the disc.',
        },
      ],
      xaiReasoning:
        'The high-frequency squealing noise occurring during brake lever compression directly correlates with the ceramic/semi-metallic friction material wearing down to the built-in acoustic wear clip. Friction coefficient telemetry indicates uneven braking pressure and impending steel-on-steel rotor score damage.',
      symptomsDetected: [
        'High-pitched acoustic squeal under lever pressure',
        'Spongy lever feedback / increased travel',
        'Reduced braking bite at moderate speeds',
      ],
      evidenceUsed: [
        'Acoustic resonance signature in the 2.4 - 3.8 kHz friction band',
        `Vehicle mileage: ${vehicle.mileage.toLocaleString()} km without recorded front pad renewal`,
        'User description of braking vibration and noise',
      ],
      recommendedAction: 'Inspect brake pad friction depth immediately and check rotor runout with a dial gauge.',
      possibleRepair: 'Front disc brake pad replacement & caliper guide pin lubrication.',
      urgency: 'High',
      canIDrive: {
        safe: false,
        advice: 'Avoid high-speed driving or downhill riding. Braking distance is compromised by up to 35%. Proceed to the workshop with caution.',
      },
      disclaimer: 'AI recommendations are for decision support and do not replace professional mechanical inspection.',
      costEstimate: {
        partsMin: 1200,
        partsMax: 2200,
        labourMin: 400,
        labourMax: 700,
        totalMin: 1600,
        totalMax: 2900,
        localMarketRange: {
          min: 1700,
          max: 3200,
        },
        partsBreakdown: [
          { partName: 'OEM Sintered Brake Pad Set (Front)', estimatedCost: 1450, isRequired: true },
          { partName: 'Brake Rotor Cleaner & DOT 4 Fluid Flush', estimatedCost: 350, isRequired: true },
        ],
      },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // 3. Engine Overheating / Cooling Case
  if (
    query.includes('heat') ||
    query.includes('overheat') ||
    query.includes('coolant') ||
    query.includes('radiator') ||
    query.includes('smoke') ||
    warningLights.includes('engine')
  ) {
    return {
      id: `diag-${Date.now()}`,
      vehicleId: vehicle.id,
      symptomSummary: request.problemDescription,
      probableIssue: 'Cooling System Circulation & Thermostat Failure',
      confidence: 84,
      rankedCauses: [
        {
          title: 'Thermostat valve stuck closed',
          confidence: 84,
          severity: 'critical',
          description: 'Coolant prevented from cycling into radiator fins, concentrating heat in cylinder head.',
        },
        {
          title: 'Radiator fan motor failure or blown fuse',
          confidence: 65,
          severity: 'high',
          description: 'No forced airflow during standstill or low-speed stop-and-go traffic.',
        },
        {
          title: 'Coolant reservoir low / system leak',
          confidence: 49,
          severity: 'medium',
          description: 'Vapour lock or micro-fracture in radiator hose releasing system pressure.',
        },
      ],
      xaiReasoning:
        'Elevated engine temperatures during idle or city traffic indicate that heat dissipation via forced convective airflow has failed. The ECU triggers radiator fan activation at 98°C, but lack of temperature abatement suggests circulation impediment (stuck thermostat or air cavitation).',
      symptomsDetected: [
        'Temperature gauge needle in upper red quartile',
        'Excessive radiant heat near rider footpegs',
        'Sweet coolant smell / steam release near radiator cap',
      ],
      evidenceUsed: [
        'Vehicle thermal telemetry and symptom timing report',
        `Engine architecture: ${vehicle.engineType}`,
        'Symptom exacerbation under stop-and-go conditions',
      ],
      recommendedAction: 'Shut down engine immediately. Allow 45 minutes of cooling before opening radiator cap.',
      possibleRepair: 'Thermostat replacement, radiator cooling fan relay test, and ethylene glycol flush.',
      urgency: 'Critical',
      canIDrive: {
        safe: false,
        advice: 'Do NOT drive. Running an overheating engine risks catastrophic cylinder head warping, blown head gasket, and engine seizure.',
      },
      disclaimer: 'AI recommendations are for decision support and do not replace professional mechanical inspection.',
      costEstimate: {
        partsMin: 2200,
        partsMax: 4500,
        labourMin: 800,
        labourMax: 1400,
        totalMin: 3000,
        totalMax: 5900,
        localMarketRange: {
          min: 3400,
          max: 6500,
        },
        partsBreakdown: [
          { partName: 'OEM Thermostat Assembly with O-Ring', estimatedCost: 1650, isRequired: true },
          { partName: 'Premix Organic Acid Coolant (1.5L)', estimatedCost: 650, isRequired: true },
          { partName: 'Radiator Fan Thermal Sensor Switch', estimatedCost: 950, isRequired: false },
        ],
      },
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // 4. Default Intelligent Fallback Diagnosis
  return {
    id: `diag-${Date.now()}`,
    vehicleId: vehicle.id,
    symptomSummary: request.problemDescription,
    probableIssue: 'Fuel-Air Metering & Ignition System Anomaly',
    confidence: 76,
    rankedCauses: [
      {
        title: 'Clogged air intake / throttle body carbon deposits',
        confidence: 76,
        severity: 'medium',
        description: 'Impaired airflow disrupting the stoichiometric air-fuel mixture (14.7:1).',
      },
      {
        title: 'Fouled spark plug electrode',
        confidence: 62,
        severity: 'medium',
        description: 'Carbon fouling causing weak ignition arc and intermittent combustion misfire.',
      },
      {
        title: 'Fuel injector nozzle varnish buildup',
        confidence: 45,
        severity: 'low',
        description: 'Poor fuel atomization spray pattern reducing combustion efficiency.',
      },
    ],
    xaiReasoning:
      'Based on the reported symptoms and vehicle telemetry, the engine management system is experiencing inconsistent fuel-air combustion. The symptoms match erratic intake sensor readings and delayed throttle body response, creating hesitation under load.',
    symptomsDetected: [
      'Hesitation during throttle roll-on',
      'Irregular engine RPM at idle',
      'Fuel combustion efficiency degradation',
    ],
    evidenceUsed: [
      'Natural language symptom analysis matching ignition/intake disruption',
      `Vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.mileage.toLocaleString()} km)`,
      'Reported symptom frequency and operating conditions',
    ],
    recommendedAction: 'Perform throttle body ultrasonic cleaning, inspect spark plug gap, and check intake manifold seal.',
    possibleRepair: 'Throttle body servicing, spark plug renewal, and air filter replacement.',
    urgency: 'Medium',
    canIDrive: {
      safe: true,
      advice: 'You may drive short distances at moderate speeds. Avoid aggressive acceleration until serviced.',
    },
    disclaimer: 'AI recommendations are for decision support and do not replace professional mechanical inspection.',
    costEstimate: {
      partsMin: 1500,
      partsMax: 2800,
      labourMin: 600,
      labourMax: 1100,
      totalMin: 2100,
      totalMax: 3900,
      localMarketRange: {
        min: 2400,
        max: 4200,
      },
      partsBreakdown: [
        { partName: 'OEM Spark Plug (Iridium/Resistor)', estimatedCost: 450, isRequired: true },
        { partName: 'High-Flow OEM Air Filter', estimatedCost: 650, isRequired: true },
        { partName: 'Intake Manifold Gasket & Throttle Cleaner', estimatedCost: 400, isRequired: true },
      ],
    },
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
