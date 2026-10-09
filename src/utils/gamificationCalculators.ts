import {
  WeeklyScoreBreakdown,
  GamificationBadge,
  DailyTargets,
  DayHistoryPoint,
  LoggedMealItem,
} from '../types/nutrition';

export function calculateWeeklyHealthScore(
  targets: DailyTargets,
  logs: LoggedMealItem[],
  waterIntakeMl: number,
  sevenDayHistory: DayHistoryPoint[]
): WeeklyScoreBreakdown {
  // 1. Food Group Balance Score (Max 35 points)
  // Check how many of the 5 food groups have been logged today and in history
  const hasGroup1 = logs.some(l => l.foodGroups.group1_protein > 0);
  const hasGroup2 = logs.some(l => l.foodGroups.group2_carbs > 0);
  const hasGroup3 = logs.some(l => l.foodGroups.group3_vegetables > 0);
  const hasGroup4 = logs.some(l => l.foodGroups.group4_fruits > 0);
  const hasGroup5 = logs.some(l => l.foodGroups.group5_fats > 0);

  const groupsCountToday = [hasGroup1, hasGroup2, hasGroup3, hasGroup4, hasGroup5].filter(Boolean).length;
  // Base today score up to 20 pts, plus history plate ratio up to 15 pts
  const todayGroupScore = (groupsCountToday / 5) * 20;
  const avgHistoryPlate = sevenDayHistory.reduce((sum, h) => sum + h.completedPlateRatio, 0) / (sevenDayHistory.length || 1);
  const historyGroupScore = (avgHistoryPlate / 100) * 15;
  const foodGroupBalanceScore = Math.min(35, Math.round(todayGroupScore + historyGroupScore));

  // 2. Calorie Adherence Score (Max 25 points)
  const totalCal = logs.reduce((sum, l) => sum + l.calories, 0);
  const targetCal = targets.targetCalories || 2000;
  const diffPercent = Math.abs(totalCal - targetCal) / targetCal;
  let calorieAdherenceScore = 25;
  if (diffPercent <= 0.10) {
    calorieAdherenceScore = 25;
  } else if (diffPercent <= 0.20) {
    calorieAdherenceScore = 20;
  } else if (diffPercent <= 0.30) {
    calorieAdherenceScore = 14;
  } else {
    calorieAdherenceScore = 8;
  }

  // 3. Hydration Score (Max 20 points)
  const targetWater = targets.targetWaterMl || 2000;
  const waterRatio = Math.min(1.2, waterIntakeMl / (targetWater || 1));
  const hydrationScore = Math.min(20, Math.round(waterRatio * 20));

  // 4. Lifestyle & Health Habits Score (Max 20 points)
  let lifestyleHabitsScore = 10;
  if (targets.bmiAnalysis.status === 'normal') {
    lifestyleHabitsScore += 6;
  } else if (targets.bmiAnalysis.status === 'overweight' || targets.bmiAnalysis.status === 'underweight') {
    lifestyleHabitsScore += 4;
  }
  // Fiber check
  const totalFiber = logs.reduce((sum, l) => sum + l.fiber, 0);
  if (totalFiber >= 20) {
    lifestyleHabitsScore += 4;
  } else if (totalFiber >= 12) {
    lifestyleHabitsScore += 2;
  }

  const overallScore = Math.min(100, foodGroupBalanceScore + calorieAdherenceScore + hydrationScore + lifestyleHabitsScore);

  let grade: WeeklyScoreBreakdown['grade'] = 'B';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else grade = 'D';

  const feedbackHighlights: string[] = [];
  if (groupsCountToday === 5) {
    feedbackHighlights.push('ยอดเยี่ยมมาก! วันนี้คุณบริโภคอาหารครบทั้ง 5 หมู่ตามหลักโภชนาการ');
  } else {
    feedbackHighlights.push(`วันนี้บริโภคไป ${groupsCountToday}/5 หมู่ แนะนำเสริม${!hasGroup3 ? 'ผักสด' : !hasGroup4 ? 'ผลไม้' : 'สารอาหารที่ขาด'}`);
  }

  if (waterIntakeMl >= targetWater) {
    feedbackHighlights.push('ดื่มน้ำได้ครบตามเป้าหมายของร่างกาย ช่วยให้ระบบเผาผลาญทำงานได้เต็มประสิทธิภาพ');
  } else {
    const lack = targetWater - waterIntakeMl;
    feedbackHighlights.push(`ปริมาณน้ำดื่มยังขาดอีก ${lack.toLocaleString()} มล. เพื่อรักษาสมดุลความชุ่มชื้น`);
  }

  if (calorieAdherenceScore >= 20) {
    feedbackHighlights.push('การควบคุมแคลอรี่อยู่ในช่วงสมดุล ไม่เกินและไม่ขาดจาก TDEE');
  }

  // Streak calculation (days with good score)
  const streakDays = Math.max(1, Math.min(14, Math.round((overallScore / 100) * 7) + (groupsCountToday === 5 ? 1 : 0)));

  return {
    overallScore,
    grade,
    foodGroupBalanceScore,
    calorieAdherenceScore,
    hydrationScore,
    lifestyleHabitsScore,
    feedbackHighlights,
    streakDays,
  };
}

