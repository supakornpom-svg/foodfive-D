import { UserProfile, DailyTargets, DayHistoryPoint, LoggedMealItem, BmiAnalysis, BmiStatus } from '../types/nutrition';

export function calculateBmiAnalysis(weightKg: number, heightCm: number): BmiAnalysis {
  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Number(bmiRaw.toFixed(1));

  // Asian / Thai Criteria (WHO Asia-Pacific & Department of Health Thailand)
  const idealWeightMin = Number((18.5 * heightM * heightM).toFixed(1));
  const idealWeightMax = Number((22.9 * heightM * heightM).toFixed(1));

  let status: BmiStatus = 'normal';
  let statusLabel = 'น้ำหนักปกติ (สมส่วน)';
  let statusColor = '#059669';
  let badgeBgColor = 'bg-emerald-50';
  let badgeTextColor = 'text-emerald-800';
  let healthRisk = 'ความเสี่ยงต่อโรคเรื้อรังอยู่ในระดับต่ำที่สุด ร่างกายมีสมดุลที่ดี';
  let weightDifference = 0;

  let exercisePlan = {
    title: 'โปรแกรมสร้างความฟิตและรักษาสมดุล (Cardio & Functional Fitness)',
    description: 'ออกกำลังกายแบบผสมผสานเพื่อคงสภาพความแข็งแรงของหัวใจ ปอด และรักษาสมดุลของมวลกล้ามเนื้อกับไขมัน',
    cardioRoutine: 'คาร์ดิโอระดับปานกลาง 150-180 นาที/สัปดาห์ (Zone 2-3 เช่น วิ่งจ็อกกิ้ง ว่ายน้ำ หรือปั่นจักรยาน)',
    strengthRoutine: 'บอดี้เวทหรือเวทเทรนนิ่ง 2-3 วัน/สัปดาห์ ครอบคลุมกล้ามเนื้อมัดใหญ่ทั่วร่างกาย (อก หลัง ขา แขน แกนกลาง)',
    weeklyTargetMinutes: 180,
    recommendedActivities: ['วิ่งจ็อกกิ้ง/เดินเร็ว', 'ว่ายน้ำ', 'ปั่นจักรยาน', 'เวทเทรนนิ่ง', 'แบดมินตัน'],
    precautions: 'อบอุ่นร่างกาย (Warm-up) และยืดเหยียด (Cool-down) ทุกครั้งเพื่อป้องกันการบาดเจ็บของกล้ามเนื้อและข้อต่อ',
  };

  if (bmi < 18.5) {
    status = 'underweight';
    statusLabel = 'น้ำหนักน้อยกว่าเกณฑ์ (ผอม)';
    statusColor = '#0284C7';
    badgeBgColor = 'bg-sky-50';
    badgeTextColor = 'text-sky-800';
    healthRisk = 'เสี่ยงต่อภาวะขาดสารอาหาร มวลกล้ามเนื้อและกระดูกบาง และภูมิต้านทานต่ำ';
    weightDifference = Number((idealWeightMin - weightKg).toFixed(1)); // ขาดอีกกี่ กก.

    exercisePlan = {
      title: 'โปรแกรมเสริมสร้างมวลกล้ามเนื้อและกระดูก (Hypertrophy & Strength)',
      description: 'เน้นการออกกำลังกายแบบมีแรงต้าน (Resistance Training) เพื่อกระตุ้นการสังเคราะห์โปรตีนและเพิ่มมวลกล้ามเนื้อ หลีกเลี่ยงคาร์ดิโอที่หนักเกินไป',
      cardioRoutine: 'คาร์ดิโอเบาๆ 15-20 นาที สัปดาห์ละ 2 วัน เพื่อบริหารระบบหัวใจและหลอดเลือด เช่น เดินเร็วหรือปั่นจักรยานเบาๆ',
      strengthRoutine: 'เวทเทรนนิ่ง 3-4 วัน/สัปดาห์ (ท่า Compound: Squats, Push-ups, Rows, Deadlifts) พักระหว่างเซ็ต 1.5-2 นาที',
      weeklyTargetMinutes: 150,
      recommendedActivities: ['เวทเทรนนิ่ง/บอดี้เวท', 'โยคะสร้างความแข็งแรง', 'พิลาทิส', 'ว่ายน้ำเพื่อผ่อนคลาย'],
      precautions: 'หลีกเลี่ยงคาร์ดิโอเข้มข้นสูง (HIIT) นานเกินไป และควรรับประทานอาหารหมู่อาหารโปรตีนและคาร์โบไฮเดรตเสริมพลังงานหลังออกกำลังกายเสมอ',
    };
  } else if (bmi >= 18.5 && bmi <= 22.9) {
    status = 'normal';
    statusLabel = 'น้ำหนักปกติ (สมส่วน)';
    statusColor = '#059669';
    badgeBgColor = 'bg-emerald-50';
    badgeTextColor = 'text-emerald-800';
    healthRisk = 'ความเสี่ยงต่อโรคเรื้อรังอยู่ในระดับต่ำที่สุด ร่างกายมีสมดุลที่ดี';
    weightDifference = 0;
  } else if (bmi >= 23.0 && bmi <= 24.9) {
    status = 'overweight';
    statusLabel = 'น้ำหนักเกิน (ท้วม / เริ่มเสี่ยง)';
    statusColor = '#D97706';
    badgeBgColor = 'bg-amber-50';
    badgeTextColor = 'text-amber-800';
    healthRisk = 'เริ่มมีความเสี่ยงต่อภาวะดื้อต่ออินซูลิน ไขมันสะสมในช่องท้อง และความดันโลหิตสูง';
    weightDifference = Number((weightKg - idealWeightMax).toFixed(1)); // เกินอยู่กี่ กก.

    exercisePlan = {
      title: 'โปรแกรมกระตุ้นการเผาผลาญไขมันสะสม (Fat Oxidation & Metabolic Boost)',
      description: 'เน้นคาร์ดิโอในโซนเผาผลาญไขมันสูงสุด (Zone 2) ร่วมกับเวทเทรนนิ่งเพื่อเพิ่มอัตราการเผาผลาญพลังงานขณะพัก (BMR)',
      cardioRoutine: 'แอโรบิกต่อเนื่อง 30-45 นาที 4-5 วัน/สัปดาห์ (เดินเร็วชัน, ปั่นจักรยาน, เต้นแอโรบิก ให้รู้สึกเหนื่อยพอพูดเป็นประโยคได้)',
      strengthRoutine: 'Circuit Training หรือเวทเทรนนิ่ง 3 วัน/สัปดาห์ เน้นจำนวนครั้ง 12-15 ครั้ง/เซ็ต',
      weeklyTargetMinutes: 200,
      recommendedActivities: ['เดินเร็วปรับความชัน (Incline Walking)', 'ปั่นจักรยานแอโรบิก', 'ว่ายน้ำ', 'เซอร์กิตเทรนนิ่ง', 'บอดี้เวท'],
      precautions: 'เลือกรองเท้าที่มีการรองรับแรงกระแทกที่ดี และระวังการลงน้ำหนักที่หัวเข่าขณะวิ่งบนพื้นคอนกรีตแข็ง',
    };
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    status = 'obese1';
    statusLabel = 'โรคอ้วนระดับ 1 (เสี่ยงปานกลาง)';
    statusColor = '#EA580C';
    badgeBgColor = 'bg-orange-50';
    badgeTextColor = 'text-orange-800';
    healthRisk = 'เสี่ยงต่อโรคเบาหวานประเภทที่ 2 ไขมันในเลือดสูง ไขมันพอกตับ และข้อเข่าเสื่อม';
    weightDifference = Number((weightKg - idealWeightMax).toFixed(1));

    exercisePlan = {
      title: 'โปรแกรมเผาผลาญถนอมข้อต่อ (Low-Impact Aerobic & Joint Care)',
      description: 'เน้นการออกกำลังกายที่มีแรงกระแทกต่ำ เพื่อป้องกันการบาดเจ็บของข้อต่อ กระดูกสันหลัง และหมอนรองกระดูก ควบคู่กับการควบคุมพลังงาน',
      cardioRoutine: 'ออกกำลังกายแบบแรงกระแทกต่ำ (Low-Impact) 40-50 นาที 5 วัน/สัปดาห์ เช่น เดินเร็วบนพื้นราบ, ปั่นจักรยานอยู่กับที่ หรือเดินในน้ำ',
      strengthRoutine: 'บอดี้เวทแบบใช้อุปกรณ์พยุง หรือยางยืดต้านทาน (Resistance Bands) 2-3 วัน/สัปดาห์ เสริมสร้างกล้ามเนื้อรอบข้อเข่าและแกนกลางลำตัว',
      weeklyTargetMinutes: 220,
      recommendedActivities: ['เดินเร็วบนพื้นเรียบ', 'ปั่นจักรยานอยู่กับที่ (Stationary Bike)', 'ว่ายน้ำ/แอโรบิกในน้ำ', 'กรรเชียงบก (Rowing)', 'เดินลู่ไฟฟ้า'],
      precautions: 'หลีกเลี่ยงท่ากระโดด (Jumping) และการวิ่งลงส้นเท้าอย่างเด็ดขาด สังเกตอาการแน่นหน้าอกหรือหน้ามืด',
    };
  } else {
    status = 'obese2';
    statusLabel = 'โรคอ้วนระดับ 2 (อ้วนอันตราย)';
    statusColor = '#DC2626';
    badgeBgColor = 'bg-rose-50';
    badgeTextColor = 'text-rose-800';
    healthRisk = 'ความเสี่ยงสูงมากต่อภาวะหยุดหายใจขณะหลับ (Sleep Apnea), โรคหัวใจ, หลอดเลือด และเบาหวาน';
    weightDifference = Number((weightKg - idealWeightMax).toFixed(1));

    exercisePlan = {
      title: 'โปรแกรมฟื้นฟูสุขภาพอย่างปลอดภัย (Safe Movement & Aquatic Conditioning)',
      description: 'เริ่มต้นด้วยการขยับร่างกายอย่างนุ่มนวล โดยใช้น้ำช่วยพยุงน้ำหนักตัว หรือเดินสะสมช่วงละ 10-15 นาที เพื่อปรับระบบไหลเวียนโลหิตอย่างปลอดภัย',
      cardioRoutine: 'ออกกำลังกายในน้ำ หรือเดินช้าสลับเร็ววันละ 20-30 นาที แบ่งเป็น 2 ช่วง (เช้า-เย็น) 4-6 วัน/สัปดาห์',
      strengthRoutine: 'กายบริหารบนเก้าอี้ (Chair Exercises) และท่าเสริมกล้ามเนื้อแกนกลางลำตัวที่ไม่กดทับกระดูกสันหลัง',
      weeklyTargetMinutes: 150,
      recommendedActivities: ['เดินในสระน้ำ (Water Walking)', 'ปั่นจักรยานแบบเอนปั่น (Recumbent Bike)', 'กายบริหารแบบนั่งเก้าอี้', 'เดินสะสมก้าว'],
      precautions: 'ควรปรึกษาแพทย์ก่อนเริ่มโปรแกรม ตรวจวัดความดันโลหิตสม่ำเสมอ พกน้ำดื่ม และหยุดพักทันทีหากมีอาการเวียนศีรษะหรือหายใจติดขัด',
    };
  }

  return {
    bmi,
    status,
    statusLabel,
    statusColor,
    badgeBgColor,
    badgeTextColor,
    healthRisk,
    idealWeightMin,
    idealWeightMax,
    weightDifference,
    exercisePlan,
  };
}

