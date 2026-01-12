
export const CONCENTRATIONS = {
  AA_6_PERCENT: 0.06, // 6% 氨基酸 (g/ml)
  FAT_20_PERCENT: 0.20, // 20% 脂肪乳 (g/ml)
  NACL_10_PERCENT: 1.7, // 10% NaCl (mmol/ml)
  KCL_10_PERCENT: 1.34, // 10% KCl (mmol/ml)
};

export const CALORIES = {
  GLUCOSE: 3.4, // kcal/g
  AA: 4,      // kcal/g
  FAT: 9,      // kcal/g (using 9 for calculations, sometimes 10 is used for lipid emulsions)
  MILK: {
    standard: 0.67,
    preterm68: 0.68,
    preterm81: 0.81
  }
};

export const OSMOLARITY_FACTORS = {
  GLUCOSE: 50, // mOsm per 10% glucose in 1L (rough estimate)
  AA: 80,      // mOsm per 1% in 1L
  NA: 2,       // 2 mOsm per mmol
  K: 2         // 2 mOsm per mmol
};

export const GUIDELINES = {
  GIR: { min: 4, max: 12, unit: 'mg/kg/min' },
  AA: { min: 1.5, max: 3.5, unit: 'g/kg' },
  FAT: { min: 1.0, max: 3.5, unit: 'g/kg' },
  CALORIES: { target: '80~90', unit: 'kcal/kg' }
};
