
export interface PNInputs {
  dol: number; // Day of life
  weight: number; // Current weight (kg)
  birthWeight: number; // Birth weight (g) for ladder matching
  totalLiquidTarget: number; // ml/kg
  gir: number; // mg/kg/min
  aaTarget: number; // g/kg
  fatTarget: number; // g/kg
  naTarget: number; // mmol/kg
  kTarget: number; // mmol/kg
  subtractionFluid: number; // ml
}

export interface PNResults {
  totalLiquid: number;
  flowRate: number;
  glucoseConcentration: number;
  gs10: number;
  gs50: number;
  aaVol: number;
  fatVol: number;
  naVol: number;
  kVol: number;
  totalCalories: number;
  osmolarity: number;
  calorieRatios: {
    carb: number;
    protein: number;
    fat: number;
  };
  cnRatio: number; // Calorie to Nitrogen Ratio (NPC:N)
  npcLipidRatio: number; // Lipid energy as % of Non-Protein Calories
}

export interface AdvancedPNInputs extends PNInputs {
  milkVolume: number; // ml
  milkType: 'standard' | 'preterm68' | 'preterm81';
  additionalSubtraction: {
    label: string;
    value: number;
  }[];
}
