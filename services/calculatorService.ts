
import { PNInputs, PNResults } from '../types';
import { CONCENTRATIONS, CALORIES } from '../constants';

/**
 * 根据日龄和体重获取共识推荐区间 (基于 2025 专家共识表 2)
 */
export const getConsensusRanges = (dol: number, bw: number, isTerm: boolean) => {
  // 1. 液体量区间 (表 2)
  let liq = [60, 80];
  if (isTerm) {
    if (dol === 1) liq = [40, 60];
    else if (dol === 2) liq = [50, 70];
    else if (dol === 3) liq = [60, 80];
    else if (dol <= 5) liq = [60, 100];
    else liq = [140, 170];
  } else {
    if (bw < 1000) {
      if (dol === 1) liq = [60, 100];
      else if (dol === 2) liq = [80, 120];
      else if (dol === 3) liq = [100, 140];
      else if (dol <= 5) liq = [120, 160];
      else liq = [140, 160];
    } else if (bw < 1500) {
      if (dol === 1) liq = [60, 90];
      else if (dol === 2) liq = [80, 110];
      else if (dol === 3) liq = [100, 130];
      else if (dol <= 5) liq = [120, 150];
      else liq = [140, 160];
    } else {
      if (dol === 1) liq = [60, 80];
      else if (dol === 2) liq = [80, 100];
      else if (dol === 3) liq = [100, 120];
      else if (dol <= 5) liq = [120, 140];
      else liq = [140, 160];
    }
  }

  // 2. 糖速区间 (表 3)
  const gir = isTerm ? [3.0, 10.0] : [4.0, 12.0];

  // 3. 氨基酸与脂肪乳 (阶梯递增)
  const aa = [1.5, 3.5];
  const fat = [1.0, 3.5];

  // 4. 电解质 (表 4)
  let na = [2.0, 3.0];
  if (dol <= 2) na = [0, 0];
  else if (!isTerm && bw < 1500 && dol > 14) na = [2.0, 4.0];

  let k = [1.0, 2.0];
  if (dol <= 2) k = [0, 0];
  else if (dol > 14) k = [2.0, 3.0];

  return { liq, gir, aa, fat, na, k };
};

export const calculatePN = (inputs: PNInputs): PNResults => {
  const { weight, totalLiquidTarget, gir, aaTarget, fatTarget, naTarget, kTarget, subtractionFluid } = inputs;

  const totalDailyLiquid = totalLiquidTarget * weight;
  const pnLiquid = Math.max(0, totalDailyLiquid - subtractionFluid);
  const flowRate = pnLiquid / 24;

  const aaVol = (aaTarget * weight) / CONCENTRATIONS.AA_6_PERCENT;
  const fatVol = (fatTarget * weight) / CONCENTRATIONS.FAT_20_PERCENT;
  const naVol = (naTarget * weight) / CONCENTRATIONS.NACL_10_PERCENT;
  const kVol = (kTarget * weight) / CONCENTRATIONS.KCL_10_PERCENT;

  const totalGlucoseGrams = gir * weight * 1.44;
  const fixedVol = aaVol + fatVol + naVol + kVol; 
  const remainingVol = Math.max(0, pnLiquid - fixedVol);

  let gs50 = (totalGlucoseGrams - 0.1 * remainingVol) / 0.4;
  let gs10 = remainingVol - gs50;

  if (gs50 < 0) { gs50 = 0; gs10 = remainingVol; }
  else if (gs10 < 0) { gs10 = 0; gs50 = remainingVol; }

  const actualGlucoseGrams = (gs10 * 0.1) + (gs50 * 0.5);
  const glucoseConcentration = pnLiquid > 0 ? (actualGlucoseGrams / pnLiquid) * 100 : 0;

  const glucoseCal = actualGlucoseGrams * CALORIES.GLUCOSE;
  const aaCal = (aaTarget * weight) * CALORIES.AA;
  const fatCal = (fatTarget * weight) * CALORIES.FAT;
  const totalCalories = (glucoseCal + aaCal + fatCal) / weight;

  const totalPnCal = glucoseCal + aaCal + fatCal || 1;
  const calorieRatios = {
    carb: Math.round((glucoseCal / totalPnCal) * 100),
    protein: Math.round((aaCal / totalPnCal) * 100),
    fat: Math.round((fatCal / totalPnCal) * 100),
  };

  const nitrogenGrams = (aaTarget * weight) / 6.25;
  const npc = glucoseCal + fatCal;
  const cnRatio = nitrogenGrams > 0 ? npc / nitrogenGrams : 0;
  const npcLipidRatio = npc > 0 ? (fatCal / npc) * 100 : 0;

  const osmolarity = pnLiquid > 0 ? ((actualGlucoseGrams / pnLiquid) * 1000 * 5) + 
                     (((aaTarget * weight) / pnLiquid) * 1000 * 8) + 
                     ((naTarget * weight + kTarget * weight) * 2 / (pnLiquid / 1000)) : 0;

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
    osmolarity,
    calorieRatios,
    cnRatio,
    npcLipidRatio
  };
};
