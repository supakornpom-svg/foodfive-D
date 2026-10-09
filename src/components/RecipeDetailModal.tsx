import React, { useState } from 'react';
import { FoodItem, MealTime } from '../types/nutrition';
import {
  Utensils,
  Clock,
  Flame,
  ChefHat,
  CheckCircle2,
  Circle,
  Lightbulb,
  Heart,
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  BookOpen,
  Scale,
} from 'lucide-react';

interface RecipeDetailModalProps {
  meal: FoodItem | null;
  onClose: () => void;
  onAddToJournal: (meal: FoodItem, targetMeal?: MealTime) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  meal,
  onClose,
  onAddToJournal,
}) => {
  if (!meal) return null;

  const [activeTab, setActiveTab] = useState<'instructions' | 'ingredients' | 'nutrition'>('instructions');
  const [checkedPrepSteps, setCheckedPrepSteps] = useState<Record<number, boolean>>({});
  const [checkedCookingSteps, setCheckedCookingSteps] = useState<Record<number, boolean>>({});
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const togglePrepStep = (index: number) => {
    setCheckedPrepSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleCookingStep = (index: number) => {
    setCheckedCookingSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyRecipe = () => {
    const text = `🍳 สูตรอาหารสุขภาพ: ${meal.name}
⏱️ เวลาทำ: ${meal.cookingTimeMinutes || 15} นาที | ระดับ: ${meal.difficulty || 'ง่าย'}
🔥 พลังงาน: ${meal.nutrition.calories} kcal (P: ${meal.nutrition.protein}g, C: ${meal.nutrition.carbs}g, F: ${meal.nutrition.fat}g, ผัก: ${meal.foodGroups.group3_vegetables} ทัพพี)

วัตถุดิบแยก 5 หมู่:
- หมู่ 1 โปรตีน: ${meal.ingredientsBreakdown.group1 || '-'}
- หมู่ 2 คาร์โบไฮเดรต: ${meal.ingredientsBreakdown.group2 || '-'}
- หมู่ 3 ผัก/เกลือแร่: ${meal.ingredientsBreakdown.group3 || '-'}
- หมู่ 4 วิตามิน/ผลไม้: ${meal.ingredientsBreakdown.group4 || '-'}
- หมู่ 5 ไขมันดี: ${meal.ingredientsBreakdown.group5 || '-'}

🔪 ขั้นตอนการเตรียมวัตถุดิบ:
${(meal.prepSteps || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}

🔥 ขั้นตอนการปรุง:
${(meal.cookingSteps || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}

💡 เคล็ดลับก้นครัวสำหรับมือใหม่:
${meal.beginnerTips || 'ควบคุมไฟและความร้อนให้เหมาะสม'}`;

    navigator.clipboard?.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  };

  const handleAdd = () => {
    onAddToJournal(meal, meal.defaultMeal);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {meal.defaultMeal === 'breakfast'
                  ? 'มื้อเช้า'
                  : meal.defaultMeal === 'lunch'
                  ? 'มื้อกลางวัน'
                  : meal.defaultMeal === 'dinner'
                  ? 'มื้อเย็น'
                  : 'ของว่าง'}
              </span>

              {meal.difficulty && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  {meal.difficulty}
                </span>
              )}

              {meal.cookingTimeMinutes && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200/80 text-neutral-800 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  ~{meal.cookingTimeMinutes} นาที
                </span>
              )}

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-numbers bg-rose-100 text-rose-800 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-600" />
                {meal.nutrition.calories} kcal
              </span>
            </div>

            <h2 id="recipe-modal-title" className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {meal.name}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              {meal.description}
            </p>
            {meal.servingSize && (
              <span className="inline-block text-xs text-neutral-500 mt-1 bg-white px-2 py-0.5 rounded border border-neutral-200">
                ขนาดเสิร์ฟ: {meal.servingSize}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-200/50 transition-colors ml-2"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Beginner friendly banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-neutral-50 px-6 py-2.5 border-b border-emerald-100/60 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>คู่มือปรุงอาหารฉบับมือใหม่:</strong> ติ๊กเช็คถูกตามขั้นตอนขณะเตรียมและปรุงได้เลย
            </span>
          </div>
          <button
            onClick={handleCopyRecipe}
            className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 shrink-0 ml-2 hover:underline"
            title="คัดลอกสูตรอาหารทั้งหมด"
          >
            {copiedRecipe ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>คัดลอกแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอกสูตร</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-b border-neutral-200 flex gap-4 text-xs font-semibold bg-white">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'instructions'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            วิธีทำ & ขั้นตอนปรุง (สำหรับมือใหม่)
          </button>

          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ingredients'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Utensils className="w-4 h-4" />
            วัตถุดิบแยก 5 หมู่
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'nutrition'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            คุณค่าทางโภชนาการ
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: Instructions (Prep + Cooking + Beginner Tips) */}
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              {/* Beginner Secret Tips Callout */}
              {meal.beginnerTips && (
                <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
                  <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-0.5">
                      💡 เคล็ดลับก้นครัวสำหรับมือใหม่หัดทำ:
                    </h4>
                    <p className="leading-relaxed text-amber-900/90">
                      {meal.beginnerTips}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Prep Steps Checklist */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    ขั้นตอนการเตรียมวัตถุดิบ (Prep Steps)
                  </h3>
                  <span className="text-xs text-neutral-400">
                    เตรียมให้พร้อมก่อนเริ่มเปิดเตา
                  </span>
                </div>

                <div className="space-y-2">
                  {(meal.prepSteps && meal.prepSteps.length > 0
                    ? meal.prepSteps
                    : ['ล้างทำความสะอาดวัตถุดิบทุกชนิดให้สะอาดสะเด็ดน้ำ', 'หั่นเนื้อสัตว์และผักเป็นชิ้นขนาดพอดีคำเตรียมไว้']
                  ).map((step, idx) => {
                    const isChecked = !!checkedPrepSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => togglePrepStep(idx)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-300 text-neutral-500 line-through'
                            : 'bg-neutral-50/60 hover:bg-neutral-50 border-neutral-200/90 text-neutral-800'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                          aria-label={isChecked ? 'ยกเลิกขีดฆ่า' : 'ทำเครื่องหมายว่าเตรียมแล้ว'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-4 h-4 text-neutral-400" />
                          )}
                        </button>
                        <span className="text-xs sm:text-sm leading-relaxed select-none">
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Cooking Steps Stepper */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    ขั้นตอนการปรุงอาหารทีละสเต็ป (Cooking Steps)
                  </h3>
                  <span className="text-xs text-neutral-400">
                    ทำตามลำดับ ไม่ต้องรีบ
                  </span>
                </div>

                <div className="space-y-3">
                  {(meal.cookingSteps && meal.cookingSteps.length > 0
                    ? meal.cookingSteps
                    : ['ตั้งกระทะหรือหม้อด้วยไฟกลาง ใส่วัตถุดิบหลักลงไปปรุงจนสุก', 'ปรุงรสชาติให้อ่อนเค็ม เพื่อสุขภาพที่ดี แล้วตักเสิร์ฟพร้อมข้าว']
                  ).map((step, idx) => {
                    const isChecked = !!checkedCookingSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCookingStep(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/40 border-emerald-300 opacity-75'
                            : 'bg-white hover:border-neutral-300 border-neutral-200 shadow-xs'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold font-mono-numbers mt-0.5 ${
                            isChecked
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {isChecked ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-xs sm:text-sm leading-relaxed ${
                              isChecked ? 'text-neutral-500 line-through' : 'text-neutral-800 font-medium'
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Healthy Tip Footer Callout */}
              {meal.healthyTip && (
                <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Heart className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-950 mb-0.5">
                      ข้อแนะนำโภชนาการสำหรับมื้อนี้:
                    </strong>
                    <span>{meal.healthyTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 5 Food Groups Ingredients Breakdown */}
          {activeTab === 'ingredients' && (
            <div className="space-y-5">
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide mb-1">
                  สัดส่วนตามหลักจานสุขภาพ 2:1:1
                </h4>
                <p className="text-xs text-neutral-600">
                  จานนี้มีผัก <strong>{meal.foodGroups.group3_vegetables} ทัพพี</strong>, ข้าว-แป้ง <strong>{meal.foodGroups.group2_carbs} ทัพพี</strong>, และโปรตีน <strong>{meal.foodGroups.group1_protein} ส่วน</strong>
                </p>
              </div>

              <div className="space-y-3">
                {/* Group 1 Protein */}
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-900 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      หมู่ 1: โปรตีน (เนื้อสัตว์ ไข่ นม ถั่ว)
                    </span>
                    <span className="font-mono-numbers">{meal.foodGroups.group1_protein} ส่วน</span>
                  </div>
                  <p className="text-xs text-rose-950 font-medium pl-4">
                    {meal.ingredientsBreakdown.group1 || 'ไม่มีโปรตีนหลัก'}
                  </p>
                </div>

                {/* Group 2 Carbs */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      หมู่ 2: คาร์โบไฮเดรต (ข้าว แป้ง เผือก มัน)
                    </span>
                    <span className="font-mono-numbers">{meal.foodGroups.group2_carbs} ทัพพี</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium pl-4">
                    {meal.ingredientsBreakdown.group2 || 'ไม่มีคาร์โบไฮเดรตหลัก'}
                  </p>
                </div>

                {/* Group 3 Vegetables */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      หมู่ 3: เกลือแร่และพืชผัก (ผักใบเขียว ผักหลากสี)
                    </span>
                    <span className="font-mono-numbers">{meal.foodGroups.group3_vegetables} ทัพพี</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium pl-4">
                    {meal.ingredientsBreakdown.group3 || 'ไม่มีผัก'}
                  </p>
                </div>

                {/* Group 4 Fruits */}
                <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      หมู่ 4: วิตามินและผลไม้
                    </span>
                    <span className="font-mono-numbers">{meal.foodGroups.group4_fruits} ส่วน</span>
                  </div>
                  <p className="text-xs text-purple-950 font-medium pl-4">
                    {meal.ingredientsBreakdown.group4 || 'แนะนำรับประทานผลไม้สด 1 ส่วนเสริมหลังมื้อ'}
                  </p>
                </div>

                {/* Group 5 Fats */}
                <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-900 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      หมู่ 5: ไขมันดี (น้ำมันพืช ถั่วเปลือกแข็ง อะโวคาโด)
                    </span>
                    <span className="font-mono-numbers">{meal.foodGroups.group5_fats} ช้อนชา</span>
                  </div>
                  <p className="text-xs text-sky-950 font-medium pl-4">
                    {meal.ingredientsBreakdown.group5 || 'ไขมันธรรมชาติจากวัตถุดิบต่ำ'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Nutrition */}
          {activeTab === 'nutrition' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60">
                  <span className="text-xs text-neutral-500 block">พลังงานรวม</span>
                  <span className="text-2xl font-bold font-mono-numbers text-neutral-900">
                    {meal.nutrition.calories}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1">kcal</span>
                </div>

                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30">
                  <span className="text-xs text-rose-700 block font-medium">โปรตีน (Protein)</span>
                  <span className="text-2xl font-bold font-mono-numbers text-rose-950">
                    {meal.nutrition.protein}
                  </span>
                  <span className="text-xs text-rose-700 ml-1">g</span>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30">
                  <span className="text-xs text-amber-700 block font-medium">คาร์บ (Carbs)</span>
                  <span className="text-2xl font-bold font-mono-numbers text-amber-950">
                    {meal.nutrition.carbs}
                  </span>
                  <span className="text-xs text-amber-700 ml-1">g</span>
                </div>

                <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/30">
                  <span className="text-xs text-sky-700 block font-medium">ไขมัน (Fat)</span>
                  <span className="text-2xl font-bold font-mono-numbers text-sky-950">
                    {meal.nutrition.fat}
                  </span>
                  <span className="text-xs text-sky-700 ml-1">g</span>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <span className="text-xs text-emerald-700 block font-medium">ใยอาหาร (Fiber)</span>
                  <span className="text-2xl font-bold font-mono-numbers text-emerald-950">
                    {meal.nutrition.fiber}
                  </span>
                  <span className="text-xs text-emerald-700 ml-1">g</span>
                </div>

                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60">
                  <span className="text-xs text-neutral-500 block">โซเดียม (Sodium)</span>
                  <span className="text-2xl font-bold font-mono-numbers text-neutral-900">
                    {meal.nutrition.sodium}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1">mg</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <span className="text-xs text-neutral-500 block mb-2 font-medium">แท็กสุขภาพ:</span>
                <div className="flex flex-wrap gap-1.5">
                  {meal.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-700 border border-neutral-200/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/70">
          <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono-numbers">
            <span>🔥 {meal.nutrition.calories} kcal</span>
            <span aria-hidden="true">·</span>
            <span>โปรตีน {meal.nutrition.protein}g</span>
            <span aria-hidden="true">·</span>
            <span>ผัก {meal.foodGroups.group3_vegetables} ทัพพี</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 text-xs font-semibold rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              ปิด
            </button>

            <button
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`py-2 px-4 text-xs font-semibold rounded-lg text-white transition-all flex items-center gap-1.5 shadow-xs ${
                addedSuccess
                  ? 'bg-emerald-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกสำเร็จแล้ว</span>
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  <span>+ บันทึกมื้อนี้ลงในสมุด</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
