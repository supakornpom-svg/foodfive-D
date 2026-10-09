import React, { useState } from 'react';
import { FoodItem, MealPlanPreset, MealTime, HealthConstraint } from '../types/nutrition';
import { THAI_RECOMMENDED_MEALS, MEAL_PLAN_PRESETS } from '../data/nutritionData';
import { HEALTH_CONSTRAINTS_LIST } from '../data/healthConstraintsData';
import { RecipeDetailModal } from './RecipeDetailModal';
import { IngredientMatcherSection } from './IngredientMatcherSection';
import {
  Plus,
  Search,
  Check,
  Sparkles,
  Eye,
  Flame,
  UtensilsCrossed,
  ChefHat,
  Clock,
  BookOpen,
  ShieldAlert,
  Refrigerator,
  Filter,
} from 'lucide-react';

interface MealRecommendationsProps {
  onAddFoodToJournal: (food: FoodItem, mealTime: MealTime) => void;
  onApplyPresetPlan: (preset: MealPlanPreset) => void;
  profileHealthConstraints?: HealthConstraint[];
}

export const MealRecommendations: React.FC<MealRecommendationsProps> = ({
  onAddFoodToJournal,
  onApplyPresetPlan,
  profileHealthConstraints = [],
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'catalog' | 'matcher'>('catalog');
  const [activeMealFilter, setActiveMealFilter] = useState<string>('all');
  const [activeGoalFilter, setActiveGoalFilter] = useState<string>('all');
  const [activeConstraintFilter, setActiveConstraintFilter] = useState<HealthConstraint | 'all'>('all');
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<FoodItem | null>(null);
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  // Filter logic
  const filteredMeals = THAI_RECOMMENDED_MEALS.filter((meal) => {
    // Meal time filter
    if (activeMealFilter !== 'all' && meal.defaultMeal !== activeMealFilter) {
      return false;
    }
    // Goal filter
    if (activeGoalFilter !== 'all') {
      if (!meal.suitableGoals?.includes(activeGoalFilter as any)) {
        return false;
      }
    }
    // Difficulty filter
    if (activeDifficultyFilter !== 'all') {
      if (activeDifficultyFilter === 'beginner' && !meal.difficulty?.includes('มือใหม่')) {
        return false;
      }
    }
    // Health Constraint filter
    if (activeConstraintFilter !== 'all') {
      if (activeConstraintFilter === 'low_sodium' && meal.nutrition.sodium > 600) {
        return false;
      }
      if (activeConstraintFilter === 'diabetes' && meal.nutrition.carbs > 45 && meal.nutrition.fiber < 5) {
        return false;
      }
      if (activeConstraintFilter === 'gerd' && (meal.tags.includes('รสจัด') || meal.name.includes('ส้มตำ') || meal.name.includes('ต้มยำ'))) {
        return false;
      }
      if (activeConstraintFilter === 'vegetarian' && !meal.isVegetarian) {
        return false;
      }
      if (activeConstraintFilter === 'no_seafood' && (meal.name.includes('กุ้ง') || meal.name.includes('ปลา'))) {
        return false;
      }
      if (activeConstraintFilter === 'no_dairy' && (meal.name.includes('โยเกิร์ต') || meal.description.includes('นมวัว'))) {
        return false;
      }
      if (activeConstraintFilter === 'no_nuts' && (meal.name.includes('อัลมอนด์') || meal.description.includes('ถั่วลิสง'))) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = meal.name.toLowerCase().includes(q);
      const matchDesc = meal.description.toLowerCase().includes(q);
      const matchTags = meal.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  const handleQuickAdd = (meal: FoodItem, targetMeal?: MealTime) => {
    onAddFoodToJournal(meal, targetMeal || meal.defaultMeal);
    setAddedItemFeedback(meal.id);
    setTimeout(() => {
      setAddedItemFeedback(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Main Tab Toggle between Recipe Catalog vs Ingredient Matcher */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('catalog')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMainTab === 'catalog'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <ChefHat className="w-4 h-4 text-emerald-400" />
            <span>คลังเมนูแนะนำ & สำรับสุขภาพ</span>
          </button>

          <button
            onClick={() => setActiveMainTab('matcher')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMainTab === 'matcher'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <Refrigerator className="w-4 h-4 text-emerald-400" />
            <span>ค้นหาเมนูจากวัตถุดิบในตู้เย็น (Ingredient Matcher)</span>
          </button>
        </div>

        {profileHealthConstraints.length > 0 && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>เปิดใช้งานตัวกรองสุขภาพของคุณ ({profileHealthConstraints.length} ข้อ)</span>
          </div>
        )}
      </div>

      {/* Render Ingredient Matcher if activeMainTab === 'matcher' */}
      {activeMainTab === 'matcher' ? (
        <IngredientMatcherSection
          onViewRecipe={(meal) => setSelectedMealForDetail(meal)}
          onAddFoodToJournal={handleQuickAdd}
          activeConstraints={profileHealthConstraints}
        />
      ) : (
        <>
          {/* 1-Day Balanced Meal Sets (สำรับแนะนำ 1 วัน) */}
          <div className="wellness-card rounded-2xl p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
                  <span>จัดสำรับอาหารครบวงจร</span>
                  <span aria-hidden="true">·</span>
                  <span>คำนวณครบ 5 หมู่</span>
                  <span aria-hidden="true">·</span>
                  <span>พร้อมทาน 4 มื้อ</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <span>จัดเซ็ตเมนู 1 วัน สุขภาพดีตามเป้าหมาย (Daily Meal Plan)</span>
                </h2>
              </div>
              <p className="text-xs text-neutral-500">
                เลือกเซ็ตอาหารที่คำนวณสัดส่วน 5 หมู่ มาให้ครบทั้งวัน
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {MEAL_PLAN_PRESETS.map((preset) => {
                return (
                  <div
                    key={preset.id}
                    className="border border-neutral-200 rounded-xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between bg-neutral-50/40"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span className="font-semibold text-emerald-800">
                          {preset.goal === 'balance'
                            ? 'สูตรสมดุล 2:1:1'
                            : preset.goal === 'weight_loss'
                            ? 'สูตรคุมแคลอรี่'
                            : 'สูตรโปรตีนสูง'}
                        </span>
                        <span className="font-mono-numbers font-bold text-neutral-900">
                          ~{preset.totalCalories} kcal
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-neutral-900">
                        {preset.title}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1">
                        {preset.subtitle}
                      </p>

                      {/* Meals inside preset list */}
                      <div className="mt-4 space-y-2 border-t border-neutral-200/60 pt-3 text-xs text-neutral-700">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">เช้า:</span>
                          <button
                            onClick={() => setSelectedMealForDetail(preset.items.breakfast)}
                            className="font-medium truncate max-w-[190px] text-left hover:text-emerald-700 hover:underline"
                            title="คลิกเพื่อดูวิธีทำ"
                          >
                            {preset.items.breakfast.name}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">กลางวัน:</span>
                          <button
                            onClick={() => setSelectedMealForDetail(preset.items.lunch)}
                            className="font-medium truncate max-w-[190px] text-left hover:text-emerald-700 hover:underline"
                            title="คลิกเพื่อดูวิธีทำ"
                          >
                            {preset.items.lunch.name}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">เย็น:</span>
                          <button
                            onClick={() => setSelectedMealForDetail(preset.items.dinner)}
                            className="font-medium truncate max-w-[190px] text-left hover:text-emerald-700 hover:underline"
                            title="คลิกเพื่อดูวิธีทำ"
                          >
                            {preset.items.dinner.name}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">ว่าง:</span>
                          <button
                            onClick={() => setSelectedMealForDetail(preset.items.snack)}
                            className="font-medium truncate max-w-[190px] text-left hover:text-emerald-700 hover:underline"
                            title="คลิกเพื่อดูวิธีทำ"
                          >
                            {preset.items.snack.name}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onApplyPresetPlan(preset)}
                      className="mt-5 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      นำเซ็ตนี้ไปใช้ในบันทึกวันนี้
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Dishes Catalog */}
          <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
                  <span>คลังเมนูอาหารสุขภาพไทย</span>
                  <span aria-hidden="true">·</span>
                  <span>วัตถุดิบแยก 5 หมู่</span>
                  <span aria-hidden="true">·</span>
                  <span>มีตัวกรองข้อจำกัดสุขภาพ & วิธีปรุงสำหรับมือใหม่</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ChefHat className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span>เมนูแนะนำที่เหมาะสมกับโภชนาการ 5 หมู่ & สุขภาพเฉพาะบุคคล</span>
                </h2>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อเมนู, วัตถุดิบ..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-neutral-50/50"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              {/* Row 1: Meal times & Difficulty */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Meal filter segmented control */}
                <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto">
                  {[
                    { id: 'all', label: 'ทุกมื้อ' },
                    { id: 'breakfast', label: 'มื้อเช้า' },
                    { id: 'lunch', label: 'มื้อกลางวัน' },
                    { id: 'dinner', label: 'มื้อเย็น' },
                    { id: 'snack', label: 'ของว่าง & สุขภาพ' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveMealFilter(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        activeMealFilter === tab.id
                          ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Beginner Quick Toggle */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-neutral-400 mr-0.5">ระดับ:</span>
                    <button
                      onClick={() => setActiveDifficultyFilter('all')}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        activeDifficultyFilter === 'all'
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      onClick={() => setActiveDifficultyFilter('beginner')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                        activeDifficultyFilter === 'beginner'
                          ? 'bg-amber-500 text-white'
                          : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80'
                      }`}
                    >
                      <ChefHat className="w-3 h-3" />
                      มือใหม่หัดทำง่ายมาก
                    </button>
                  </div>

                  {/* Goal filter buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    <span className="text-neutral-400 mr-0.5 hidden sm:inline">เป้าหมาย:</span>
                    {[
                      { id: 'all', label: 'ทุกเป้าหมาย' },
                      { id: 'balance', label: 'สมดุล 5 หมู่' },
                      { id: 'weight_loss', label: 'ลดไขมัน' },
                      { id: 'muscle_gain', label: 'สร้างกล้าม' },
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setActiveGoalFilter(goal.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                          activeGoalFilter === goal.id
                            ? 'bg-emerald-100 text-emerald-800 font-semibold'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        {goal.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Health Constraints & Dietary Restrictions Filter */}
              <div className="p-3 bg-neutral-50/70 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                <span className="text-neutral-700 font-semibold flex items-center gap-1 shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>ตัวกรองข้อจำกัดสุขภาพ:</span>
                </span>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  <button
                    onClick={() => setActiveConstraintFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      activeConstraintFilter === 'all'
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    ไม่มีข้อจำกัด
                  </button>

                  {HEALTH_CONSTRAINTS_LIST.map((c) => {
                    const isSelected = activeConstraintFilter === c.id;
                    const isProfileSelected = profileHealthConstraints.includes(c.id);

                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveConstraintFilter(isSelected ? 'all' : c.id)}
                        className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                            : isProfileSelected
                            ? 'bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold'
                            : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{c.shortLabel}</span>
                        {isProfileSelected && !isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Meal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMeals.map((meal) => {
                const isAdded = addedItemFeedback === meal.id;

                // Health constraint warning badges
                const isHighSodium = meal.nutrition.sodium >= 600;
                const isSeafood = meal.name.includes('กุ้ง') || meal.name.includes('ปลา');
                const isNuts = meal.name.includes('อัลมอนด์') || meal.description.includes('ถั่วลิสง');

                return (
                  <div
                    key={meal.id}
                    className="border border-neutral-200 rounded-xl p-4.5 bg-white hover:border-neutral-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Category, Difficulty & Calories */}
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-emerald-700">
                            {meal.defaultMeal === 'breakfast'
                              ? 'มื้อเช้า'
                              : meal.defaultMeal === 'lunch'
                              ? 'มื้อกลางวัน'
                              : meal.defaultMeal === 'dinner'
                              ? 'มื้อเย็น'
                              : 'ของว่าง'}
                          </span>
                          {meal.cookingTimeMinutes && (
                            <span className="text-[11px] text-neutral-400 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {meal.cookingTimeMinutes} นาที
                            </span>
                          )}
                        </div>

                        <span className="font-mono-numbers font-bold text-neutral-900 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          {meal.nutrition.calories} kcal
                        </span>
                      </div>

                      {/* Title & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => setSelectedMealForDetail(meal)}
                          className="text-base font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                        >
                          {meal.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {meal.difficulty && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            <ChefHat className="w-3 h-3 text-amber-600" />
                            {meal.difficulty}
                          </span>
                        )}

                        {meal.isVegetarian && (
                          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            มังสวิรัติ
                          </span>
                        )}

                        {isHighSodium ? (
                          <span className="inline-flex items-center text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                            โซเดียม {meal.nutrition.sodium}mg
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-medium text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                            โซเดียมต่ำ {meal.nutrition.sodium}mg
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                        {meal.description}
                      </p>

                      {/* 5 Food Groups serving breakdown */}
                      <div className="mt-3.5 pt-3 border-t border-neutral-100 grid grid-cols-5 gap-1 text-center">
                        <div className="bg-rose-50/60 p-1 rounded">
                          <span className="text-[10px] text-rose-700 block font-medium">โปรตีน</span>
                          <span className="text-xs font-mono-numbers font-bold text-rose-900">
                            {meal.foodGroups.group1_protein}
                          </span>
                        </div>
                        <div className="bg-amber-50/60 p-1 rounded">
                          <span className="text-[10px] text-amber-700 block font-medium">คาร์บ</span>
                          <span className="text-xs font-mono-numbers font-bold text-amber-900">
                            {meal.foodGroups.group2_carbs}
                          </span>
                        </div>
                        <div className="bg-emerald-50/60 p-1 rounded">
                          <span className="text-[10px] text-emerald-700 block font-medium">ผัก</span>
                          <span className="text-xs font-mono-numbers font-bold text-emerald-900">
                            {meal.foodGroups.group3_vegetables}
                          </span>
                        </div>
                        <div className="bg-purple-50/60 p-1 rounded">
                          <span className="text-[10px] text-purple-700 block font-medium">ผลไม้</span>
                          <span className="text-xs font-mono-numbers font-bold text-purple-900">
                            {meal.foodGroups.group4_fruits}
                          </span>
                        </div>
                        <div className="bg-sky-50/60 p-1 rounded">
                          <span className="text-[10px] text-sky-700 block font-medium">ไขมัน</span>
                          <span className="text-xs font-mono-numbers font-bold text-sky-900">
                            {meal.foodGroups.group5_fats}
                          </span>
                        </div>
                      </div>

                      {/* Macros Line */}
                      <div className="mt-3 text-[11px] text-neutral-500 flex items-center justify-between font-mono-numbers">
                        <span>P: {meal.nutrition.protein}g</span>
                        <span>C: {meal.nutrition.carbs}g</span>
                        <span>F: {meal.nutrition.fat}g</span>
                        <span>ใยอาหาร: {meal.nutrition.fiber}g</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMealForDetail(meal)}
                        className="flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-lg border border-neutral-200 text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                        title="ดูวิธีเตรียมวัตถุดิบและขั้นตอนปรุงสำหรับมือใหม่"
                      >
                        <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                        <span>วิธีเตรียม & ปรุง</span>
                      </button>

                      <button
                        onClick={() => handleQuickAdd(meal)}
                        disabled={isAdded}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>เพิ่มแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>บันทึก</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredMeals.length === 0 && (
              <div className="text-center py-12 text-neutral-500">
                <UtensilsCrossed className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                <p className="text-sm">ไม่พบเมนูที่ตรงกับข้อจำกัดสุขภาพหรือคำค้นหาที่เลือก</p>
                <button
                  onClick={() => {
                    setActiveMealFilter('all');
                    setActiveGoalFilter('all');
                    setActiveConstraintFilter('all');
                    setActiveDifficultyFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-xs text-emerald-700 font-semibold hover:underline"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Full Culinary Recipe & Cooking Modal */}
      <RecipeDetailModal
        meal={selectedMealForDetail}
        onClose={() => setSelectedMealForDetail(null)}
        onAddToJournal={(meal, targetMeal) => onAddFoodToJournal(meal, targetMeal || meal.defaultMeal)}
      />
    </div>
  );
};


