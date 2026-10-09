import React, { useState } from 'react';
import { BmiAnalysis, UserProfile } from '../types/nutrition';
import { Scale, HeartPulse, Dumbbell, ShieldAlert, CheckCircle2, ChevronRight, Info, Sparkles } from 'lucide-react';

interface BmiExerciseCardProps {
  bmiAnalysis: BmiAnalysis;
  profile: UserProfile;
  onOpenProfile: () => void;
}

export const BmiExerciseCard: React.FC<BmiExerciseCardProps> = ({
  bmiAnalysis,
  profile,
  onOpenProfile,
}) => {
  const [showFullPlan, setShowFullPlan] = useState(false);

  // Position percentage along the 15 to 35 BMI visual scale
  const minScale = 15;
  const maxScale = 35;
  const clampedBmi = Math.max(minScale, Math.min(maxScale, bmiAnalysis.bmi));
  const pointerPositionPercent = Math.round(((clampedBmi - minScale) / (maxScale - minScale)) * 100);

  // Asian BMI Standards Tiers
  const bmiRanges = [
    { label: 'ผอม (<18.5)', range: '< 18.5', color: 'bg-sky-500', width: '17.5%', desc: 'น้ำหนักน้อย' },
    { label: 'ปกติ (18.5-22.9)', range: '18.5 - 22.9', color: 'bg-emerald-500', width: '22%', desc: 'สมส่วน' },
    { label: 'ท้วม (23-24.9)', range: '23.0 - 24.9', color: 'bg-amber-500', width: '10%', desc: 'น้ำหนักเกิน' },
    { label: 'อ้วน 1 (25-29.9)', range: '25.0 - 29.9', color: 'bg-orange-500', width: '25%', desc: 'เสี่ยงปานกลาง' },
    { label: 'อ้วน 2 (≥30)', range: '≥ 30.0', color: 'bg-rose-500', width: '25.5%', desc: 'อ้วนอันตราย' },
  ];

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
            <span>เกณฑ์ประเมินสุขภาพเอเชีย-แปซิฟิก (WHO Asia-Pacific)</span>
            <span aria-hidden="true">·</span>
            <span>กรมอนามัย กระทรวงสาธารณสุข</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5 text-emerald-700" />
            </div>
            <span>ดัชนีมวลกาย (BMI) & คำแนะนำการออกกำลังกายเฉพาะบุคคล</span>
          </h2>
        </div>

        <button
          onClick={onOpenProfile}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline self-start sm:self-auto py-1 px-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 transition-colors"
        >
          <span>แก้ไขสรีระ ({profile.weightKg} กก. · {profile.heightCm} ซม.)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main BMI Highlight & Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: BMI Value Box */}
        <div className="lg:col-span-4 bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500 block mb-1">
              ค่าดัชนีมวลกายปัจจุบัน (Body Mass Index)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono-numbers text-neutral-900 tracking-tight">
                {bmiAnalysis.bmi}
              </span>
              <span className="text-xs font-medium text-neutral-500">kg/m²</span>
            </div>

            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${bmiAnalysis.badgeBgColor} ${bmiAnalysis.badgeTextColor} border-current/20`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bmiAnalysis.statusColor }} />
                {bmiAnalysis.statusLabel}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-neutral-600 border-t border-neutral-200/60 pt-3">
            {bmiAnalysis.healthRisk}
          </p>
        </div>

        {/* Right: Visual Asian BMI Scale & Target Weight Analysis */}
        <div className="lg:col-span-8 space-y-4">
          {/* Target Weight vs Current */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40">
              <span className="text-neutral-500 block">
                ช่วงน้ำหนักมาตรฐาน (สำหรับส่วนสูง {profile.heightCm} ซม.):
              </span>
              <span className="text-base font-bold font-mono-numbers text-emerald-900 block mt-0.5">
                {bmiAnalysis.idealWeightMin} – {bmiAnalysis.idealWeightMax} กก.
              </span>
              <span className="text-[11px] text-emerald-700">
                (คำนวณจากเกณฑ์ปกติ BMI 18.5 – 22.9)
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <span className="text-neutral-500 block">
                สถานะเทียบกับน้ำหนักมาตรฐาน:
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                {bmiAnalysis.status === 'normal' ? (
                  <span className="text-base font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    อยู่ในช่วงสมส่วนพอดี
                  </span>
                ) : bmiAnalysis.status === 'underweight' ? (
                  <span className="text-base font-bold text-sky-700 font-mono-numbers">
                    ต่ำกว่าเกณฑ์ {bmiAnalysis.weightDifference} กก.
                  </span>
                ) : (
                  <span className="text-base font-bold text-amber-700 font-mono-numbers">
                    เกินเกณฑ์มาตรฐาน {bmiAnalysis.weightDifference} กก.
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-500">
                น้ำหนักปัจจุบัน: {profile.weightKg} กก.
              </span>
            </div>
          </div>

          {/* Visual BMI Multi-Segment Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs text-neutral-600">
              <span className="font-semibold text-neutral-800">
                แถบเกณฑ์ดัชนีมวลกายมาตรฐานเอเชีย (Asian BMI Scale)
              </span>
              <span className="text-neutral-500 font-mono-numbers">
                BMI คุณ: <strong className="text-neutral-900">{bmiAnalysis.bmi}</strong>
              </span>
            </div>

            {/* Scale Gauge Track */}
            <div className="relative pt-6 pb-2">
              {/* Pointer Marker */}
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500 z-10"
                style={{ left: `${pointerPositionPercent}%` }}
              >
                <span className="text-[10px] font-bold font-mono-numbers px-1.5 py-0.5 rounded shadow-xs bg-neutral-900 text-white whitespace-nowrap">
                  คุณ ({bmiAnalysis.bmi})
                </span>
                <span className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900 -mt-0.5" />
              </div>

              {/* Segmented Gradient Bar */}
              <div className="h-3.5 w-full rounded-full overflow-hidden flex shadow-inner bg-neutral-100">
                {bmiRanges.map((r, i) => (
                  <div
                    key={i}
                    className={`${r.color} h-full border-r border-white/40 last:border-r-0`}
                    style={{ width: r.width }}
                    title={`${r.label}: ${r.range}`}
                  />
                ))}
              </div>

              {/* Range Labels underneath */}
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono-numbers mt-1.5 px-0.5">
                <span>15 (น้อย)</span>
                <span>18.5</span>
                <span>23.0</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>35+ (สูง)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailored Exercise & Physical Activity Recommendation Section */}
      <div className="border border-neutral-200 rounded-xl p-5 bg-gradient-to-br from-neutral-50/70 to-emerald-50/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              แผนการออกกำลังกายที่เหมาะสมกับค่า BMI ของคุณ
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              {bmiAnalysis.exercisePlan.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-800 font-mono-numbers shadow-2xs">
              เป้าหมาย: ~{bmiAnalysis.exercisePlan.weeklyTargetMinutes} นาที/สัปดาห์
            </span>
          </div>
        </div>

        <p className="text-xs text-neutral-700 leading-relaxed">
          {bmiAnalysis.exercisePlan.description}
        </p>

        {/* 2-Column Activity Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cardio / Aerobic */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              การออกกำลังกายแบบคาร์ดิโอ / แอโรบิก (Aerobic Cardio)
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {bmiAnalysis.exercisePlan.cardioRoutine}
            </p>
          </div>

          {/* Strength / Resistance */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              การฝึกเสริมสร้างกล้ามเนื้อ (Resistance & Strength)
            </span>
            <p className="text-xs text-neutral-700 leading-relaxed">
              {bmiAnalysis.exercisePlan.strengthRoutine}
            </p>
          </div>
        </div>

        {/* Recommended Activities Badges & Precautions */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-neutral-200/60">
          <div>
            <span className="text-neutral-500 font-medium mr-2">กิจกรรมที่แนะนำ:</span>
            <span className="text-neutral-800 font-semibold">
              {bmiAnalysis.exercisePlan.recommendedActivities.join(' · ')}
            </span>
          </div>

          <button
            onClick={() => setShowFullPlan(!showFullPlan)}
            className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold self-start sm:self-auto hover:underline"
          >
            {showFullPlan ? 'ย่อข้อควรระวัง' : 'ดูข้อควรระวังเพื่อความปลอดภัย'}
          </button>
        </div>

        {/* Expandable Safety Precaution */}
        {showFullPlan && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>ข้อควรระวังด้านความปลอดภัย:</strong>
              <p className="mt-0.5 text-neutral-700">
                {bmiAnalysis.exercisePlan.precautions}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