export function getGamificationBadges(
  score: WeeklyScoreBreakdown,
  waterIntakeMl: number,
  logs: LoggedMealItem[],
  targetWaterMl: number
): GamificationBadge[] {
  const groupsCount = [
    logs.some(l => l.foodGroups.group1_protein > 0),
    logs.some(l => l.foodGroups.group2_carbs > 0),
    logs.some(l => l.foodGroups.group3_vegetables > 0),
    logs.some(l => l.foodGroups.group4_fruits > 0),
    logs.some(l => l.foodGroups.group5_fats > 0),
  ].filter(Boolean).length;

  const badges: GamificationBadge[] = [
    {
      id: 'badge_5_groups_champion',
      title: 'ผู้พิชิตอาหาร 5 หมู่',
      description: 'รับประทานอาหารครบถ้วนทั้ง 5 หมู่ภายใน 1 วัน',
      iconName: 'Award',
      tier: 'gold',
      category: 'nutrition',
      progress: Math.min(100, Math.round((groupsCount / 5) * 100)),
      unlocked: groupsCount === 5,
      unlockedDate: groupsCount === 5 ? 'วันนี้' : undefined,
    },
    {
      id: 'badge_plate_211',
      title: 'จานสุขภาพ 2:1:1 Master',
      description: 'ทานผักไม่น้อยกว่า 4 ทัพพีต่อวันตามสูตรกรมอนามัย',
      iconName: 'Salad',
      tier: 'silver',
      category: 'nutrition',
      progress: Math.min(100, Math.round((logs.reduce((s, l) => s + l.foodGroups.group3_vegetables, 0) / 4) * 100)),
      unlocked: logs.reduce((s, l) => s + l.foodGroups.group3_vegetables, 0) >= 4,
      unlockedDate: logs.reduce((s, l) => s + l.foodGroups.group3_vegetables, 0) >= 4 ? 'วันนี้' : undefined,
    },
    {
      id: 'badge_hydration_pro',
      title: 'สายไฮเดรตเต็ดตัวจริง',
      description: 'ดื่มน้ำสะอาดครบ 100% ตามเป้าหมายร่างกาย',
      iconName: 'Droplets',
      tier: 'gold',
      category: 'water',
      progress: Math.min(100, Math.round((waterIntakeMl / (targetWaterMl || 1)) * 100)),
      unlocked: waterIntakeMl >= targetWaterMl,
      unlockedDate: waterIntakeMl >= targetWaterMl ? 'วันนี้' : undefined,
    },
    {
      id: 'badge_streak_7days',
      title: 'Streak 7 วันต่อเนื่อง',
      description: 'รักษาวินัยการบันทึกอาหารและโภชนาการติดต่อกัน 7 วัน',
      iconName: 'Flame',
      tier: 'platinum',
      category: 'streak',
      progress: Math.min(100, Math.round((score.streakDays / 7) * 100)),
      unlocked: score.streakDays >= 7,
      unlockedDate: score.streakDays >= 7 ? 'สัปดาห์นี้' : undefined,
    },
    {
      id: 'badge_fiber_hero',
      title: 'ฮีโร่กากใย (Fiber Hero)',
      description: 'ได้รับใยอาหารรวมมากกว่า 25 กรัมต่อวัน เพื่อสุขภาพลำไส้ที่ดี',
      iconName: 'Sparkles',
      tier: 'bronze',
      category: 'nutrition',
      progress: Math.min(100, Math.round((logs.reduce((s, l) => s + l.fiber, 0) / 25) * 100)),
      unlocked: logs.reduce((s, l) => s + l.fiber, 0) >= 20,
      unlockedDate: logs.reduce((s, l) => s + l.fiber, 0) >= 20 ? 'วันนี้' : undefined,
    },
    {
      id: 'badge_home_chef',
      title: 'เชฟอาหารสุขภาพมือใหม่',
      description: 'เปิดดูคู่มือวิธีเตรียมและปรุงอาหารเพื่อทำทานเอง',
      iconName: 'ChefHat',
      tier: 'bronze',
      category: 'culinary',
      progress: 100,
      unlocked: true,
      unlockedDate: 'ปลดล็อกแล้ว',
    },
    {
      id: 'badge_calorie_balance',
      title: 'สมดุลพลังงานแม่นยำ',
      description: 'ควบคุมแคลอรี่ไม่เกิน ±10% ของเป้าหมาย TDEE',
      iconName: 'Target',
      tier: 'silver',
      category: 'nutrition',
      progress: score.calorieAdherenceScore >= 20 ? 100 : 60,
      unlocked: score.calorieAdherenceScore >= 20,
      unlockedDate: score.calorieAdherenceScore >= 20 ? 'วันนี้' : undefined,
    },
    {
      id: 'badge_score_master',
      title: 'คะแนนสุขภาพระดับเกียรตินิยม A+',
      description: 'ทำคะแนนประเมินสุขภาพประจำสัปดาห์ได้มากกว่า 90 คะแนน',
      iconName: 'Trophy',
      tier: 'platinum',
      category: 'nutrition',
      progress: Math.min(100, Math.round((score.overallScore / 90) * 100)),
      unlocked: score.overallScore >= 90,
      unlockedDate: score.overallScore >= 90 ? 'สัปดาห์นี้' : undefined,
    },
  ];

  return badges;
}
