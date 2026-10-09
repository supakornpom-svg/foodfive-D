import React, { useState } from 'react';
import { Flame, ArrowUpRight, ArrowDownRight, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { DailyTargets, DayHistoryPoint } from '../types/nutrition';

interface EnergyComparisonCardProps {
  actualCalories: number;
  targets: DailyTargets;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  mealBreakdown: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  sevenDayHistory: DayHistoryPoint[];
  onOpenJournal: () => void;
}

export const EnergyComparisonCard: React.FC<EnergyComparisonCardProps> = ({
  actualCalories,
  targets,
  macros,
  mealBreakdown,
  sevenDayHistory,
  onOpenJournal,
}) => {
  const [hoveredDay, setHoveredDay] = useState<DayHistoryPoint | null>(null);

  const targetCalories = targets.targetCalories;
  const difference = actualCalories - targetCalories;
  const percentage = Math.round((actualCalories / targetCalories) * 100);

  // Status calculation
  let statusText = 'อยู่ในเกณฑ์สมดุลดีเยี่ยม';
  let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let statusDesc = 'พลังงานที่ได้รับสอดคล้องกับความต้องการของร่างกายในระดับพอดี';

  if (actualCalories === 0) {
    statusText = 'ยังไม่มีการบันทึกอาหารวันนี้';
    statusColor = 'text-neutral-600 bg-neutral-100 border-neutral-200';
    statusDesc = 'เริ่มบันทึกมื้ออาหารเพื่อคำนวณและเปรียบเทียบพลังงาน';
  } else if (percentage < 80) {
    statusText = `ขาดอีก ${Math.abs(difference)} kcal`;
    statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    statusDesc = 'ยังได้รับพลังงานน้อยกว่าที่ร่างกายต้องการ แนะนำเติมมื้อหลักหรือของว่างสุขภาพ';
  } else if (percentage > 115) {
    statusText = `เกินเป้าหมาย ${difference} kcal`;
    statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
    statusDesc = 'ได้รับพลังงานเกินกว่าความต้องการของร่างกาย แนะนำเพิ่มการเคลื่อนไหวหรือปรับมื้อถัดไป';
  }

  // Calculate max scale for the 7-day chart
  const maxChartCalorie = Math.max(
    ...sevenDayHistory.map(d => Math.max(d.actualCalories, d.targetCalories)),
    targets.targetCalories * 1.25,
    2500
  );

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Header section with clean metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
            <span>การเผาผลาญพลังงาน</span>
            <span aria-hidden="true">·</span>
            <span>Mifflin-St Jeor TDEE Model</span>
            <span aria-hidden="true">·</span>
            <span>อัปเดตตามมื้ออาหารที่บันทึก</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <span>กราฟเปรียบเทียบพลังงานที่ได้รับจริง กับความต้องการของร่างกาย</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${statusColor}`}>
            {percentage >= 80 && percentage <= 115 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : percentage > 115 ? (
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-amber-600" />
            )}
            <span>{statusText}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Actual Calories */}
        <div className="bg-neutral-50/80 rounded-xl p-4 border border-neutral-200/70">
          <span className="text-xs font-medium text-neutral-500 block">
            พลังงานที่ได้รับจริงวันนี้ (Actual Intake)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono-numbers text-neutral-900">
              {actualCalories.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-neutral-500">kcal</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            จากทั้งหมด {actualCalories > 0 ? 'มื้อที่บันทึกไว้ในวันนี้' : 'ยังไม่ได้บันทึก'}
          </p>
        </div>

        {/* Target Calories */}
        <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-100">
          <span className="text-xs font-medium text-emerald-800 block">
            ความต้องการของร่างกาย (Daily Target TDEE)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono-numbers text-emerald-900">
              {targetCalories.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-emerald-700">kcal</span>
          </div>
          <p className="mt-1 text-xs text-emerald-700">
            คำนวณจาก BMR ({targets.bmr}) + กิจกรรมประจำวัน
          </p>
        </div>

        {/* Difference & Fulfillment */}
        <div className="bg-neutral-50/80 rounded-xl p-4 border border-neutral-200/70">
          <span className="text-xs font-medium text-neutral-500 block">
            สัดส่วนการบรรลุเป้าหมาย (Progress)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono-numbers text-neutral-900">
              {percentage}%
            </span>
            <span className="text-xs font-medium text-neutral-500">
              {difference >= 0 ? `+${difference}` : difference} kcal
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 115
                  ? 'bg-rose-500'
                  : percentage >= 80
                  ? 'bg-emerald-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 7-Day Energy Comparison Chart */}
      <div className="border border-neutral-200 rounded-xl p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              กราฟเปรียบเทียบพลังงานรายสัปดาห์ (7 วันล่าสุด)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              เปรียบเทียบพลังงานที่ได้รับจริงกับเส้นเกณฑ์ความต้องการในแต่ละวัน
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              <span>ได้รับจริง (kcal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-neutral-200 inline-block" />
              <span>เป้าหมาย ({targetCalories} kcal)</span>
            </div>
          </div>
        </div>

        {/* SVG Comparative Chart */}
        <div className="relative pt-4 pb-2">
          {/* Target Reference Line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-neutral-400 z-10 pointer-events-none flex justify-end pr-2"
            style={{
              bottom: `${(targets.targetCalories / maxChartCalorie) * 100 * 0.75 + 24}px`
            }}
          >
            <span className="text-[10px] bg-neutral-800 text-white font-mono-numbers px-1.5 py-0.5 rounded -mt-2.5">
              Target {targets.targetCalories}
            </span>
          </div>

          {/* Bar Columns Container */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6">
            {sevenDayHistory.map((item, index) => {
              const isToday = index === 6;
              const actualHeightPct = Math.min(100, (item.actualCalories / maxChartCalorie) * 100);
              const targetHeightPct = Math.min(100, (item.targetCalories / maxChartCalorie) * 100);
              const isOver = item.actualCalories > item.targetCalories * 1.15;
              const isBalanced = item.actualCalories >= item.targetCalories * 0.8 && !isOver;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredDay(item)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`flex flex-col items-center h-full justify-end group cursor-pointer relative p-1 rounded-lg transition-colors ${
                    isToday ? 'bg-emerald-50/50 ring-1 ring-emerald-200' : 'hover:bg-neutral-50'
                  }`}
                >
                  {/* Tooltip on hover */}
                  {hoveredDay?.dayName === item.dayName && (
                    <div className="absolute -top-14 z-20 bg-neutral-900 text-white text-[11px] p-2 rounded-lg shadow-lg whitespace-nowrap pointer-events-none text-center">
                      <div className="font-semibold">{item.dayName}</div>
                      <div>ได้รับ: <span className="font-mono-numbers font-bold text-emerald-300">{item.actualCalories}</span> / {item.targetCalories} kcal</div>
                    </div>
                  )}

                  {/* Dual Bar Cluster */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-44">
                    {/* Target Bar (Background reference) */}
                    <div
                      className="w-2.5 sm:w-3.5 bg-neutral-200 rounded-t-sm transition-all"
                      style={{ height: `${targetHeightPct}%` }}
                      title={`เป้าหมาย: ${item.targetCalories} kcal`}
                    />

                    {/* Actual Intake Bar */}
                    <div
                      className={`w-3.5 sm:w-5 rounded-t-sm transition-all duration-300 ${
                        isToday
                          ? isOver
                            ? 'bg-rose-500'
                            : isBalanced
                            ? 'bg-emerald-600'
                            : item.actualCalories === 0
                            ? 'bg-neutral-300'
                            : 'bg-amber-500'
                          : isOver
                          ? 'bg-rose-400'
                          : isBalanced
                          ? 'bg-emerald-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ height: `${Math.max(4, actualHeightPct)}%` }}
                    />
                  </div>

                  {/* Calorie Label */}
                  <span className="text-[11px] font-mono-numbers font-medium text-neutral-700 mt-2">
                    {item.actualCalories > 0 ? item.actualCalories : '-'}
                  </span>

                  {/* Day Label */}
                  <span className={`text-[11px] mt-0.5 truncate max-w-full ${isToday ? 'font-bold text-emerald-800' : 'text-neutral-500'}`}>
                    {isToday ? 'วันนี้' : item.dayName.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-neutral-400" />
            <span>คำแนะนำ: การบริโภคพลังงานในระดับ ±10% ของ TDEE จะช่วยรักษาสมดุลระบบเผาผลาญได้อย่างยั่งยืน</span>
          </div>
          <button
            onClick={onOpenJournal}
            className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
          >
            + บันทึกอาหารวันนี้
          </button>
        </div>
      </div>

      {/* Energy Breakdown By Meals vs Benchmark Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Meal Energy Distribution */}
        <div className="border border-neutral-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-neutral-900 mb-3">
            การกระจายพลังงานตามมื้ออาหาร (มื้อเช้า / กลางวัน / เย็น / ว่าง)
          </h3>
          <div className="space-y-3">
            {[
              {
                name: 'มื้อเช้า',
                actual: mealBreakdown.breakfast,
                benchmarkPct: 30,
                idealCal: Math.round(targetCalories * 0.3),
              },
              {
                name: 'มื้อกลางวัน',
                actual: mealBreakdown.lunch,
                benchmarkPct: 35,
                idealCal: Math.round(targetCalories * 0.35),
              },
              {
                name: 'มื้อเย็น',
                actual: mealBreakdown.dinner,
                benchmarkPct: 25,
                idealCal: Math.round(targetCalories * 0.25),
              },
              {
                name: 'ของว่าง & สุขภาพ',
                actual: mealBreakdown.snack,
                benchmarkPct: 10,
                idealCal: Math.round(targetCalories * 0.1),
              },
            ].map((meal, idx) => {
              const currentMealPct = actualCalories > 0 ? Math.round((meal.actual / actualCalories) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-800">{meal.name}</span>
                    <div className="flex items-center gap-2 font-mono-numbers">
                      <span className="font-bold text-neutral-900">{meal.actual} kcal</span>
                      <span className="text-neutral-400">/ แนะนำ ~{meal.idealCal} kcal ({meal.benchmarkPct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (meal.actual / meal.idealCal) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Macronutrient Balance Target vs Actual */}
        <div className="border border-neutral-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-neutral-900 mb-3">
            สัดส่วนสารอาหารหลักที่ได้รับจริง vs เป้าหมาย (Macros)
          </h3>
          <div className="space-y-3">
            {/* Protein */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-rose-800">
                  โปรตีน (Protein)
                </span>
                <span className="font-mono-numbers text-neutral-700">
                  <strong className="text-neutral-900">{macros.protein}g</strong> / {targets.targetProteinGrams}g ({Math.round((macros.protein / targets.targetProteinGrams) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (macros.protein / targets.targetProteinGrams) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-amber-800">
                  คาร์โบไฮเดรต (Carbohydrates)
                </span>
                <span className="font-mono-numbers text-neutral-700">
                  <strong className="text-neutral-900">{macros.carbs}g</strong> / {targets.targetCarbsGrams}g ({Math.round((macros.carbs / targets.targetCarbsGrams) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (macros.carbs / targets.targetCarbsGrams) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-sky-800">
                  ไขมันดี (Healthy Fat)
                </span>
                <span className="font-mono-numbers text-neutral-700">
                  <strong className="text-neutral-900">{macros.fat}g</strong> / {targets.targetFatGrams}g ({Math.round((macros.fat / targets.targetFatGrams) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (macros.fat / targets.targetFatGrams) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fiber */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-emerald-800">
                  ใยอาหาร (Dietary Fiber)
                </span>
                <span className="font-mono-numbers text-neutral-700">
                  <strong className="text-neutral-900">{macros.fiber.toFixed(1)}g</strong> / {targets.targetFiberGrams}g ({Math.round((macros.fiber / targets.targetFiberGrams) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, (macros.fiber / targets.targetFiberGrams) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
