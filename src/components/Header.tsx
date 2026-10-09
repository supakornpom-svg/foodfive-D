import React from 'react';
import { User, Activity, Flame, Utensils, Award, Droplets } from 'lucide-react';
import { UserProfile, DailyTargets } from '../types/nutrition';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  targets: DailyTargets;
  currentWaterMl?: number;
  targetWaterMl?: number;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  targets,
  currentWaterMl = 0,
  targetWaterMl = 0,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-emerald-950/10 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Distinctive Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs group-hover:from-emerald-500 group-hover:to-teal-600 transition-all">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-neutral-900 block leading-tight">
                  Nutri<span className="text-emerald-700">5</span>
                </span>
                <span className="text-[11px] font-medium text-emerald-800/80 block -mt-0.5">
                  สมดุลโภชนาการ 5 หมู่
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Segmented Control */}
          <nav className="hidden md:flex items-center p-1 bg-neutral-100/90 rounded-xl border border-neutral-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              ภาพรวม & พลังงาน
            </button>
            <button
              onClick={() => setActiveTab('food_groups')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'food_groups'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              อาหาร 5 หมู่
            </button>
            <button
              onClick={() => setActiveTab('meals')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'meals'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              เมนู & วัตถุดิบตู้เย็น
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'planner'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              วางแผน 7 วัน & ซื้อของ
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              คะแนนสุขภาพ & เหรียญ
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'journal'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/40'
              }`}
            >
              บันทึกอาหารวันนี้
            </button>
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-600 border-r border-neutral-200/80 pr-3">
              <div className="flex items-center gap-1.5" title="ปริมาณน้ำดื่มวันนี้">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>
                  น้ำ: <strong className="font-mono-numbers text-neutral-900">{currentWaterMl}</strong>/{targetWaterMl} ml
                </span>
              </div>
              <span className="text-neutral-300">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: targets.bmiAnalysis.statusColor }} />
                <span>
                  BMI: <strong className="font-mono-numbers text-neutral-900">{targets.bmiAnalysis.bmi}</strong>
                </span>
              </div>
              <span className="text-neutral-300">·</span>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  TDEE: <strong className="font-mono-numbers text-neutral-900">{targets.tdee}</strong> kcal
                </span>
              </div>
            </div>

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-neutral-800 bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-900 border border-neutral-200/70 hover:border-emerald-200 rounded-xl transition-all whitespace-nowrap shadow-2xs"
              title="ตั้งค่าข้อมูลร่างกายและความต้องการพลังงาน"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {profile.gender === 'male' ? 'ช' : 'ญ'}
              </div>
              <span className="hidden sm:inline">
                {profile.weightKg} กก. · BMI {targets.bmiAnalysis.bmi}
              </span>
              <span className="sm:hidden font-mono-numbers">BMI {targets.bmiAnalysis.bmi}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-neutral-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'overview' ? 'bg-emerald-700 text-white font-semibold shadow-xs' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => setActiveTab('food_groups')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'food_groups' ? 'bg-emerald-700 text-white font-semibold shadow-xs' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            อาหาร 5 หมู่
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'meals' ? 'bg-emerald-700 text-white font-semibold shadow-xs' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            เมนู & ตู้เย็น
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'planner' ? 'bg-emerald-700 text-white font-semibold shadow-xs' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            วางแผน & ซื้อของ
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'analytics' ? 'bg-emerald-700 text-white font-semibold shadow-xs' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            คะแนน & เหรียญ
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'journal' ? 'bg-emerald-700 text-white font-semibold shadow-xs' : 'text-neutral-600 bg-neutral-100'
            }`}
          >
            บันทึกอาหาร
          </button>
        </div>
      </div>
    </header>
  );
};
