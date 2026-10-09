import React, { useState } from 'react';
import { LoggedMealItem, MealTime, FoodItem } from '../types/nutrition';
import { THAI_RECOMMENDED_MEALS } from '../data/nutritionData';
import { Plus, Trash2, Clock, RotateCcw, Utensils, Droplets } from 'lucide-react';

interface DailyLogSectionProps {
  logs: LoggedMealItem[];
  onAddCustomMeal: (item: Omit<LoggedMealItem, 'id' | 'timestamp'>) => void;
  onAddPresetFood: (food: FoodItem, mealTime: MealTime) => void;
  onRemoveLogItem: (id: string) => void;
  onClearAllLogs: () => void;
  onRestoreSampleLogs: () => void;
  currentWaterMl?: number;
  targetWaterMl?: number;
  onUpdateWater?: (newAmount: number) => void;
}

export const DailyLogSection: React.FC<DailyLogSectionProps> = ({
  logs,
  onAddCustomMeal,
  onAddPresetFood,
  onRemoveLogItem,
  onClearAllLogs,
  onRestoreSampleLogs,
  currentWaterMl = 0,
  targetWaterMl = 2000,
  onUpdateWater,
}) => {
  const [activeMealTimeModal, setActiveMealTimeModal] = useState<MealTime | null>(null);
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customVegServings, setCustomVegServings] = useState('1');

  const mealTimeSections: { id: MealTime; title: string; subtitle: string }[] = [
    { id: 'breakfast', title: 'มื้อเช้า (Breakfast)', subtitle: 'เติมพลังงานเริ่มต้นวันใหม่' },
    { id: 'lunch', title: 'มื้อกลางวัน (Lunch)', subtitle: 'พลังงานหลักสำหรับการทำงาน' },
    { id: 'dinner', title: 'มื้อเย็น (Dinner)', subtitle: 'เน้นโปรตีนและผัก ย่อยง่าย สบายท้อง' },
    { id: 'snack', title: 'ของว่าง & สุขภาพ (Snacks)', subtitle: 'ผลไม้หวานน้อย ถั่ว นม หรือโยเกิร์ต' },
  ];

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMealTimeModal || !customName || !customCalories) return;

    const cal = parseFloat(customCalories) || 0;
    const p = parseFloat(customProtein) || Math.round((cal * 0.2) / 4);
    const c = parseFloat(customCarbs) || Math.round((cal * 0.5) / 4);
    const f = parseFloat(customFat) || Math.round((cal * 0.25) / 9);
    const veg = parseFloat(customVegServings) || 1;

    onAddCustomMeal({
      name: customName,
      mealTime: activeMealTimeModal,
      servings: 1,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      fiber: 3.5,
      sodium: 400,
      foodGroups: {
        group1_protein: Number((p / 15).toFixed(1)),
        group2_carbs: Number((c / 25).toFixed(1)),
        group3_vegetables: veg,
        group4_fruits: 0,
        group5_fats: Number((f / 5).toFixed(1)),
      },
    });

    // Reset form
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setCustomVegServings('1');
    setActiveMealTimeModal(null);
  };

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
            <span>บันทึกโภชนาการประจำวัน</span>
            <span aria-hidden="true">·</span>
            <span>คำนวณสารอาหารแบบเรียลไทม์</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 text-emerald-700" />
            </div>
            <span>บันทึกรายการอาหารที่บริโภคจริงในแต่ละมื้อ</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onRestoreSampleLogs}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-medium transition-colors flex items-center gap-1.5"
            title="ใส่ตัวอย่างอาหารเพื่อทดสอบกราฟและสัดส่วน"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
            โหลดตัวอย่างบันทึกอาหาร
          </button>
          {logs.length > 0 && (
            <button
              onClick={onClearAllLogs}
              className="px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 font-medium transition-colors"
            >
              ล้างรายการทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Daily Hydration Quick Bar */}
      <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">
                น้ำดื่มวันนี้: <span className="font-mono-numbers text-sky-800">{currentWaterMl.toLocaleString()}</span> / {targetWaterMl.toLocaleString()} มล.
              </span>
              <span className="text-[11px] font-semibold font-mono-numbers text-sky-700">
                ({Math.round((currentWaterMl / (targetWaterMl || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-48 bg-white/80 rounded-full h-1.5 overflow-hidden mt-1.5 border border-sky-200">
              <div
                className="bg-sky-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round((currentWaterMl / (targetWaterMl || 1)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {onUpdateWater && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] text-neutral-500 mr-1 hidden sm:inline">จดด่วน:</span>
            <button
              onClick={() => onUpdateWater(currentWaterMl + 200)}
              className="px-2.5 py-1 rounded-md bg-white border border-sky-200 text-sky-800 hover:bg-sky-100/60 font-semibold text-xs transition-colors shadow-2xs"
            >
              +200 ml
            </button>
            <button
              onClick={() => onUpdateWater(currentWaterMl + 250)}
              className="px-2.5 py-1 rounded-md bg-white border border-sky-200 text-sky-800 hover:bg-sky-100/60 font-semibold text-xs transition-colors shadow-2xs"
            >
              +250 ml (1 แก้ว)
            </button>
            <button
              onClick={() => onUpdateWater(currentWaterMl + 500)}
              className="px-2.5 py-1 rounded-md bg-white border border-sky-200 text-sky-800 hover:bg-sky-100/60 font-semibold text-xs transition-colors shadow-2xs"
            >
              +500 ml
            </button>
          </div>
        )}
      </div>

      {/* 4 Mealtime Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mealTimeSections.map((sec) => {
          const mealLogs = logs.filter((l) => l.mealTime === sec.id);
          const mealTotalCal = mealLogs.reduce((acc, cur) => acc + cur.calories, 0);

          return (
            <div
              key={sec.id}
              className="border border-neutral-200 rounded-xl p-4.5 bg-neutral-50/30 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3 border-b border-neutral-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      {sec.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      {sec.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono-numbers text-neutral-900">
                      {mealTotalCal}
                    </span>
                    <span className="text-[11px] text-neutral-500 ml-1">kcal</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 min-h-[90px]">
                  {mealLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6 text-neutral-400">
                      <Clock className="w-5 h-5 mb-1 opacity-60" />
                      <p className="text-xs">ยังไม่มีรายการอาหารในมื้อนี้</p>
                    </div>
                  ) : (
                    mealLogs.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-neutral-200/80 rounded-lg p-2.5 flex items-center justify-between text-xs hover:border-neutral-300 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-neutral-900 truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono-numbers mt-0.5">
                            <span>P: {item.protein}g</span>
                            <span>·</span>
                            <span>C: {item.carbs}g</span>
                            <span>·</span>
                            <span>F: {item.fat}g</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono-numbers font-bold text-neutral-900">
                            {item.calories} kcal
                          </span>
                          <button
                            onClick={() => onRemoveLogItem(item.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Meal Button */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveMealTimeModal(sec.id)}
                  className="flex-1 py-1.5 px-3 rounded-lg border border-dashed border-neutral-300 hover:border-emerald-500 hover:bg-emerald-50/30 text-neutral-700 hover:text-emerald-800 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + เพิ่มอาหารใน{sec.title.split(' ')[0]}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {activeMealTimeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  เพิ่มอาหารใน{activeMealTimeModal === 'breakfast' ? 'มื้อเช้า' : activeMealTimeModal === 'lunch' ? 'มื้อกลางวัน' : activeMealTimeModal === 'dinner' ? 'มื้อเย็น' : 'ของว่าง'}
                </h3>
                <p className="text-xs text-neutral-500">
                  เลือกจากเมนูยอดนิยม หรือพิมพ์กำหนดเอง
                </p>
              </div>
              <button
                onClick={() => setActiveMealTimeModal(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Pick from Curated Thai Dishes */}
            <div>
              <span className="text-xs font-semibold text-neutral-700 block mb-2">
                เลือกด่วนจากเมนูสุขภาพแนะนำ:
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {THAI_RECOMMENDED_MEALS.map((dish) => (
                  <button
                    key={dish.id}
                    onClick={() => {
                      onAddPresetFood(dish, activeMealTimeModal);
                      setActiveMealTimeModal(null);
                    }}
                    className="w-full text-left p-2 rounded-lg border border-neutral-100 hover:border-emerald-300 hover:bg-emerald-50/40 text-xs flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-neutral-900 truncate pr-2">
                      {dish.name}
                    </span>
                    <span className="font-mono-numbers text-neutral-500 shrink-0">
                      {dish.nutrition.calories} kcal
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="flex-shrink mx-3 text-neutral-400 text-xs">หรือกรอกเอง</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleCreateCustom} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1">
                  ชื่ออาหาร / เมนู
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ข้าวผัดไข่ใส่ผักคะน้า"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    พลังงาน (kcal) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="เช่น 350"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    โปรตีน (กรัม)
                  </label>
                  <input
                    type="number"
                    placeholder="เช่น 25"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    คาร์โบไฮเดรต (g)
                  </label>
                  <input
                    type="number"
                    placeholder="40"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    ไขมัน (g)
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700 block mb-1">
                    ผัก (ทัพพี)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={customVegServings}
                    onChange={(e) => setCustomVegServings(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMealTimeModal(null)}
                  className="px-3 py-1.5 text-xs rounded-lg text-neutral-600 hover:bg-neutral-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  บันทึกอาหาร
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
