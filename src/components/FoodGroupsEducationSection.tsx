import React, { useState } from 'react';
import { FoodGroupId, DailyTargets, FoodGroupServing } from '../types/nutrition';
import { FOOD_GROUPS } from '../data/nutritionData';
import { BookOpen, CheckCircle2, ChevronRight, Utensils, Activity, Sparkles, Layers } from 'lucide-react';

interface FoodGroupsEducationSectionProps {
  onSelectFoodGroup: (groupId: FoodGroupId) => void;
  actualFoodGroups: FoodGroupServing;
  targets: DailyTargets;
}

export const FoodGroupsEducationSection: React.FC<FoodGroupsEducationSectionProps> = ({
  onSelectFoodGroup,
  actualFoodGroups,
  targets,
}) => {
  const [selectedGroupTab, setSelectedGroupTab] = useState<FoodGroupId>('group1');

  const groupsList = Object.values(FOOD_GROUPS);
  const currentGroup = FOOD_GROUPS[selectedGroupTab];

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="wellness-card rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
              <span>สาระน่ารู้โภชนาการ</span>
              <span aria-hidden="true">·</span>
              <span>อาหารหลัก 5 หมู่ของไทย</span>
              <span aria-hidden="true">·</span>
              <span>สำนักโภชนาการ กรมอนามัย</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-700" />
              </div>
              <span>ความรู้เรื่องอาหาร 5 หมู่: องค์ประกอบ หน้าที่ และภาพประกอบ</span>
            </h2>
          </div>
          <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
            ร่างกายมนุษย์ต้องการสารอาหารครบทั้ง 5 หมู่ในสัดส่วนที่สมดุล เพื่อการทำงานของอวัยวะ การสร้างภูมิต้านทาน และการป้องกันโรคไม่ติดต่อเรื้อรัง (NCDs)
          </p>
        </div>

        {/* 5 Group Tab Selectors with images preview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
          {groupsList.map((g) => {
            const isSelected = selectedGroupTab === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGroupTab(g.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="text-[10px] font-mono-numbers font-bold text-neutral-400 group-hover:text-neutral-600">
                    หมู่ {g.number}
                  </span>
                </div>

                <div className="mt-1">
                  <span className="text-xs font-bold text-neutral-900 block truncate">
                    {g.shortName}
                  </span>
                  <span className="text-[10px] text-neutral-500 block truncate">
                    {g.category}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Active Group Showcase Card */}
      {currentGroup && (
        <div className="wellness-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Photography Column */}
            <div className="lg:col-span-5 relative bg-neutral-100 min-h-[300px] lg:min-h-full">
              <img
                src={currentGroup.imageSrc}
                alt={currentGroup.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span
                  className="w-fit text-[11px] font-bold px-2 py-0.5 rounded-md mb-2"
                  style={{ backgroundColor: currentGroup.color }}
                >
                  หมู่ที่ {currentGroup.number}
                </span>
                <h3 className="text-xl font-bold drop-shadow-xs">
                  {currentGroup.name}
                </h3>
                <p className="text-xs text-white/90 mt-1 line-clamp-2">
                  {currentGroup.benefits}
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 text-xs text-emerald-300 font-mono-numbers">
                  ปริมาณแนะนำ: {currentGroup.recommendedDaily}
                </div>
              </div>
            </div>

            {/* In-Depth Educational Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
              {/* Top Meta info */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    หมวด: {currentGroup.category}
                  </span>
                  <span className="text-xs text-neutral-500">
                    สัดส่วนในพลังงาน: ~{currentGroup.standardPercentage}%
                  </span>
                </div>
                <button
                  onClick={() => onSelectFoodGroup(currentGroup.id)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  เปิดคู่มือฉบับเต็ม <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 1. ประกอบไปด้วยอะไรบ้าง */}
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-2.5">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  ประกอบไปด้วยอะไรบ้าง (วัตถุดิบและอาหารหลัก):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {currentGroup.composition.map((comp, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/70">
                      <span className="text-xs font-bold text-neutral-800 block mb-1">
                        {comp.category}
                      </span>
                      <ul className="text-[11px] text-neutral-600 space-y-0.5">
                        {comp.examples.map((ex, exIdx) => (
                          <li key={exIdx} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. หน้าที่ต่อร่างกาย */}
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  มีหน้าที่สำคัญอย่างไรต่อร่างกาย:
                </h4>
                <ul className="text-xs space-y-1.5 text-neutral-700">
                  {currentGroup.functions.map((fn, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {fIdx + 1}
                      </span>
                      <span className="leading-relaxed">{fn}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. สารอาหาร & เกณฑ์แนะนำ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 text-xs">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-1">
                    สารอาหารสำคัญที่ได้รับ:
                  </span>
                  <p className="text-emerald-800">
                    {currentGroup.primaryNutrients.join(' · ')}
                  </p>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="font-bold text-neutral-900 block mb-1">
                    เกณฑ์การรับประทานต่อมื้อ:
                  </span>
                  <p className="text-neutral-700">
                    {currentGroup.portionGuideline}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All 5 Food Groups for Quick Comparison with Images */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-600" />
              ภาพรวมสรุปอาหารทั้ง 5 หมู่ (ครบชุดพร้อมภาพประกอบ)
            </h3>
            <p className="text-xs text-neutral-500">
              คลิกที่การ์ดเพื่อดูรายละเอียดองค์ประกอบและหน้าที่ของแต่ละหมู่
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groupsList.map((group) => {
            return (
              <div
                key={group.id}
                onClick={() => onSelectFoodGroup(group.id)}
                className="group border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer bg-white flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-40 bg-neutral-100 overflow-hidden">
                    <img
                      src={group.imageSrc}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md text-white shadow-xs"
                        style={{ backgroundColor: group.color }}
                      >
                        หมู่ที่ {group.number}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
                      {group.name}
                    </h4>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {group.benefits}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                      <strong>ประกอบด้วย:</strong> {group.goodSources.slice(0, 3).join(', ')} ฯลฯ
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">
                      {group.unitThai}
                    </span>
                    <span className="text-neutral-500 group-hover:text-emerald-700 flex items-center gap-1 font-medium">
                      ดูหน้าที่ & รายละเอียด <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
