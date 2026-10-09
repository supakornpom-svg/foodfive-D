import React, { useState } from 'react';
import { FoodItem, HealthConstraint, MealTime } from '../types/nutrition';
import {
  COMMON_PANTRY_INGREDIENTS,
  matchMealsByPantryIngredients,
  PantryIngredient,
} from '../utils/mealPlannerHelpers';
import {
  Refrigerator,
  CheckCircle2,
  Circle,
  ChefHat,
  Sparkles,
  Flame,
  Clock,
  Plus,
  RotateCcw,
  Search,
} from 'lucide-react';

interface IngredientMatcherSectionProps {
  onViewRecipe: (meal: FoodItem) => void;
  onAddFoodToJournal: (meal: FoodItem, targetMeal?: MealTime) => void;
  activeConstraints?: HealthConstraint[];
}

export const IngredientMatcherSection: React.FC<IngredientMatcherSectionProps> = ({
  onViewRecipe,
  onAddFoodToJournal,
  activeConstraints = [],
}) => {
  // Initial selected items in fridge
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([
    'chicken',
    'egg',
    'holy_basil',
    'brown_rice',
    'broccoli',
  ]);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleIngredient = (id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (category?: string) => {
    if (category) {
      const ids = COMMON_PANTRY_INGREDIENTS.filter(i => i.category === category).map(i => i.id);
      setSelectedIngredientIds(prev => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedIngredientIds(COMMON_PANTRY_INGREDIENTS.map(i => i.id));
    }
  };

  const handleClearAll = () => {
    setSelectedIngredientIds([]);
  };

  // Perform live matching
  const matchedResults = matchMealsByPantryIngredients(selectedIngredientIds, activeConstraints);

  const filteredPantry = COMMON_PANTRY_INGREDIENTS.filter((item) => {
    if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) return false;
    if (searchQuery.trim() !== '') {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
            <span>เครื่องมือค้นหาเมนูจากวัตถุดิบ</span>
            <span aria-hidden="true">·</span>
            <span>ลดขยะอาหาร (Zero Food Waste)</span>
            <span aria-hidden="true">·</span>
            <span>ทำทานเองได้ทันที</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Refrigerator className="w-5 h-5 text-emerald-700" />
            </div>
            <span>ค้นหาเมนูอาหาร 5 หมู่ จากวัตถุดิบในตู้เย็น (Ingredient Matcher)</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedIngredientIds(['chicken', 'egg', 'holy_basil', 'brown_rice', 'broccoli', 'tofu', 'carrot'])}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-medium transition-colors"
          >
            วัตถุดิบยอดฮิต
          </button>
          <button
            onClick={handleClearAll}
            className="px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 font-medium transition-colors"
          >
            ล้างทั้งหมด
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Fridge Selector, Right is Matched Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fridge Ingredients (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <span>เลือกวัตถุดิบที่คุณมีในตู้เย็น</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono-numbers">
                  {selectedIngredientIds.length} อย่าง
                </span>
              </h3>
            </div>

            <div className="relative w-36">
              <input
                type="text"
                placeholder="ค้นหาวัตถุดิบ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-2.5 py-1 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'protein', label: 'โปรตีน' },
              { id: 'produce', label: 'ผัก' },
              { id: 'carbs', label: 'ข้าว/เส้น' },
              { id: 'fruit', label: 'ผลไม้' },
              { id: 'pantry', label: 'ไขมันดี/ถั่ว' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategoryFilter === cat.id
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Ingredients Pill Selector */}
          <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/80 max-h-96 overflow-y-auto space-y-1.5 pr-1">
            <div className="grid grid-cols-2 gap-1.5">
              {filteredPantry.map((item) => {
                const isSelected = selectedIngredientIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleIngredient(item.id)}
                    className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-semibold shadow-2xs'
                        : 'border-neutral-200/80 bg-white hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <span className="truncate pr-1">{item.name}</span>
                    <span className="shrink-0 text-emerald-600">
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-neutral-300" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Matched Recipes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>เมนูที่ทำได้จากวัตถุดิบของคุณ ({matchedResults.length} เมนู)</span>
            </h3>
            <span className="text-xs text-neutral-500">
              เรียงตามความพร้อมของวัตถุดิบ
            </span>
          </div>

          {matchedResults.length === 0 ? (
            <div className="border border-dashed border-neutral-200 rounded-xl p-8 text-center text-neutral-400 space-y-2">
              <Refrigerator className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="text-xs">
                {selectedIngredientIds.length === 0
                  ? 'กรุณาเลือกวัตถุดิบที่คุณมีในตู้เย็นทางด้านซ้าย'
                  : 'ยังไม่พบเมนูที่ตรงกับวัตถุดิบที่เลือก ลองเพิ่มวัตถุดิบพื้นฐาน เช่น อกไก่, ไข่ไก่, ข้าวกล้อง'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {matchedResults.map((result) => {
                const { meal, matchPercentage, matchedIngredients } = result;
                return (
                  <div
                    key={meal.id}
                    className="border border-neutral-200 rounded-xl p-4 bg-white hover:border-emerald-300 transition-all shadow-2xs flex flex-col justify-between group"
                  >
                    <div>
                      {/* Match percentage bar & Cal */}
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono-numbers ${
                              matchPercentage >= 70
                                ? 'bg-emerald-100 text-emerald-800'
                                : matchPercentage >= 40
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            วัตถุดิบพร้อม {matchPercentage}%
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

                      <h4
                        onClick={() => onViewRecipe(meal)}
                        className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 cursor-pointer transition-colors"
                      >
                        {meal.name}
                      </h4>

                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {meal.description}
                      </p>

                      {/* Matched vs Missing Tags */}
                      <div className="mt-2.5 pt-2.5 border-t border-neutral-100 flex flex-wrap gap-1 text-[11px]">
                        <span className="text-neutral-500 self-center mr-1">มีในตู้เย็น:</span>
                        {matchedIngredients.map((ing, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium"
                          >
                            ✓ {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onViewRecipe(meal)}
                        className="py-1.5 px-3 rounded-lg border border-neutral-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 text-neutral-700 text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <ChefHat className="w-3.5 h-3.5 text-emerald-600" />
                        <span>วิธีเตรียม & ปรุงสำหรับมือใหม่</span>
                      </button>

                      <button
                        onClick={() => onAddFoodToJournal(meal, meal.defaultMeal)}
                        className="py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ บันทึกมื้อนี้</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
