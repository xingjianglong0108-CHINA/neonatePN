
import { PNInputs, PNResults } from '../types';
import { CONCENTRATIONS, CALORIES } from '../constants';

export const calculatePN = (inputs: PNInputs): PNResults => {
  const { weight, totalLiquidTarget, gir, aaTarget, fatTarget, naTarget, kTarget, subtractionFluid } = inputs;

  const totalDailyLiquid = totalLiquidTarget * weight;
  const pnLiquid = Math.max(0, totalDailyLiquid - subtractionFluid);
  const flowRate = pnLiquid / 24;

  const aaVol = (aaTarget * weight) / CONCENTRATIONS.AA_6_PERCENT;
  const fatVol = (fatTarget * weight) / CONCENTRATIONS.FAT_20_PERCENT;
  const naVol = (naTarget * weight) / CONCENTRATIONS.NACL_10_PERCENT;
  const kVol = (kTarget * weight) / CONCENTRATIONS.KCL_10_PERCENT;

  // Glucose calculation
  // Total glucose required in grams per day
  const totalGlucoseGrams = gir * weight * 1.44; // 1 mg/kg/min = 1.44 g/kg/day

  // Volume left for Glucose solutions
  const electrolyteAndOtherVol = naVol + kVol; 
  // Simplified calculation: remaining volume is divided between 10%GS and 50%GS
  const remainingVol = pnLiquid - aaVol - fatVol - electrolyteAndOtherVol;

  /**
   * System of equations:
   * x + y = remainingVol
   * 0.1x + 0.5y = totalGlucoseGrams
   * 
   * From (1): x = remainingVol - y
   * 0.1(remainingVol - y) + 0.5y = totalGlucoseGrams
   * 0.1*remainingVol - 0.1y + 0.5y = totalGlucoseGrams
   * 0.4y = totalGlucoseGrams - 0.1*remainingVol
   * y = (totalGlucoseGrams - 0.1*remainingVol) / 0.4
   */
  let gs50 = (totalGlucoseGrams - 0.1 * remainingVol) / 0.4;
  let gs10 = remainingVol - gs50;

  // Safeguards for impossible inputs
  if (gs50 < 0) {
    gs50 = 0;
    gs10 = remainingVol;
  } else if (gs10 < 0) {
    gs10 = 0;
    gs50 = remainingVol;
  }

  const actualGlucoseGrams = (gs10 * 0.1) + (gs50 * 0.5);
  const glucoseConcentration = (actualGlucoseGrams / pnLiquid) * 100;

  // Calories
  const glucoseCal = actualGlucoseGrams * CALORIES.GLUCOSE;
  const aaCal = (aaTarget * weight) * CALORIES.AA;
  const fatCal = (fatTarget * weight) * CALORIES.FAT;
  const totalCalories = (glucoseCal + aaCal + fatCal) / weight;

  // Osmolarity approximation
  // (Glucose g/L * 5) + (AA g/L * 10) + electrolytes... simplified version
  const osmolarity = ((actualGlucoseGrams / pnLiquid) * 1000 * 5) + 
                     (((aaTarget * weight) / pnLiquid) * 1000 * 8) + 
                     ((naTarget * weight + kTarget * weight) * 2 / (pnLiquid / 1000));

  return {
    totalLiquid: totalDailyLiquid,
    flowRate,
    glucoseConcentration,
    gs10,
    gs50,
    aaVol,
    fatVol,
    naVol,
    kVol,
    totalCalories,
    osmolarity
  };
};
