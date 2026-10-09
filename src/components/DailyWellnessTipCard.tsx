import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Droplets,
  Heart,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import {
  DailyTargets,
  LoggedMealItem,
  UserProfile,
  FoodGroupServing,
  WeeklyScoreBreakdown,
} from '../types/nutrition';

interface DailyWellnessTipData {
  headline: string;
  highlight: string;
  analysis: string;
  actionSteps: string[];
  condimentTip?: string;
  focusFoodGroup?: string;
  encouragement: string;
}

interface DailyWellnessTipCardProps {
  targets: DailyTargets;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  waterIntakeMl: number;
  actualFoodGroups: FoodGroupServing;
  scoreBreakdown?: WeeklyScoreBreakdown;
  profile: UserProfile;
  logs: LoggedMealItem[];
}

export const DailyWellnessTipCard: React.FC<DailyWellnessTipCardProps> = ({
  targets,
  totals,
  waterIntakeMl,
  actualFoodGroups,
  scoreBreakdown,
  profile,
  logs,
}) => {
  const [tip, setTip] = useState<DailyWellnessTipData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [source, setSource] = useState<string>('ai');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchTip = async () => {
    setIsLoading(true);
    try {
      const payload = {
        actualCalories: totals.calories,
        targetCalories: targets.targetCalories,
        macros: totals,
        waterIntakeMl,
        targetWaterMl: targets.targetWaterMl,
        weeklyScore: scoreBreakdown?.overallScore || 85,
        grade: scoreBreakdown?.grade || 'A',
        streakDays: scoreBreakdown?.streakDays || 1,
        foodGroups: actualFoodGroups,
        profile,
        recentMealNames: logs.map((l) => l.name),
      };

      const res = await fetch('/api/wellness-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('API response not ok');
      const data = await res.json();
      if (data.tip) {
        setTip(data.tip);
        setSource(data.source || 'gemini-ai');
        setLastUpdated(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
        try {
          localStorage.setItem('nutri5_cached_daily_tip', JSON.stringify(data.tip));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Failed to fetch wellness tip from server, using local intelligent tip:', err);
      // Local fallback
      const fallbackTip: DailyWellnessTipData = {
        headline: totals.sodium > 1200 ? 'คุมโซเดียมซ่อนเร้น & ดูแลสุขภาพไต' : 'รักษาสมดุล 5 หมู่ตามสูตร 2:1:1',
        highlight:
          totals.sodium > 1200
            ? 'เลือกใช้ซีอิ๊วขาวหรือน้ำปลาสูตรลดโซเดียม 40-50% และเลี่ยงการซดน้ำแกงจนหมดชาม'
            : 'จัดจานให้มีผัก 2 ส่วน ข้าวแป้ง 1 ส่วน และเนื้อสัตว์ไม่ติดมัน 1 ส่วน',
        analysis:
          totals.sodium > 1200
            ? `วันนี้ได้รับโซเดียมสะสม ${totals.sodium} มก. จากมื้ออาหารหลัก ควรระวังน้ำแกงและน้ำจิ้มปรุงรสเค็ม`
            : `บริโภคพลังงานไปแล้ว ${totals.calories} / ${targets.targetCalories} kcal น้ำดื่ม ${waterIntakeMl} มล.`,
        actionSteps: [
          'เลือกเครื่องปรุงที่มีสัญลักษณ์ "ลดโซเดียม" หรือ "ทางเลือกสุขภาพ"',
          'ใช้มะนาวสด พริกไทย หรือใบกะเพราชูรสชาติแทนการเติมน้ำปลาหรือเกลือเพิ่ม',
          'ดื่มน้ำเปล่าเพิ่มอีก 1-2 แก้ว เพื่อช่วยไตขับโซเดียมส่วนเกินและลดบวมน้ำ',
        ],
        condimentTip: 'ใช้ซีอิ๊วขาวลดโซเดียม 1 ช้อนชา หรือน้ำมันหอยลดโซเดียมแทนการสาดเครื่องปรุงหลายชนิดพร้อมกัน',
        focusFoodGroup: 'กลุ่มเครื่องปรุงรสและผักใบเขียว',
        encouragement: 'การเลือกเครื่องปรุงที่ดีเพียง 1 อย่างในวันนี้ ช่วยลดภาระการทำงานของไตและหลอดเลือดได้มหาศาลครับ!',
      };
      setTip(fallbackTip);
      setSource('smart-rules');
      setLastUpdated(new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check cached tip first
    try {
      const cached = localStorage.getItem('nutri5_cached_daily_tip');
      if (cached && !tip) {
        setTip(JSON.parse(cached));
      }
    } catch (e) {}

    fetchTip();
  }, [totals.calories, waterIntakeMl, logs.length]);

  if (!tip && !isLoading) return null;

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-5 border-emerald-900/15 bg-gradient-to-br from-white via-white to-emerald-50/25">
      {/* Header section with AI badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>AI Daily Wellness Tip</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>วิเคราะห์จากมื้ออาหารและคะแนนสุขภาพวันนี้</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <span>{tip?.headline || 'คำแนะนำสุขภาพเฉพาะคุณวันนี้'}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lastUpdated && (
            <span className="text-[11px] text-neutral-400 font-mono-numbers hidden sm:inline">
              อัปเดต {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchTip}
            disabled={isLoading}
            className="py-1.5 px-3 rounded-xl border border-emerald-200/80 bg-white hover:bg-emerald-50 text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition-all shadow-2xs disabled:opacity-60"
            title="ให้ AI วิเคราะห์ข้อมูลอาหารและคะแนนสุขภาพล่าสุดอีกครั้ง"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ใหม่ด้วย AI'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-6 space-y-3 animate-pulse">
          <div className="h-5 bg-emerald-100/60 rounded-md w-3/4" />
          <div className="h-4 bg-neutral-100 rounded-md w-full" />
          <div className="h-4 bg-neutral-100 rounded-md w-5/6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
            <div className="h-16 bg-neutral-100 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Highlight Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-200/80">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                  {tip?.highlight}
                </h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {tip?.analysis}
                </p>
              </div>
            </div>
          </div>

          {/* Action Steps Cards */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-800 block">
              วิธีปรับปรุงพฤติกรรมการทานอาหารวันนี้ (Actionable Steps):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tip?.actionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-neutral-200/90 bg-white hover:border-emerald-300 transition-all shadow-2xs flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 font-mono-numbers">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Condiment & Food Tip Box */}
          {tip?.condimentTip && (
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-start sm:items-center gap-2">
                <ChefHat className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <strong className="text-amber-900 mr-1.5">เคล็ดลับการเลือกเครื่องปรุง:</strong>
                  <span className="text-amber-950/90">{tip.condimentTip}</span>
                </div>
              </div>

              {tip?.focusFoodGroup && (
                <span className="self-start sm:self-auto shrink-0 px-2.5 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 font-semibold text-[11px]">
                  เน้น: {tip.focusFoodGroup}
                </span>
              )}
            </div>
          )}

          {/* Encouragement message */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium italic">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              "{tip?.encouragement}"
            </span>

            <span className="text-[11px] text-neutral-400 font-mono-numbers">
              ขับเคลื่อนด้วย Gemini 3.8 Flash
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
