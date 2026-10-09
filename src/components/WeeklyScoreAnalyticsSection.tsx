import React, { useState } from 'react';
import {
  WeeklyScoreBreakdown,
  GamificationBadge,
  DailyTargets,
  DayHistoryPoint,
  LoggedMealItem,
} from '../types/nutrition';
import {
  calculateWeeklyHealthScore,
  getGamificationBadges,
} from '../utils/gamificationCalculators';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Droplets,
  HeartPulse,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  Info,
  Scale,
  Share2,
} from 'lucide-react';
import { WeeklyScoreShareModal } from './WeeklyScoreShareModal';
import { UserProfile } from '../types/nutrition';

interface WeeklyScoreAnalyticsSectionProps {
  targets: DailyTargets;
  logs: LoggedMealItem[];
  waterIntakeMl: number;
  sevenDayHistory: DayHistoryPoint[];
  onOpenJournal: () => void;
  onOpenProfile: () => void;
  profile?: UserProfile;
}

export const WeeklyScoreAnalyticsSection: React.FC<WeeklyScoreAnalyticsSectionProps> = ({
  targets,
  logs,
  waterIntakeMl,
  sevenDayHistory,
  onOpenJournal,
  onOpenProfile,
  profile,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const scoreBreakdown: WeeklyScoreBreakdown = calculateWeeklyHealthScore(
    targets,
    logs,
    waterIntakeMl,
    sevenDayHistory
  );

  const badges: GamificationBadge[] = getGamificationBadges(
    scoreBreakdown,
    waterIntakeMl,
    logs,
    targets.targetWaterMl
  );

  const unlockedCount = badges.filter(b => b.unlocked).length;

  // Grade color theme
  const getGradeStyle = (grade: WeeklyScoreBreakdown['grade']) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return {
          bg: 'bg-emerald-500',
          textColor: 'text-emerald-700',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          title: 'ยอดเยี่ยมระดับสูงมาก!',
        };
      case 'B':
        return {
          bg: 'bg-teal-500',
          textColor: 'text-teal-700',
          badgeBg: 'bg-teal-100 text-teal-800',
          title: 'ดีมาก อยู่ในเกณฑ์สุขภาพสมดุล',
        };
      case 'C':
        return {
          bg: 'bg-amber-500',
          textColor: 'text-amber-700',
          badgeBg: 'bg-amber-100 text-amber-800',
          title: 'ปานกลาง มีจุดที่สามารถปรับปรุงได้',
        };
      default:
        return {
          bg: 'bg-rose-500',
          textColor: 'text-rose-700',
          badgeBg: 'bg-rose-100 text-rose-800',
          title: 'ควรให้ความสำคัญกับอาหาร 5 หมู่เพิ่มขึ้น',
        };
    }
  };

  const gradeStyle = getGradeStyle(scoreBreakdown.grade);

  return (
    <div className="space-y-6">
      {/* 1. Weekly Health Score (คะแนนสุขภาพรายสัปดาห์ 100 คะแนน) */}
      <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-800/80 font-medium mb-1">
              <span>การประเมินผลโภชนาการและสุขภาพ</span>
              <span aria-hidden="true">·</span>
              <span>วิเคราะห์ 4 มิติเชิงลึก</span>
              <span aria-hidden="true">·</span>
              <span>เกณฑ์มาตรฐานกรมอนามัย</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <span>คะแนนสุขภาพรายสัปดาห์ (Weekly Nutrition & Health Score)</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              title="สร้างภาพการ์ดสรุปคะแนนสุขภาพด้วย Canvas เพื่อแชร์ลงโซเชียลมีเดีย"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>แชร์ภาพผลลัพธ์</span>
            </button>

            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${gradeStyle.badgeBg}`}>
              เกรด {scoreBreakdown.grade} ({gradeStyle.title})
            </span>
          </div>
        </div>

        {/* Score Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Big Score Dial Box */}
          <div className="lg:col-span-4 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-semibold text-emerald-400 block mb-1">
                คะแนนรวมสุขภาพ (OVERALL SCORE)
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-5xl font-black font-mono-numbers text-white tracking-tight">
                  {scoreBreakdown.overallScore}
                </span>
                <span className="text-sm text-neutral-400 font-medium">/ 100 คะแนน</span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-300">ความต่อเนื่อง (Streak):</span>
                <span className="font-bold text-amber-400 flex items-center gap-1 font-mono-numbers">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {scoreBreakdown.streakDays} วันติดต่อกัน
                </span>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* 4 Pillars Breakdown Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pillar 1: 5 Food Groups */}
            <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ความสมบูรณ์ของอาหาร 5 หมู่
                </span>
                <span className="font-mono-numbers font-bold text-neutral-900">
                  {scoreBreakdown.foodGroupBalanceScore} / 35
                </span>
              </div>
              <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(scoreBreakdown.foodGroupBalanceScore / 35) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                ประเมินจากความหลากหลายของกลุ่มสารอาหารที่บริโภคจริง
              </p>
            </div>

            {/* Pillar 2: Calorie Adherence */}
            <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  การควบคุมพลังงาน (TDEE)
                </span>
                <span className="font-mono-numbers font-bold text-neutral-900">
                  {scoreBreakdown.calorieAdherenceScore} / 25
                </span>
              </div>
              <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(scoreBreakdown.calorieAdherenceScore / 25) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                เปรียบเทียบแคลอรี่จริงกับความต้องการร่างกาย
              </p>
            </div>

            {/* Pillar 3: Hydration */}
            <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  สมดุลการดื่มน้ำ (Hydration)
                </span>
                <span className="font-mono-numbers font-bold text-neutral-900">
                  {scoreBreakdown.hydrationScore} / 20
                </span>
              </div>
              <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(scoreBreakdown.hydrationScore / 20) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                ปริมาณน้ำดื่มเทียบกับเป้าหมายตามน้ำหนักและกิจกรรม
              </p>
            </div>

            {/* Pillar 4: Habits & BMI */}
            <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  ใยอาหาร & สุขภาพร่างกาย
                </span>
                <span className="font-mono-numbers font-bold text-neutral-900">
                  {scoreBreakdown.lifestyleHabitsScore} / 20
                </span>
              </div>
              <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(scoreBreakdown.lifestyleHabitsScore / 20) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                ปริมาณกากใยอาหารและเกณฑ์ดัชนีมวลกายมาตรฐาน
              </p>
            </div>
          </div>
        </div>

        {/* Actionable Feedback Highlights */}
        <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 text-xs text-emerald-950 space-y-1.5">
          <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            คำแนะนำเฉพาะบุคคลเพื่อเพิ่มคะแนนสุขภาพ:
          </h4>
          <ul className="space-y-1 pl-5 list-disc text-emerald-900/90 leading-relaxed">
            {scoreBreakdown.feedbackHighlights.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 2. Streak & Gamification Badges (ระบบเหรียญรางวัลและ Streak) */}
      <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
        {/* Streak Highlight Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-mono-numbers tracking-tight">
                  {scoreBreakdown.streakDays} DAYS STREAK!
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white text-orange-700">
                  กำลังมาแรง 🔥
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                คุณรักษาวินัยการรับประทานอาหารและดูแลสุขภาพติดต่อกันอย่างต่อเนื่อง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenJournal}
              className="py-2 px-4 rounded-xl bg-white text-orange-900 font-bold text-xs hover:bg-amber-50 transition-colors shadow-xs"
            >
              บันทึกมื้อต่อไปเพื่อรักษา Streak
            </button>
          </div>
        </div>

        {/* Badges Section Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              เหรียญรางวัลความสำเร็จ (Achievement Badges)
            </h3>
            <p className="text-xs text-neutral-500">
              ปลดล็อกแล้ว <strong className="font-mono-numbers text-neutral-900">{unlockedCount}</strong> จาก {badges.length} เหรียญ
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => {
            const isUnlocked = badge.unlocked;

            const tierStyle = {
              platinum: { bg: 'bg-purple-50', border: 'border-purple-200', tag: 'bg-purple-100 text-purple-800', label: 'Platinum' },
              gold: { bg: 'bg-amber-50', border: 'border-amber-200', tag: 'bg-amber-100 text-amber-800', label: 'Gold' },
              silver: { bg: 'bg-slate-50', border: 'border-slate-200', tag: 'bg-slate-100 text-slate-800', label: 'Silver' },
              bronze: { bg: 'bg-orange-50/50', border: 'border-orange-200', tag: 'bg-orange-100 text-orange-800', label: 'Bronze' },
            }[badge.tier];

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? `${tierStyle.bg} ${tierStyle.border} shadow-2xs`
                    : 'bg-neutral-50/50 border-neutral-200/80 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${tierStyle.tag}`}>
                      {tierStyle.label}
                    </span>

                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {badge.unlockedDate || 'ปลดล็อกแล้ว'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        ยังไม่ปลดล็อก
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-neutral-900">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-neutral-200/60">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 mb-1">
                    <span>ความคืบหน้า</span>
                    <span className="font-mono-numbers font-bold">{badge.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-600' : 'bg-neutral-400'
                      }`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Share Card Canvas Modal */}
      {isShareModalOpen && (
        <WeeklyScoreShareModal
          scoreBreakdown={scoreBreakdown}
          profile={profile || {
            gender: 'male',
            age: 28,
            weightKg: 65,
            heightCm: 172,
            activityLevel: 'moderate',
            goal: 'balance',
          }}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
