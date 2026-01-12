
export const CONCENTRATIONS = {
  AA_6_PERCENT: 0.06, // 6% 氨基酸 (g/ml)
  FAT_20_PERCENT: 0.20, // 20% 脂肪乳 (g/ml)
  NACL_10_PERCENT: 1.7, // 10% NaCl (mmol/ml)
  KCL_10_PERCENT: 1.34, // 10% KCl (mmol/ml)
};

export const CALORIES = {
  GLUCOSE: 3.4, // kcal/g
  AA: 4,      // kcal/g
  FAT: 9,      // kcal/g
  MILK: {
    standard: 0.67,
    preterm68: 0.68,
    preterm81: 0.81
  }
};

export const GUIDELINES = {
  GIR: {
    preterm: { start: [4.0, 8.0], inc: [1.0, 2.0], max: 12.0 },
    term: { start: [3.0, 5.0], inc: [1.0, 2.0], max: 10.0 }
  },
  AA: { start: [1.5, 2.5], inc: [1.0, 1.5], max: 3.5 },
  FAT: { start: [1.0, 2.0], inc: [0.5, 1.0], max: 3.5 },
  ELECTROLYTES: {
    NA: {
      preterm_low_bw: { transition: 0, stable: [2.0, 3.0], long: [2.0, 4.0] }, // <1500g
      preterm_high_bw: { transition: 0, stable: [2.0, 3.0], long: [2.0, 3.0] }, // >1500g
      term: { transition: 0, stable: [2.0, 3.0], long: [2.0, 3.0] }
    },
    K: {
      preterm: { transition: 0, stable: [1.0, 2.0], long: [2.0, 3.0] },
      term: { transition: 0, stable: [1.0, 2.0], long: [2.0, 3.0] }
    }
  },
  MINERALS: {
    preterm: { ca: [1.5, 2.0], p: [1.3, 1.7], mg: [0.2, 0.3] },
    term: { ca: [1.0, 1.5], p: [0.8, 1.2], mg: [0.2, 0.3] }
  }
};
