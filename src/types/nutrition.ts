export type FoodGroupId = 'group1' | 'group2' | 'group3' | 'group4' | 'group5';

export interface FoodGroupInfo {
  id: FoodGroupId;
  number: number;
  name: string;
  shortName: string;
  category: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  imageSrc: string;
  primaryNutrients: string[];
  recommendedDaily: string;
  standardPercentage: number; // approximate target % in energy/plate
  benefits: string;
  goodSources: string[];
  foodsToLimit: string[];
  tips: string;
  unitThai: string;
  composition: { category: string; examples: string[] }[];
  functions: string[];
  deficiencyRisks: string;
  excessRisks: string;
  portionGuideline: string;
}

export interface NutritionFact {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  fiber: number;   // grams
  sodium: number;  // mg
}

export interface FoodGroupServing {
  group1_protein: number;   // portions/servings
  group2_carbs: number;     // portions (ทัพพี)
  group3_vegetables: number; // portions (ทัพพี)
  group4_fruits: number;     // portions (ส่วน)
  group5_fats: number;       // portions (ช้อนชา)
}

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  category: 'dish' | 'snack' | 'drink' | 'ingredient';
  defaultMeal: MealTime;
  servingSize: string;
  nutrition: NutritionFact;
  foodGroups: FoodGroupServing;
  isVegetarian?: boolean;
  tags: string[];
  description: string;
  ingredientsBreakdown: {
    group1?: string;
    group2?: string;
    group3?: string;
    group4?: string;
    group5?: string;
  };
  healthyTip?: string;
  suitableGoals?: ('weight_loss' | 'muscle_gain' | 'balance' | 'low_sodium')[];
  suitableConstraints?: HealthConstraint[];
  cautions?: {
    constraint: HealthConstraint;
    warningText: string;
  }[];
  keyIngredients?: string[];
  cookingTimeMinutes?: number;
  difficulty?: 'ง่ายมาก (สำหรับมือใหม่)' | 'ง่าย' | 'ปานกลาง';
  prepSteps?: string[];
  cookingSteps?: string[];
  beginnerTips?: string;
}

export interface LoggedMealItem {
  id: string;
  foodItemId?: string;
  name: string;
  mealTime: MealTime;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  foodGroups: FoodGroupServing;
  timestamp: string;
}

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type HealthGoal = 'balance' | 'weight_loss' | 'muscle_gain';

export type HealthConstraint =
  | 'low_sodium'      // ความดันโลหิตสูง / ลดเค็ม / โรคไตระยะแรก
  | 'diabetes'        // เบาหวาน / ควบคุมน้ำตาล (Low GI)
  | 'gerd'            // กรดไหลย้อน (หลีกเลี่ยงรสจัด เผ็ดจัด เปรี้ยวจัด)
  | 'gout'            // เกาต์ / คุมพิวรีน
  | 'vegetarian'      // มังสวิรัติ
  | 'no_seafood'      // ไม่ทาน/แพ้อาหารทะเล
  | 'no_dairy'        // ไม่ทาน/แพ้นมวัว
  | 'no_nuts';        // แพ้ถั่วเปลือกแข็ง

export interface UserProfile {
  gender: Gender;
  age: number;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  goal: HealthGoal;
  customCalorieTarget?: number;
  healthConstraints?: HealthConstraint[];
}

export type BmiStatus = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2';

export interface BmiAnalysis {
  bmi: number;
  status: BmiStatus;
  statusLabel: string;
  statusColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  healthRisk: string;
  idealWeightMin: number;
  idealWeightMax: number;
  weightDifference: number;
  exercisePlan: {
    title: string;
    description: string;
    cardioRoutine: string;
    strengthRoutine: string;
    weeklyTargetMinutes: number;
    recommendedActivities: string[];
    precautions: string;
  };
}

export interface DailyTargets {
  bmr: number;
  tdee: number;
  bmiAnalysis: BmiAnalysis;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  targetFiberGrams: number;
  targetWaterMl: number;
  targetFoodGroups: {
    group1: { portions: number; unit: string; desc: string };
    group2: { portions: number; unit: string; desc: string };
    group3: { portions: number; unit: string; desc: string };
    group4: { portions: number; unit: string; desc: string };
    group5: { portions: number; unit: string; desc: string };
  };
}

export interface DayHistoryPoint {
  dayName: string;
  dateStr: string;
  actualCalories: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  completedPlateRatio: number; // 0 to 100%
}

export interface MealPlanPreset {
  id: string;
  title: string;
  subtitle: string;
  totalCalories: number;
  goal: HealthGoal;
  items: {
    breakfast: FoodItem;
    lunch: FoodItem;
    dinner: FoodItem;
    snack: FoodItem;
  };
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayMealPlan {
  dayOfWeek: DayOfWeek;
  dayLabel: string;
  breakfast?: FoodItem;
  lunch?: FoodItem;
  dinner?: FoodItem;
  snack?: FoodItem;
}

export type WeeklyMealPlan = Record<DayOfWeek, DayMealPlan>;

export interface GroceryItem {
  id: string;
  name: string;
  category: 'produce' | 'meat_protein' | 'grain_carb' | 'pantry_oil' | 'fruit';
  categoryLabel: string;
  quantityEst: string;
  sourceMeals: string[];
  checked: boolean;
}

export interface WeeklyScoreBreakdown {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  foodGroupBalanceScore: number; // Max 35
  calorieAdherenceScore: number; // Max 25
  hydrationScore: number; // Max 20
  lifestyleHabitsScore: number; // Max 20
  feedbackHighlights: string[];
  streakDays: number;
}

export interface GamificationBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'nutrition' | 'water' | 'streak' | 'culinary';
  progress: number; // 0 to 100
  unlocked: boolean;
  unlockedDate?: string;
}

