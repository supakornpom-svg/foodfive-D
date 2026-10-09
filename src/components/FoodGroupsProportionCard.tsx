import React from 'react';
import { DailyTargets, FoodGroupServing, FoodGroupId } from '../types/nutrition';
import { FOOD_GROUPS } from '../data/nutritionData';
import { calculatePlateCompliance } from '../utils/nutritionCalculators';
import { Info, HelpCircle, ArrowRight } from 'lucide-react';

interface FoodGroupsProportionCardProps {
  actualFoodGroups: FoodGroupServing;
  targets: DailyTargets;
  onSelectFoodGroup: (groupId: FoodGroupId) => void;
}

export const FoodGroupsProportionCard: React.FC<FoodGroupsProportionCardProps> = ({
  actualFoodGroups,
  targets,
  onSelectFoodGroup,
}) => {
  const compliance = calculatePlateCompliance(actualFoodGroups);

  const groupDataList = [
    {
      group: FOOD_GROUPS.group1,
      actual: actualFoodGroups.group1_protein,
      target: targets.targetFoodGroups.group1.portions,
      unit: targets.targetFoodGroups.group1.unit,
      desc: targets.targetFoodGroups.group1.desc,
      id: 'group1' as FoodGroupId,
      dotColor: 'bg-rose-500',
      accentColor: 'border-rose-300 text-rose-700 bg-rose-50/50',
    },
    {
      group: FOOD_GROUPS.group2,
      actual: actualFoodGroups.group2_carbs,
      target: targets.targetFoodGroups.group2.portions,
      unit: targets.targetFoodGroups.group2.unit,
      desc: targets.targetFoodGroups.group2.desc,
      id: 'group2' as FoodGroupId,
      dotColor: 'bg-amber-500',
      accentColor: 'border-amber-300 text-amber-800 bg-amber-50/50',
    },
    {
      group: FOOD_GROUPS.group3,
      actual: actualFoodGroups.group3_vegetables,
      target: targets.targetFoodGroups.group3.portions,
      unit: targets.targetFoodGroups.group3.unit,
      desc: targets.targetFoodGroups.group3.desc,
      id: 'group3' as FoodGroupId,
      dotColor: 'bg-emerald-500',
      accentColor: 'border-emerald-300 text-emerald-800 bg-emerald-50/50',
    },
    {
      group: FOOD_GROUPS.group4,
      actual: actualFoodGroups.group4_fruits,
      target: targets.targetFoodGroups.group4.portions,
      unit: targets.targetFoodGroups.group4.unit,
      desc: targets.targetFoodGroups.group4.desc,
      id: 'group4' as FoodGroupId,
      dotColor: 'bg-purple-500',
      accentColor: 'border-purple-300 text-purple-800 bg-purple-50/50',
    },
    {
      group: FOOD_GROUPS.group5,
      actual: actualFoodGroups.group5_fats,
      target: targets.targetFoodGroups.group5.portions,
      unit: targets.targetFoodGroups.group5.unit,
      desc: targets.targetFoodGroups.group5.desc,
      id: 'group5' as FoodGroupId,
      dotColor: 'bg-sky-500',
      accentColor: 'border-sky-300 text-sky-800 bg-sky-50/50',
    },
  ];

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Title & Guidelines */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
            <span>มาตรฐานโภชนาการไทย</span>
            <span aria-hidden="true">·</span>
            <span>ธงโภชนาการ กรมอนามัย</span>
            <span aria-hidden="true">·</span>
            <span>จานสุขภาพสูตร 2:1:1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-emerald-700" />
            </div>
            <span>สัดส่วนอาหาร 5 หมู่ ที่ควรได้รับในแต่ละวัน</span>
          </h2>
        </div>
        <p className="text-xs text-neutral-500 max-w-sm">
          คลิกที่แต่ละหมู่เพื่อดูคู่มือปริมาณและแหล่งอาหารคุณภาพดี
        </p>
      </div>

      {/* 2:1:1 Healthy Plate Diagram + Compliance Banner */}
      <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-200/80 rounded-2xl p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Plate Visual Representation */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <span className="text-xs font-semibold text-emerald-900 mb-2">
              สูตรจานสุขภาพมาตรฐาน (ผัก 2 : ข้าวแป้ง 1 : เนื้อสัตว์ 1)
            </span>
            <div className="relative w-44 h-44 rounded-full border-4 border-white shadow-md bg-white overflow-hidden p-1">
              {/* Circular Plate Sections */}
              <div className="w-full h-full rounded-full overflow-hidden relative flex flex-col">
                {/* Top Half: Vegetables 2 parts (50%) */}
                <div className="h-1/2 bg-emerald-500 flex flex-col items-center justify-center text-white p-1">
                  <span className="text-[11px] font-bold">ผัก 2 ส่วน (50%)</span>
                  <span className="text-[9px] opacity-90">วิตามิน & แร่ธาตุ</span>
                </div>
                {/* Bottom Half: Split into Carbs (25%) and Protein (25%) */}
                <div className="h-1/2 flex">
                  {/* Bottom Left: Carbs */}
                  <div className="w-1/2 bg-amber-500 flex flex-col items-center justify-center text-white border-r border-white/60 p-1">
                    <span className="text-[11px] font-bold">ข้าวแป้ง 1</span>
                    <span className="text-[9px] opacity-90">25%</span>
                  </div>
                  {/* Bottom Right: Protein */}
                  <div className="w-1/2 bg-rose-500 flex flex-col items-center justify-center text-white p-1">
                    <span className="text-[11px] font-bold">เนื้อสัตว์ 1</span>
                    <span className="text-[9px] opacity-90">25%</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-neutral-600 mt-2">
              + ผลไม้หวานน้อย 1 กำปั้น / มื้อ + น้ำมันไม่เกิน 6 ช้อนชา/วัน
            </span>
          </div>

          {/* User's Current Plate Compliance Score */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  สัดส่วนจานอาหารของคุณวันนี้
                </h3>
                <p className="text-xs text-neutral-600">
                  คำนวณจากปริมาณผัก ข้าวแป้ง และโปรตีนที่บันทึกจริง
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono-numbers text-emerald-800">
                  {compliance.score}%
                </span>
                <span className="text-xs block text-emerald-700">ความสอดคล้อง 2:1:1</span>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded-full bg-neutral-200 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${compliance.vegPct}%` }}
                  title={`ผัก: ${compliance.vegPct}%`}
                />
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${compliance.carbPct}%` }}
                  title={`ข้าวแป้ง: ${compliance.carbPct}%`}
                />
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{ width: `${compliance.proteinPct}%` }}
                  title={`โปรตีน: ${compliance.proteinPct}%`}
                />
              </div>

              <div className="flex justify-between text-xs text-neutral-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  ผัก: <strong className="font-mono-numbers">{compliance.vegPct}%</strong> (เป้า 50%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  ข้าวแป้ง: <strong className="font-mono-numbers">{compliance.carbPct}%</strong> (เป้า 25%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  โปรตีน: <strong className="font-mono-numbers">{compliance.proteinPct}%</strong> (เป้า 25%)
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
              💡 <strong>เคล็ดลับ:</strong> {compliance.vegPct < 35 ? 'วันนี้ปริมาณผักยังน้อยกว่าเกณฑ์ แนะนำเพิ่มผักต้ม ผักสด หรือแกงจืดในมื้อถัดไป' : 'สัดส่วนผักและกากใยอาหารวันนี้อยู่ในเกณฑ์ดีมาก ช่วยให้อิ่มนานและระบบเผาผลาญทำงานได้เต็มที่'}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Food Groups Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groupDataList.map((item) => {
          const pct = Math.round((item.actual / (item.target || 1)) * 100);
          return (
            <div
              key={item.id}
              onClick={() => onSelectFoodGroup(item.id)}
              className="group border border-neutral-200 rounded-xl p-4.5 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer bg-white relative flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
                    <span className="text-xs font-semibold text-neutral-500">
                      หมู่ที่ {item.group.number}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-700 flex items-center gap-1">
                    ดูความรู้ & ภาพ <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                    <img
                      src={item.group.imageSrc}
                      alt={item.group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors truncate">
                      {item.group.shortName}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Portions comparison */}
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono-numbers text-neutral-900">
                      {item.actual.toFixed(1)}
                    </span>
                    <span className="text-xs font-medium text-neutral-500">
                      / {item.target} {item.unit}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono-numbers text-neutral-600">
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pct > 120 ? 'bg-amber-500' : item.dotColor
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              {/* Quick tip pill-less footer */}
              <div className="mt-3 pt-2 text-[11px] text-neutral-500 border-t border-neutral-50 line-clamp-1">
                {item.group.benefits}
              </div>
            </div>
          );
        })}

        {/* Bonus Card: น้ำดื่มและสมดุลของเหลว */}
        <div className="border border-sky-100 bg-sky-50/30 rounded-xl p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-700">ของเหลว & สมดุลร่างกาย</span>
              <span className="text-[11px] text-sky-600">สำคัญเคียงคู่ 5 หมู่</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">น้ำเปล่าบริสุทธิ์</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              ช่วยลำเลียงสารอาหาร 5 หมู่ และขับของเสียออกจากเซลล์
            </p>

            <div className="mt-4 pt-3 border-t border-sky-100 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono-numbers text-neutral-900">
                {targets.targetWaterMl.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500">มล. / วัน (~8-10 แก้ว)</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-sky-700">
            คำนวณตามสูตร: น้ำหนักตัว (กก.) × 33 มล.
          </div>
        </div>
      </div>
    </div>
  );
};