export function calculateDailyTargets(profile: UserProfile): DailyTargets {
  const { gender, age, weightKg, heightCm, activityLevel, goal } = profile;

  // Calculate BMI Analysis
  const bmiAnalysis = calculateBmiAnalysis(weightKg, heightCm);

  // Mifflin-St Jeor formula
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  bmr = Math.round(bmr);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (profile.customCalorieTarget && profile.customCalorieTarget > 800) {
    targetCalories = profile.customCalorieTarget;
  } else {
    if (goal === 'weight_loss') {
      targetCalories = Math.max(1200, Math.round(tdee - 450));
    } else if (goal === 'muscle_gain') {
      targetCalories = Math.round(tdee + 350);
    }
  }

  // Macro distribution based on goals
  let proteinRatio = 0.20; // 20%
  let fatRatio = 0.25;     // 25%
  let carbsRatio = 0.55;   // 55%

  if (goal === 'muscle_gain') {
    proteinRatio = 0.25;
    fatRatio = 0.25;
    carbsRatio = 0.50;
  } else if (goal === 'weight_loss') {
    proteinRatio = 0.25;
    fatRatio = 0.25;
    carbsRatio = 0.50;
  }

  // 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
  const targetProteinGrams = Math.round((targetCalories * proteinRatio) / 4);
  const targetCarbsGrams = Math.round((targetCalories * carbsRatio) / 4);
  const targetFatGrams = Math.round((targetCalories * fatRatio) / 9);
  const targetFiberGrams = Math.round(Math.max(25, (targetCalories / 1000) * 14));

  // Water intake calculation: Base (Weight * 33 ml) + Activity Hydration Bonus
  const baseWater = weightKg * 33;
  const activityWaterBonus: Record<string, number> = {
    sedentary: 0,
    light: 250,
    moderate: 500,
    active: 750,
    very_active: 1000,
  };
  const targetWaterMl = Math.round(baseWater + (activityWaterBonus[activityLevel] || 0));

  // 5 Food Groups serving recommendations based on Thai Food-Based Dietary Guidelines
  const calorieScale = targetCalories / 1800;

  const targetFoodGroups = {
    group1: {
      portions: Number((3.5 * calorieScale).toFixed(1)),
      unit: 'ส่วน (8-10 ช้อนกินข้าว)',
      desc: 'เนื้อปลา, อกไก่, ไข่, ถั่ว, เต้าหู้'
    },
    group2: {
      portions: Number((7.0 * calorieScale).toFixed(1)),
      unit: 'ทัพพี',
      desc: 'ข้าวกล้อง, ไรซ์เบอร์รี่, ขนมปังโฮลวีต'
    },
    group3: {
      portions: Number((4.5 * Math.max(0.9, calorieScale * 0.9)).toFixed(1)),
      unit: 'ทัพพี',
      desc: 'ผักหลากสี 2 ส่วนในจานอาหาร'
    },
    group4: {
      portions: Number((3.5 * Math.max(0.9, calorieScale * 0.9)).toFixed(1)),
      unit: 'ส่วน',
      desc: 'ผลไม้สดหวานน้อย เช่น ฝรั่ง มะละกอ ส้ม'
    },
    group5: {
      portions: Number((5.0 * calorieScale).toFixed(1)),
      unit: 'ช้อนชา',
      desc: 'น้ำมันปรุงอาหารและไขมันดี'
    }
  };

  return {
    bmr,
    tdee,
    bmiAnalysis,
    targetCalories,
    targetProteinGrams,
    targetCarbsGrams,
    targetFatGrams,
    targetFiberGrams,
    targetWaterMl,
    targetFoodGroups
  };
}

