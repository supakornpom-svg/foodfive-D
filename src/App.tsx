/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EnergyComparisonCard } from './components/EnergyComparisonCard';
import { BmiExerciseCard } from './components/BmiExerciseCard';
import { WaterTrackerCard } from './components/WaterTrackerCard';
import { FoodGroupsProportionCard } from './components/FoodGroupsProportionCard';
import { FoodGroupsEducationSection } from './components/FoodGroupsEducationSection';
import { MealRecommendations } from './components/MealRecommendations';
import { DailyLogSection } from './components/DailyLogSection';
import { ProfileModal } from './components/ProfileModal';
import { FoodGroupDetailModal } from './components/FoodGroupDetailModal';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { WeeklyPlannerSection } from './components/WeeklyPlannerSection';
import { WeeklyScoreAnalyticsSection } from './components/WeeklyScoreAnalyticsSection';
import { DailyWellnessTipCard } from './components/DailyWellnessTipCard';

import {
  UserProfile,
  DailyTargets,
  LoggedMealItem,
  FoodItem,
  MealTime,
  MealPlanPreset,
  FoodGroupId,
} from './types/nutrition';
import {
  calculateDailyTargets,
  calculateIntakeTotals,
  generateSevenDaysHistory,
} from './utils/nutritionCalculators';
import { calculateWeeklyHealthScore } from './utils/gamificationCalculators';
import { THAI_RECOMMENDED_MEALS, MEAL_PLAN_PRESETS } from './data/nutritionData';
import { Utensils, Award, BookOpen, Heart, ArrowRight, ChefHat, Clock, Trophy, Calendar, Sparkles, Flame } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  gender: 'male',
  age: 28,
  weightKg: 65,
  heightCm: 172,
  activityLevel: 'moderate',
  goal: 'balance',
};

