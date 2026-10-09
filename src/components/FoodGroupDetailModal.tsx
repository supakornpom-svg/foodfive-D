import React from 'react';
import { FoodGroupId } from '../types/nutrition';
import { FOOD_GROUPS } from '../data/nutritionData';
import { CheckCircle2, AlertTriangle, Lightbulb, Activity, Utensils, ShieldAlert } from 'lucide-react';

interface FoodGroupDetailModalProps {
  groupId: FoodGroupId | null;
  onClose: () => void;
}

export const FoodGroupDetailModal: React.FC<FoodGroupDetailModalProps> = ({
  groupId,
  onClose,
}) => {
  if (!groupId) return null;
  const group = FOOD_GROUPS[groupId];
  if (!group) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header with Close */}
        <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
              <span className="text-xs font-semibold text-neutral-500">
                คู่มือการเรียนรู้โภชนาการอาหาร 5 หมู่
              </span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              {group.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 text-lg leading-none p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Visual Image Banner */}
        <div className="relative rounded-xl overflow-hidden h-52 bg-neutral-100 border border-neutral-200">
          <img
            src={group.imageSrc}
            alt={group.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="text-[11px] font-semibold text-emerald-300 block">
                {group.category} · มาตรฐานกรมอนามัย
              </span>
              <p className="text-sm font-bold text-white drop-shadow-xs">
                {group.recommendedDaily}
              </p>
            </div>
          </div>
        </div>

        {/* 1. ประกอบไปด้วยอะไรบ้าง (Composition Breakdown) */}
        <div className="bg-neutral-50/80 p-4 rounded-xl border border-neutral-200/80 space-y-2.5">
          <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-emerald-700" />
            อาหารหมู่นี้ประกอบไปด้วยอะไรบ้าง:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {group.composition.map((comp, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-neutral-200/60 shadow-2xs">
                <span className="text-xs font-bold text-neutral-800 block mb-1">
                  {comp.category}
                </span>
                <ul className="text-[11px] text-neutral-600 space-y-0.5">
                  {comp.examples.map((ex, exIdx) => (
                    <li key={exIdx} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-600 shrink-0" />
                      <span className="truncate">{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 2. มีหน้าที่อย่างไรต่อร่างกาย (Physiological Functions) */}
        <div className="border border-neutral-200 rounded-xl p-4 space-y-2">
          <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            หน้าที่และบทบาทสำคัญต่อร่างกาย:
          </span>
          <ul className="text-xs space-y-2 text-neutral-700">
            {group.functions.map((fn, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {fIdx + 1}
                </span>
                <span className="leading-relaxed">{fn}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. สารอาหารเด่น & วิธีวัดขนาดรับประทาน (Portion Guideline) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
            <span className="font-bold text-emerald-900 block mb-1">
              สารอาหารเด่นในหมู่นี้:
            </span>
            <div className="text-emerald-800">
              {group.primaryNutrients.join(' · ')}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <span className="font-bold text-neutral-900 block mb-1">
              วิธีวัดขนาดรับประทานง่ายๆ:
            </span>
            <div className="text-neutral-700">
              {group.portionGuideline}
            </div>
          </div>
        </div>

        {/* 4. แหล่งอาหารแนะนำ vs สิ่งที่ควรระวัง */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-emerald-200/80 bg-emerald-50/20 rounded-xl p-3.5">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              แหล่งอาหารคุณภาพดีแนะนำ:
            </span>
            <ul className="text-xs space-y-1 text-neutral-700">
              {group.goodSources.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-rose-200/80 bg-rose-50/20 rounded-xl p-3.5">
            <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              สิ่งที่ควรหลีกเลี่ยงหรือจำกัด:
            </span>
            <ul className="text-xs space-y-1 text-neutral-700">
              {group.foodsToLimit.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 5. ผลกระทบเมื่อร่างกายขาด vs เมื่อได้รับมากเกินไป */}
        <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs space-y-1.5">
          <div className="flex items-start gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-800">ผลกระทบหากร่างกายขาด:</strong>{' '}
              <span className="text-neutral-600">{group.deficiencyRisks}</span>
            </div>
          </div>
          <div className="flex items-start gap-1.5 pt-1 border-t border-neutral-200/60">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-800">ผลกระทบหากได้รับมากเกินไป:</strong>{' '}
              <span className="text-neutral-600">{group.excessRisks}</span>
            </div>
          </div>
        </div>

        {/* 6. เคล็ดลับการทานเพื่อสุขภาพ */}
        <div className="bg-amber-50/60 border border-amber-200/80 p-3.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>เคล็ดลับการรับประทานให้ได้คุณค่าสูงสุด:</strong>
            <p className="mt-0.5 text-neutral-700">{group.tips}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

