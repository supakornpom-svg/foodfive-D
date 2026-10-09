import React, { useState } from 'react';
import {
  WeeklyMealPlan,
  DayOfWeek,
  FoodItem,
  GroceryItem,
  MealTime,
  HealthConstraint,
} from '../types/nutrition';
import { THAI_RECOMMENDED_MEALS } from '../data/nutritionData';
import {
  DAYS_OF_WEEK,
  getDefaultWeeklyMealPlan,
  generateGroceryListFromWeeklyPlan,
} from '../utils/mealPlannerHelpers';
import {
  Calendar,
  ShoppingCart,
  Plus,
  RefreshCw,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChefHat,
  Sparkles,
  Flame,
  Clock,
  Trash2,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface WeeklyPlannerSectionProps {
  onViewRecipe: (meal: FoodItem) => void;
  onAddFoodToJournal: (meal: FoodItem, targetMeal?: MealTime) => void;
}

export const WeeklyPlannerSection: React.FC<WeeklyPlannerSectionProps> = ({
  onViewRecipe,
  onAddFoodToJournal,
}) => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan>(() => {
    try {
      const saved = localStorage.getItem('nutri5_weekly_meal_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return getDefaultWeeklyMealPlan();
  });

  const [activeDay, setActiveDay] = useState<DayOfWeek>('mon');
  const [activeViewMode, setActiveViewMode] = useState<'planner' | 'grocery'>('planner');
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutri5_grocery_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generateGroceryListFromWeeklyPlan(getDefaultWeeklyMealPlan());
  });

  const [copiedGrocery, setCopiedGrocery] = useState(false);
  const [selectingMealFor, setSelectingMealFor] = useState<{ day: DayOfWeek; mealTime: MealTime } | null>(null);

  // Sync weekly plan to localStorage and auto-generate grocery list if requested
  const updateWeeklyPlan = (newPlan: WeeklyMealPlan) => {
    setWeeklyPlan(newPlan);
    try {
      localStorage.setItem('nutri5_weekly_meal_plan', JSON.stringify(newPlan));
    } catch (e) {}
    const newGroceries = generateGroceryListFromWeeklyPlan(newPlan);
    setGroceryList(newGroceries);
    try {
      localStorage.setItem('nutri5_grocery_list', JSON.stringify(newGroceries));
    } catch (e) {}
  };

  const handleResetToDefault = () => {
    const def = getDefaultWeeklyMealPlan();
    updateWeeklyPlan(def);
  };

  const handleToggleGroceryItem = (id: string) => {
    const updated = groceryList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setGroceryList(updated);
    try {
      localStorage.setItem('nutri5_grocery_list', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCopyGroceryList = () => {
    const grouped: Record<string, string[]> = {};
    groceryList.forEach((item) => {
      if (!grouped[item.categoryLabel]) grouped[item.categoryLabel] = [];
      grouped[item.categoryLabel].push(
        `${item.checked ? '[✓]' : '[ ]'} ${item.name} (${item.quantityEst})`
      );
    });

    let text = `🛒 รายการซื้อวัตถุดิบอาหาร 5 หมู่ประจำสัปดาห์ (Nutri5 Grocery List)\n\n`;
    Object.entries(grouped).forEach(([cat, items]) => {
      text += `📂 ${cat}:\n${items.join('\n')}\n\n`;
    });

    navigator.clipboard?.writeText(text);
    setCopiedGrocery(true);
    setTimeout(() => setCopiedGrocery(false), 2000);
  };

  const handleAssignMeal = (dish: FoodItem) => {
    if (!selectingMealFor) return;
    const { day, mealTime } = selectingMealFor;
    const currentDayPlan = weeklyPlan[day] || { dayOfWeek: day, dayLabel: day };
    const updatedPlan: WeeklyMealPlan = {
      ...weeklyPlan,
      [day]: {
        ...currentDayPlan,
        [mealTime]: dish,
      },
    };
    updateWeeklyPlan(updatedPlan);
    setSelectingMealFor(null);
  };

  const currentDayPlan = weeklyPlan[activeDay];
  const dayMeals = [
    { time: 'breakfast' as MealTime, label: 'มื้อเช้า', meal: currentDayPlan?.breakfast },
    { time: 'lunch' as MealTime, label: 'มื้อกลางวัน', meal: currentDayPlan?.lunch },
    { time: 'dinner' as MealTime, label: 'มื้อเย็น', meal: currentDayPlan?.dinner },
    { time: 'snack' as MealTime, label: 'ของว่าง & สุขภาพ', meal: currentDayPlan?.snack },
  ];

  const dayTotalCalories = dayMeals.reduce((sum, m) => sum + (m.meal?.nutrition.calories || 0), 0);
  const dayTotalProtein = dayMeals.reduce((sum, m) => sum + (m.meal?.nutrition.protein || 0), 0);
  const dayTotalVeg = dayMeals.reduce((sum, m) => sum + (m.meal?.foodGroups.group3_vegetables || 0), 0);

  const checkedCount = groceryList.filter(g => g.checked).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="wellness-card rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
              <span>เครื่องมือวางแผนและจัดการอาหาร</span>
              <span aria-hidden="true">·</span>
              <span>ตาราง 7 วัน</span>
              <span aria-hidden="true">·</span>
              <span>คำนวณวัตถุดิบอัตโนมัติ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-emerald-700" />
              </div>
              <span>ตารางวางแผนมื้ออาหารล่วงหน้า & รายการซื้อวัตถุดิบ (Weekly Planner)</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-1 bg-neutral-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveViewMode('planner')}
                className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeViewMode === 'planner'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>ตารางมื้ออาหาร 7 วัน</span>
              </button>

              <button
                onClick={() => setActiveViewMode('grocery')}
                className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeViewMode === 'grocery'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                <span>รายการซื้อของ ({groceryList.length})</span>
              </button>
            </div>

            <button
              onClick={handleResetToDefault}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-colors"
              title="รีเซ็ตตารางเป็นสำรับแนะนำสมดุล 5 หมู่"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode 1: Planner */}
        {activeViewMode === 'planner' && (
          <div className="mt-6 space-y-6">
            {/* Days Tabs */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {DAYS_OF_WEEK.map((d) => {
                const plan = weeklyPlan[d.id];
                const cal = (plan?.breakfast?.nutrition.calories || 0) +
                  (plan?.lunch?.nutrition.calories || 0) +
                  (plan?.dinner?.nutrition.calories || 0) +
                  (plan?.snack?.nutrition.calories || 0);

                const isActive = activeDay === d.id;

                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDay(d.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs text-emerald-950 font-bold'
                        : 'border-neutral-200/80 bg-neutral-50/50 hover:bg-white text-neutral-600'
                    }`}
                  >
                    <span className="text-xs sm:text-sm block">{d.label}</span>
                    <span className="text-[10px] sm:text-xs font-mono-numbers block mt-1 text-neutral-500">
                      {cal > 0 ? `${cal} kcal` : '-'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Current Day Daily Summary Bar */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-neutral-900">
                  {DAYS_OF_WEEK.find(d => d.id === activeDay)?.fullLabel}
                </span>
                <span className="text-neutral-400">|</span>
                <div className="flex items-center gap-3 font-mono-numbers">
                  <span className="flex items-center gap-1 font-semibold text-neutral-800">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    พลังงานรวม: {dayTotalCalories} kcal
                  </span>
                  <span>·</span>
                  <span>โปรตีน: {dayTotalProtein}g</span>
                  <span>·</span>
                  <span>ผัก: {dayTotalVeg.toFixed(1)} ทัพพี</span>
                </div>
              </div>

              <div className="text-neutral-500">
                คลิกเปลี่ยนเมนู หรือกดดูขั้นตอนการปรุงสำหรับมือใหม่ได้ทันที
              </div>
            </div>

            {/* Meals of Selected Day Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dayMeals.map((item) => {
                const meal = item.meal;
                return (
                  <div
                    key={item.time}
                    className="border border-neutral-200 rounded-xl p-4 bg-white flex flex-col justify-between hover:border-neutral-300 transition-all shadow-2xs"
                  >
                    <div>
                      {/* Meal Label & Cal */}
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span className="font-bold text-emerald-800">
                          {item.label}
                        </span>
                        {meal && (
                          <span className="font-mono-numbers font-semibold text-neutral-900">
                            {meal.nutrition.calories} kcal
                          </span>
                        )}
                      </div>

                      {meal ? (
                        <div>
                          <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">
                            {meal.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                            {meal.description}
                          </p>

                          {/* Food group portions preview */}
                          <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[10px] bg-neutral-50 p-1.5 rounded-lg border border-neutral-100">
                            <div>
                              <span className="text-rose-700 block">โปรตีน</span>
                              <span className="font-mono-numbers font-bold text-rose-950">
                                {meal.foodGroups.group1_protein}
                              </span>
                            </div>
                            <div>
                              <span className="text-amber-700 block">คาร์บ</span>
                              <span className="font-mono-numbers font-bold text-amber-950">
                                {meal.foodGroups.group2_carbs}
                              </span>
                            </div>
                            <div>
                              <span className="text-emerald-700 block">ผัก</span>
                              <span className="font-mono-numbers font-bold text-emerald-950">
                                {meal.foodGroups.group3_vegetables}
                              </span>
                            </div>
                            <div>
                              <span className="text-purple-700 block">ผลไม้</span>
                              <span className="font-mono-numbers font-bold text-purple-950">
                                {meal.foodGroups.group4_fruits}
                              </span>
                            </div>
                            <div>
                              <span className="text-sky-700 block">ไขมัน</span>
                              <span className="font-mono-numbers font-bold text-sky-950">
                                {meal.foodGroups.group5_fats}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-neutral-400">
                          <p className="text-xs">ยังไม่ได้กำหนดเมนู</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs">
                      {meal ? (
                        <>
                          <button
                            onClick={() => onViewRecipe(meal)}
                            className="flex-1 py-1.5 px-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-medium transition-colors flex items-center justify-center gap-1"
                            title="ดูสูตร & วิธีปรุงสำหรับมือใหม่"
                          >
                            <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ดูสูตร</span>
                          </button>

                          <button
                            onClick={() => setSelectingMealFor({ day: activeDay, mealTime: item.time })}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                            title="เปลี่ยนเมนูนี้"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onAddFoodToJournal(meal, item.time)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white"
                            title="นำไปบันทึกในมื้ออาหารวันนี้ทันที"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectingMealFor({ day: activeDay, mealTime: item.time })}
                          className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>เลือกเมนู</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode 2: Grocery Shopping List */}
        {activeViewMode === 'grocery' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80">
              <div>
                <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  รายการซื้อวัตถุดิบรวมสำหรับ 7 วัน (Aggregated Grocery List)
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  ระบบรวบรวมวัตถุดิบทั้งหมดจากเมนูอาหารที่วางแผนไว้ในสัปดาห์นี้
                  (ซื้อแล้ว {checkedCount}/{groceryList.length} รายการ)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyGroceryList}
                  className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  {copiedGrocery ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGrocery ? 'คัดลอกเรียบร้อย!' : 'คัดลอกรายการไปจ่ายตลาด'}</span>
                </button>
              </div>
            </div>

            {/* Grocery Checklist grouped by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['produce', 'meat_protein', 'fruit', 'grain_carb', 'pantry_oil'].map((catKey) => {
                const itemsInCat = groceryList.filter(g => g.category === catKey);
                if (itemsInCat.length === 0) return null;

                const catLabel = itemsInCat[0].categoryLabel;

                return (
                  <div
                    key={catKey}
                    className="border border-neutral-200 rounded-xl p-4 bg-white space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">
                        {catLabel}
                      </h4>
                      <span className="text-[11px] font-mono-numbers text-neutral-400">
                        {itemsInCat.filter(i => i.checked).length}/{itemsInCat.length}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {itemsInCat.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleGroceryItem(item.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            item.checked
                              ? 'bg-neutral-50/70 border-neutral-200 text-neutral-400 line-through'
                              : 'bg-white hover:bg-neutral-50 border-neutral-200/80 text-neutral-800'
                          }`}
                        >
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                          >
                            {item.checked ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4 text-neutral-400" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium block truncate select-none">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 block truncate select-none">
                              {item.quantityEst} · เมนู: {item.sourceMeals.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Select dish for a meal slot */}
      {selectingMealFor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-emerald-700">
                  เลือกเมนูสำหรับ {DAYS_OF_WEEK.find(d => d.id === selectingMealFor.day)?.fullLabel}
                </span>
                <h3 className="text-base font-bold text-neutral-900">
                  เลือกเมนูสำหรับ {selectingMealFor.mealTime === 'breakfast' ? 'มื้อเช้า' : selectingMealFor.mealTime === 'lunch' ? 'มื้อกลางวัน' : selectingMealFor.mealTime === 'dinner' ? 'มื้อเย็น' : 'ของว่าง'}
                </h3>
              </div>
              <button
                onClick={() => setSelectingMealFor(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {THAI_RECOMMENDED_MEALS.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => handleAssignMeal(dish)}
                  className="p-3 rounded-xl border border-neutral-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-0.5">
                      <span className="font-medium text-emerald-700">
                        {dish.defaultMeal === 'breakfast' ? 'เช้า' : dish.defaultMeal === 'lunch' ? 'กลางวัน' : dish.defaultMeal === 'dinner' ? 'เย็น' : 'ว่าง'}
                      </span>
                      {dish.cookingTimeMinutes && <span>⏱️ {dish.cookingTimeMinutes} นาที</span>}
                      {dish.difficulty && <span>· {dish.difficulty}</span>}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-emerald-700 truncate">
                      {dish.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {dish.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono-numbers font-bold text-xs text-neutral-900 block">
                      {dish.nutrition.calories} kcal
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold group-hover:underline">
                      เลือกเมนูนี้ →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