export function calculateIntakeTotals(logs: LoggedMealItem[]) {
  return logs.reduce(
    (acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0),
      fiber: acc.fiber + (item.fiber || 0),
      sodium: acc.sodium + (item.sodium || 0),
      group1_protein: acc.group1_protein + (item.foodGroups?.group1_protein || 0) * (item.servings || 1),
      group2_carbs: acc.group2_carbs + (item.foodGroups?.group2_carbs || 0) * (item.servings || 1),
      group3_vegetables: acc.group3_vegetables + (item.foodGroups?.group3_vegetables || 0) * (item.servings || 1),
      group4_fruits: acc.group4_fruits + (item.foodGroups?.group4_fruits || 0) * (item.servings || 1),
      group5_fats: acc.group5_fats + (item.foodGroups?.group5_fats || 0) * (item.servings || 1),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0,
      group1_protein: 0,
      group2_carbs: 0,
      group3_vegetables: 0,
      group4_fruits: 0,
      group5_fats: 0,
    }
  );
}

export function calculatePlateCompliance(actualGroups: {
  group1_protein: number;
  group2_carbs: number;
  group3_vegetables: number;
}) {
  // Ideal Thai 2:1:1 plate: Vegetables = 2 parts, Carbs = 1 part, Protein = 1 part (Total = 4 parts)
  const total = actualGroups.group1_protein + actualGroups.group2_carbs + actualGroups.group3_vegetables;
  if (total === 0) return { vegPct: 0, carbPct: 0, proteinPct: 0, score: 0 };

  const vegPct = Math.round((actualGroups.group3_vegetables / total) * 100);
  const carbPct = Math.round((actualGroups.group2_carbs / total) * 100);
  const proteinPct = Math.round((actualGroups.group1_protein / total) * 100);

  // Ideal targets: Veg 50%, Carb 25%, Protein 25%
  const vegDiff = Math.abs(vegPct - 50);
  const carbDiff = Math.abs(carbPct - 25);
  const proteinDiff = Math.abs(proteinPct - 25);
  const score = Math.max(0, Math.min(100, Math.round(100 - (vegDiff + carbDiff + proteinDiff) * 0.8)));

  return {
    vegPct,
    carbPct,
    proteinPct,
    score
  };
}