// Initial realistic default meal log for day 1
const DEFAULT_LOGS: LoggedMealItem[] = [
  {
    id: 'init_log_1',
    foodItemId: 'meal_5',
    name: 'โจ๊กข้าวกล้องอกไก่ฉีก + ไข่ลวก + ขิงสด',
    mealTime: 'breakfast',
    servings: 1,
    calories: 330,
    protein: 24,
    carbs: 40,
    fat: 7,
    fiber: 3.8,
    sodium: 460,
    foodGroups: {
      group1_protein: 2.5,
      group2_carbs: 2.0,
      group3_vegetables: 1.0,
      group4_fruits: 0,
      group5_fats: 1.0,
    },
    timestamp: '08:15',
  },
  {
    id: 'init_log_2',
    foodItemId: 'meal_1',
    name: 'ข้าวกะเพราอกไก่พริกสด + ไข่ดาวน้ำ',
    mealTime: 'lunch',
    servings: 1,
    calories: 420,
    protein: 36,
    carbs: 45,
    fat: 10,
    fiber: 4.5,
    sodium: 520,
    foodGroups: {
      group1_protein: 3.5,
      group2_carbs: 2.0,
      group3_vegetables: 1.5,
      group4_fruits: 0,
      group5_fats: 1.5,
    },
    timestamp: '12:30',
  },
  {
    id: 'init_log_3',
    foodItemId: 'snack_1',
    name: 'ฝรั่งสดกิมจู + นมถั่วเหลืองไม่หวาน',
    mealTime: 'snack',
    servings: 1,
    calories: 170,
    protein: 8,
    carbs: 26,
    fat: 3.5,
    fiber: 6.5,
    sodium: 70,
    foodGroups: {
      group1_protein: 1.0,
      group2_carbs: 0.5,
      group3_vegetables: 0,
      group4_fruits: 2.0,
      group5_fats: 0.5,
    },
    timestamp: '15:20',
  },
  {
    id: 'init_log_4',
    foodItemId: 'meal_3',
    name: 'ต้มยำกุ้งน้ำใสเห็ด 3 อย่าง + ข้าวไรซ์เบอร์รี่',
    mealTime: 'dinner',
    servings: 1,
    calories: 340,
    protein: 28,
    carbs: 42,
    fat: 4,
    fiber: 5.2,
    sodium: 590,
    foodGroups: {
      group1_protein: 2.8,
      group2_carbs: 1.8,
      group3_vegetables: 2.5,
      group4_fruits: 0,
      group5_fats: 0.5,
    },
    timestamp: '18:45',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFoodGroupModal, setSelectedFoodGroupModal] = useState<FoodGroupId | null>(null);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<FoodItem | null>(null);

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('nutri5_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return DEFAULT_PROFILE;
  });

  // Daily Meal Logs
  const [logs, setLogs] = useState<LoggedMealItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutri5_daily_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return DEFAULT_LOGS;
  });

  // Daily Water Intake (ml)
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nutri5_water_intake');
      if (saved) return parseInt(saved) || 0;
    } catch (e) {}
    return 1750;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nutri5_user_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('nutri5_daily_logs', JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('nutri5_water_intake', waterIntakeMl.toString());
    } catch (e) {}
  }, [waterIntakeMl]);

  // Derived Calculations
  const targets: DailyTargets = calculateDailyTargets(profile);
  const totals = calculateIntakeTotals(logs);

  const mealBreakdown = {
    breakfast: logs
      .filter((l) => l.mealTime === 'breakfast')
      .reduce((sum, item) => sum + item.calories, 0),
    lunch: logs
      .filter((l) => l.mealTime === 'lunch')
      .reduce((sum, item) => sum + item.calories, 0),
    dinner: logs
      .filter((l) => l.mealTime === 'dinner')
      .reduce((sum, item) => sum + item.calories, 0),
    snack: logs
      .filter((l) => l.mealTime === 'snack')
      .reduce((sum, item) => sum + item.calories, 0),
  };

  const actualFoodGroups = {
    group1_protein: totals.group1_protein,
    group2_carbs: totals.group2_carbs,
    group3_vegetables: totals.group3_vegetables,
    group4_fruits: totals.group4_fruits,
    group5_fats: totals.group5_fats,
  };

  const sevenDayHistory = generateSevenDaysHistory(
    targets.targetCalories,
    totals.calories,
    totals.protein,
    totals.carbs,
    totals.fat
  );

  const scoreBreakdown = calculateWeeklyHealthScore(
    targets,
    logs,
    waterIntakeMl,
    sevenDayHistory
  );

  // Handlers
  const handleAddFoodToJournal = (food: FoodItem, mealTime: MealTime) => {
    const newLogItem: LoggedMealItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      foodItemId: food.id,
      name: food.name,
      mealTime: mealTime || food.defaultMeal,
      servings: 1,
      calories: food.nutrition.calories,
      protein: food.nutrition.protein,
      carbs: food.nutrition.carbs,
      fat: food.nutrition.fat,
      fiber: food.nutrition.fiber,
      sodium: food.nutrition.sodium,
      foodGroups: { ...food.foodGroups },
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setLogs((prev) => [...prev, newLogItem]);
  };

  const handleAddCustomMeal = (itemData: Omit<LoggedMealItem, 'id' | 'timestamp'>) => {
    const newLogItem: LoggedMealItem = {
      ...itemData,
      id: `custom_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    setLogs((prev) => [...prev, newLogItem]);
  };

  const handleApplyPresetPlan = (preset: MealPlanPreset) => {
    const timeNow = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const newItems: LoggedMealItem[] = [
      {
        id: `preset_${Date.now()}_bf`,
        foodItemId: preset.items.breakfast.id,
        name: preset.items.breakfast.name,
        mealTime: 'breakfast',
        servings: 1,
        calories: preset.items.breakfast.nutrition.calories,
        protein: preset.items.breakfast.nutrition.protein,
        carbs: preset.items.breakfast.nutrition.carbs,
        fat: preset.items.breakfast.nutrition.fat,
        fiber: preset.items.breakfast.nutrition.fiber,
        sodium: preset.items.breakfast.nutrition.sodium,
        foodGroups: { ...preset.items.breakfast.foodGroups },
        timestamp: '08:00',
      },
      {
        id: `preset_${Date.now()}_lu`,
        foodItemId: preset.items.lunch.id,
        name: preset.items.lunch.name,
        mealTime: 'lunch',
        servings: 1,
        calories: preset.items.lunch.nutrition.calories,
        protein: preset.items.lunch.nutrition.protein,
        carbs: preset.items.lunch.nutrition.carbs,
        fat: preset.items.lunch.nutrition.fat,
        fiber: preset.items.lunch.nutrition.fiber,
        sodium: preset.items.lunch.nutrition.sodium,
        foodGroups: { ...preset.items.lunch.foodGroups },
        timestamp: '12:30',
      },
      {
        id: `preset_${Date.now()}_di`,
        foodItemId: preset.items.dinner.id,
        name: preset.items.dinner.name,
        mealTime: 'dinner',
        servings: 1,
        calories: preset.items.dinner.nutrition.calories,
        protein: preset.items.dinner.nutrition.protein,
        carbs: preset.items.dinner.nutrition.carbs,
        fat: preset.items.dinner.nutrition.fat,
        fiber: preset.items.dinner.nutrition.fiber,
        sodium: preset.items.dinner.nutrition.sodium,
        foodGroups: { ...preset.items.dinner.foodGroups },
        timestamp: '18:30',
      },
      {
        id: `preset_${Date.now()}_sn`,
        foodItemId: preset.items.snack.id,
        name: preset.items.snack.name,
        mealTime: 'snack',
        servings: 1,
        calories: preset.items.snack.nutrition.calories,
        protein: preset.items.snack.nutrition.protein,
        carbs: preset.items.snack.nutrition.carbs,
        fat: preset.items.snack.nutrition.fat,
        fiber: preset.items.snack.nutrition.fiber,
        sodium: preset.items.snack.nutrition.sodium,
        foodGroups: { ...preset.items.snack.foodGroups },
        timestamp: '15:00',
      },
    ];

    setLogs(newItems);
    setActiveTab('journal');
  };

  const handleRemoveLogItem = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllLogs = () => {
    setLogs([]);
    setWaterIntakeMl(0);
  };

  const handleRestoreSampleLogs = () => {
    setLogs(DEFAULT_LOGS);
    setWaterIntakeMl(1750);
  };

  return (
    <div className="min-h-screen flex flex-col bg-wellness-mesh text-neutral-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        targets={targets}
        currentWaterMl={waterIntakeMl}
        targetWaterMl={targets.targetWaterMl}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* Hero Section Banner (Present on Overview tab) */}
        {activeTab === 'overview' && (
          <div className="relative rounded-3xl overflow-hidden border border-emerald-950/20 bg-gradient-to-br from-emerald-950 via-teal-950 to-neutral-900 text-white shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-xs text-emerald-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>แดชบอร์ดสุขภาพไทย 5 หมู่</span>
                  <span aria-hidden="true">·</span>
                  <span>มาตรฐานกรมอนามัย สูตร 2:1:1</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight text-balance-thai">
                  รักษาสมดุลโภชนาการอาหาร 5 หมู่ เพื่อสุขภาพที่ยั่งยืน
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed">
                  ติดตามพลังงานและสารอาหารที่บริโภคจริงในแต่ละวัน เปรียบเทียบกับความต้องการของร่างกาย (TDEE: {targets.tdee} kcal) และจัดสัดส่วนจานสุขภาพตามหลัก ผัก 2 ส่วน ข้าว 1 ส่วน เนื้อสัตว์ 1 ส่วน
                </p>

                {/* Key Metric Highlights in Hero */}
                <div className="grid grid-cols-3 gap-2.5 max-w-lg pt-1">
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] text-emerald-200 block">สัดส่วนจาน</span>
                    <strong className="text-xs sm:text-sm font-bold text-white block">สูตร 2:1:1</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] text-emerald-200 block">พลังงานเป้าหมาย</span>
                    <strong className="text-xs sm:text-sm font-bold text-white block font-mono-numbers">{targets.tdee} kcal</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] text-emerald-200 block">น้ำดื่มแนะนำ</span>
                    <strong className="text-xs sm:text-sm font-bold text-white block font-mono-numbers">{targets.targetWaterMl} ml</strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('journal')}
                    className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-all flex items-center gap-2 shadow-sm font-medium"
                  >
                    <Utensils className="w-3.5 h-3.5 text-emerald-950" />
                    <span>บันทึกอาหารวันนี้ ({totals.calories} kcal)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('meals')}
                    className="py-2.5 px-4 text-xs font-semibold rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs border border-white/15 transition-all flex items-center gap-1.5"
                  >
                    <span>ดูเมนูแนะนำสุขภาพ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Culinary Hero Image */}
              <div className="lg:col-span-5 h-64 sm:h-72 lg:h-full min-h-[320px] relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"
                  alt="สำรับอาหารสุขภาพไทยตามสูตร 2:1:1 ครบ 5 หมู่"
                  className="w-full h-full object-cover object-center brightness-95"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-950 via-emerald-950/40 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Overview & Energy Comparison */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* AI Daily Wellness Tip */}
            <DailyWellnessTipCard
              targets={targets}
              totals={totals}
              waterIntakeMl={waterIntakeMl}
              actualFoodGroups={actualFoodGroups}
              scoreBreakdown={scoreBreakdown}
              profile={profile}
              logs={logs}
            />

            <BmiExerciseCard
              bmiAnalysis={targets.bmiAnalysis}
              profile={profile}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />

            <WaterTrackerCard
              currentWaterMl={waterIntakeMl}
              targetWaterMl={targets.targetWaterMl}
              profile={profile}
              onUpdateWater={(amount) => setWaterIntakeMl(amount)}
              onResetWater={() => setWaterIntakeMl(0)}
            />

            <EnergyComparisonCard
              actualCalories={totals.calories}
              targets={targets}
              macros={totals}
              mealBreakdown={mealBreakdown}
              sevenDayHistory={sevenDayHistory}
              onOpenJournal={() => setActiveTab('journal')}
            />

            <FoodGroupsProportionCard
              actualFoodGroups={actualFoodGroups}
              targets={targets}
              onSelectFoodGroup={(groupId) => setSelectedFoodGroupModal(groupId)}
            />

            {/* Quick Widgets: Health Score Teaser & Weekly Planner Teaser */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Health Score & Gamification Teaser */}
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-emerald-900/40 hover:border-emerald-600/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>คะแนนสุขภาพ & Gamification</span>
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono-numbers bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Streak ต่อเนื่อง
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white">
                    ประเมินพฤติกรรมการทานอาหารรายสัปดาห์
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    วัดผลความสมบูรณ์ของอาหาร 5 หมู่ แคลอรี่ และการดื่มน้ำออกมาเป็นคะแนนเต็ม 100 พร้อมสะสมเหรียญรางวัลความสำเร็จ
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono-numbers">
                    ประเมิน 4 มิติสุขภาพ
                  </span>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <span>ดูคะแนน & เหรียญรางวัล</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Weekly Planner & Ingredient Matcher Teaser */}
              <div className="wellness-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>วางแผนมื้ออาหาร & ตู้เย็น</span>
                    </span>
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      ตาราง 7 วัน
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                    วางแผนล่วงหน้า & สร้างรายการซื้อของอัตโนมัติ
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    จัดสรรเมนูสุขภาพ 4 มื้อล่วงหน้า สรุปรายการซื้อวัตถุดิบแยกตามแผนก หรือค้นหาเมนูจากวัตถุดิบที่มีในตู้เย็นได้ทันที
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveTab('meals')}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    ค้นหาจากตู้เย็น →
                  </button>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="py-1.5 px-3.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                  >
                    <span>เปิดตารางวางแผน 7 วัน</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Preview of Recommendations */}
            <div className="wellness-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                    เมนูสุขภาพแนะนำสำหรับคุณวันนี้
                  </h3>
                  <p className="text-xs text-neutral-500">
                    คัดสรรจานเด่นที่มีสัดส่วน 5 หมู่ สมดุลตามสูตร 2:1:1
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('meals')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  ดูทั้งหมด {THAI_RECOMMENDED_MEALS.length} เมนู
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THAI_RECOMMENDED_MEALS.slice(0, 3).map((dish) => (
                  <div
                    key={dish.id}
                    className="border border-neutral-200/80 rounded-2xl p-4 bg-white hover:border-emerald-300 hover:shadow-xs flex flex-col justify-between transition-all group"
                  >
                    <div>
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-emerald-700">
                            {dish.defaultMeal === 'breakfast' ? 'มื้อเช้า' : dish.defaultMeal === 'lunch' ? 'มื้อกลางวัน' : 'มื้อเย็น'}
                          </span>
                          {dish.cookingTimeMinutes && (
                            <span className="text-[11px] text-neutral-400 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {dish.cookingTimeMinutes} น.
                            </span>
                          )}
                        </div>
                        <span className="font-mono-numbers font-bold text-neutral-900">
                          {dish.nutrition.calories} kcal
                        </span>
                      </div>

                      <h4
                        onClick={() => setSelectedRecipeModal(dish)}
                        className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {dish.name}
                      </h4>

                      {dish.difficulty && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            <ChefHat className="w-3 h-3 text-amber-600" />
                            {dish.difficulty}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedRecipeModal(dish)}
                        className="py-1 px-2.5 text-xs font-semibold rounded-lg border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 text-neutral-700 transition-colors flex items-center gap-1"
                        title="ดูวิธีเตรียมวัตถุดิบและวิธีปรุงสำหรับมือใหม่"
                      >
                        <ChefHat className="w-3 h-3 text-emerald-600" />
                        <span>ดูวิธีทำ</span>
                      </button>

                      <button
                        onClick={() => handleAddFoodToJournal(dish, dish.defaultMeal)}
                        className="py-1 px-3 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors shadow-2xs"
                      >
                        + บันทึก
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 5 Food Groups Deep Dive & 2:1:1 Plate */}
        {activeTab === 'food_groups' && (
          <div className="space-y-6">
            <FoodGroupsEducationSection
              onSelectFoodGroup={(groupId) => setSelectedFoodGroupModal(groupId)}
              actualFoodGroups={actualFoodGroups}
              targets={targets}
            />

            <FoodGroupsProportionCard
              actualFoodGroups={actualFoodGroups}
              targets={targets}
              onSelectFoodGroup={(groupId) => setSelectedFoodGroupModal(groupId)}
            />
          </div>
        )}

        {/* Tab 3: Recommended Meals & Meal Plans */}
        {activeTab === 'meals' && (
          <MealRecommendations
            onAddFoodToJournal={handleAddFoodToJournal}
            onApplyPresetPlan={handleApplyPresetPlan}
            profileHealthConstraints={profile.healthConstraints}
          />
        )}

        {/* Tab 4: Weekly Meal Planner & Grocery Shopping List */}
        {activeTab === 'planner' && (
          <WeeklyPlannerSection
            onViewRecipe={(dish) => setSelectedRecipeModal(dish)}
            onAddFoodToJournal={(meal, targetMeal) => handleAddFoodToJournal(meal, targetMeal || meal.defaultMeal)}
          />
        )}

        {/* Tab 5: Gamification & Weekly Health Score */}
        {activeTab === 'analytics' && (
          <WeeklyScoreAnalyticsSection
            targets={targets}
            logs={logs}
            waterIntakeMl={waterIntakeMl}
            sevenDayHistory={sevenDayHistory}
            profile={profile}
            onOpenJournal={() => setActiveTab('journal')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* Tab 6: Daily Log & Meal Journal */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            <DailyLogSection
              logs={logs}
              onAddCustomMeal={handleAddCustomMeal}
              onAddPresetFood={handleAddFoodToJournal}
              onRemoveLogItem={handleRemoveLogItem}
              onClearAllLogs={handleClearAllLogs}
              onRestoreSampleLogs={handleRestoreSampleLogs}
              currentWaterMl={waterIntakeMl}
              targetWaterMl={targets.targetWaterMl}
              onUpdateWater={(ml) => setWaterIntakeMl(ml)}
            />

            {/* Quick energy balance snapshot below journal */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 block mb-1">
                  สรุปภาพรวมพลังงานวันนี้
                </span>
                <h4 className="text-lg font-bold">
                  บริโภคแล้ว: <span className="font-mono-numbers text-emerald-300">{totals.calories}</span> / {targets.targetCalories} kcal
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  โปรตีน: {totals.protein}g · คาร์โบไฮเดรต: {totals.carbs}g · ไขมัน: {totals.fat}g · ใยอาหาร: {totals.fiber.toFixed(1)}g
                </p>
              </div>

              <button
                onClick={() => setActiveTab('overview')}
                className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
              >
                ดูกราฟเปรียบเทียบพลังงาน
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Attribution & Guidelines */}
      <footer className="mt-12 border-t border-neutral-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800">Nutri5</span>
            <span aria-hidden="true">·</span>
            <span>แดชบอร์ดสุขภาพอาหาร 5 หมู่</span>
            <span aria-hidden="true">·</span>
            <span>อ้างอิงสูตร 2:1:1 สำนักโภชนาการ กรมอนามัย</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-neutral-900 transition-colors"
            >
              ตั้งค่าสรีระ / TDEE
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setSelectedFoodGroupModal('group1')}
              className="hover:text-neutral-900 transition-colors"
            >
              คู่มืออาหาร 5 หมู่
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isProfileModalOpen && (
        <ProfileModal
          currentProfile={profile}
          onSaveProfile={(newProf) => setProfile(newProf)}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {selectedFoodGroupModal && (
        <FoodGroupDetailModal
          groupId={selectedFoodGroupModal}
          onClose={() => setSelectedFoodGroupModal(null)}
        />
      )}

      {selectedRecipeModal && (
        <RecipeDetailModal
          meal={selectedRecipeModal}
          onClose={() => setSelectedRecipeModal(null)}
          onAddToJournal={(meal, mealTime) => {
            handleAddFoodToJournal(meal, mealTime || meal.defaultMeal);
            setSelectedRecipeModal(null);
          }}
        />
      )}
    </div>
  );
}