export function generateSevenDaysHistory(
  targetCalories: number,
  todayActualCalories: number,
  todayProtein: number,
  todayCarbs: number,
  todayFat: number
): DayHistoryPoint[] {
  const daysThai = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์ (วันนี้)'];

  // Past 6 days realistic simulated variance around target
  const pastMultipliers = [0.94, 1.02, 0.98, 1.05, 0.92, 1.08];

  const points: DayHistoryPoint[] = [];

  for (let i = 0; i < 6; i++) {
    const mult = pastMultipliers[i];
    const actual = Math.round(targetCalories * mult);
    points.push({
      dayName: daysThai[i],
      dateStr: `ย้อนหลัง ${6 - i} วัน`,
      actualCalories: actual,
      targetCalories,
      protein: Math.round((actual * 0.22) / 4),
      carbs: Math.round((actual * 0.52) / 4),
      fat: Math.round((actual * 0.26) / 9),
      completedPlateRatio: Math.min(100, Math.round(75 + (i * 3.5)))
    });
  }

  // Day 7 is Today connected to real user logs
  points.push({
    dayName: daysThai[6],
    dateStr: 'วันนี้',
    actualCalories: todayActualCalories,
    targetCalories,
    protein: todayProtein,
    carbs: todayCarbs,
    fat: todayFat,
    completedPlateRatio: todayActualCalories > 0 ? Math.min(100, Math.round((todayActualCalories / targetCalories) * 100)) : 0
  });

  return points;
}
