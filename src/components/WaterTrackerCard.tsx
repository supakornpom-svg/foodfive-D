import React, { useState } from 'react';
import { UserProfile } from '../types/nutrition';
import { Droplets, Plus, Minus, RotateCcw, CheckCircle2, Sparkles, Clock, Info } from 'lucide-react';

interface WaterTrackerCardProps {
  currentWaterMl: number;
  targetWaterMl: number;
  profile: UserProfile;
  onUpdateWater: (amountMl: number) => void;
  onResetWater: () => void;
}

export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({
  currentWaterMl,
  targetWaterMl,
  profile,
  onUpdateWater,
  onResetWater,
}) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const percentage = Math.min(150, Math.round((currentWaterMl / (targetWaterMl || 1)) * 100));
  const remainingMl = Math.max(0, targetWaterMl - currentWaterMl);

  const standardGlassMl = 250;
  const currentGlasses = (currentWaterMl / standardGlassMl).toFixed(1);
  const targetGlasses = (targetWaterMl / standardGlassMl).toFixed(1);

  // Activity bonus description
  const activityBonusMap: Record<string, { label: string; bonus: number }> = {
    sedentary: { label: 'นั่งทำงานเป็นหลัก', bonus: 0 },
    light: { label: 'ออกกำลังกายเบาๆ', bonus: 250 },
    moderate: { label: 'ออกกำลังกายปานกลาง', bonus: 500 },
    active: { label: 'ออกกำลังกายหนัก', bonus: 750 },
    very_active: { label: 'นักกีฬา / แรงงานหนัก', bonus: 1000 },
  };

  const activityInfo = activityBonusMap[profile.activityLevel] || { label: 'ปานกลาง', bonus: 500 };
  const baseWater = Math.round(profile.weightKg * 33);

  const handleAddWater = (ml: number) => {
    onUpdateWater(Math.max(0, currentWaterMl + ml));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseInt(customAmount);
    if (!isNaN(ml) && ml > 0) {
      handleAddWater(ml);
      setCustomAmount('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="wellness-card rounded-2xl p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-800/80 font-medium mb-1">
            <span>สมดุลของเหลวในร่างกาย</span>
            <span aria-hidden="true">·</span>
            <span>สูตรน้ำหนักตัว ({profile.weightKg} กก. × 33 มล.) + ระดับกิจกรรม ({activityInfo.label})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-sky-600" />
            </div>
            <span>บันทึกและติดตามปริมาณน้ำดื่มประจำวัน (Hydration Tracker)</span>
          </h2>
        </div>

        {currentWaterMl > 0 && (
          <button
            onClick={onResetWater}
            className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 transition-colors self-start sm:self-auto py-1 px-2.5 rounded-lg border border-neutral-200/80 hover:bg-neutral-50"
            title="รีเซ็ตยอดน้ำดื่มวันนี้เป็น 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตวันนี้</span>
          </button>
        )}
      </div>

      {/* Main Hydration Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Intake */}
        <div className="bg-sky-50/50 rounded-xl p-4 border border-sky-100">
          <span className="text-xs font-medium text-sky-800 block">
            ดื่มแล้ววันนี้ (Actual Intake)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono-numbers text-sky-950">
              {currentWaterMl.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-sky-700">มล.</span>
          </div>
          <p className="mt-1 text-xs text-sky-700">
            เทียบเท่าประมาณ <strong className="font-mono-numbers">{currentGlasses}</strong> แก้ว (แก้ว 250 มล.)
          </p>
        </div>

        {/* Target Intake */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80">
          <span className="text-xs font-medium text-neutral-600 block">
            เป้าหมายที่ควรได้รับ (Daily Target)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono-numbers text-neutral-900">
              {targetWaterMl.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-neutral-500">มล.</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            ฐานน้ำหนัก {baseWater} มล. + กิจกรรม {activityInfo.bonus > 0 ? `+${activityInfo.bonus} มล.` : '0 มล.'}
          </p>
        </div>

        {/* Status / Remaining */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-600 block">
              สถานะความคืบหน้า (Progress)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono-numbers text-neutral-900">
                {percentage}%
              </span>
              <span className="text-xs font-medium text-neutral-500">
                {remainingMl === 0 ? 'ครบเป้าหมาย 🎉' : `ขาดอีก ${remainingMl.toLocaleString()} มล.`}
              </span>
            </div>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
            {currentWaterMl >= targetWaterMl ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ดื่มน้ำเพียงพอต่อความต้องการแล้ว</span>
              </>
            ) : (
              <span className="text-neutral-500">
                เป้าหมายทั้งหมด ~{targetGlasses} แก้ว/วัน
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar with Water Flow Visual */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-neutral-600">
          <span className="font-medium flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            แถบความคืบหน้าน้ำดื่มวันนี้
          </span>
          <span className="font-mono-numbers text-neutral-700">
            <strong>{currentWaterMl.toLocaleString()}</strong> / {targetWaterMl.toLocaleString()} มล.
          </span>
        </div>

        {/* Cylinder Progress Bar */}
        <div className="w-full bg-neutral-100 rounded-full h-4 overflow-hidden p-0.5 border border-neutral-200 shadow-inner relative">
          <div
            className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
              currentWaterMl >= targetWaterMl
                ? 'bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-500'
                : 'bg-gradient-to-r from-sky-400 to-sky-600'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          >
            {percentage >= 15 && (
              <span className="text-[10px] font-bold text-white font-mono-numbers drop-shadow-xs">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Buttons Bar */}
      <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-600" />
            กดบันทึกน้ำดื่มอย่างรวดเร็ว (Quick Log):
          </span>
          <span className="text-[11px] text-neutral-500">
            เลือกขนาดภาชนะเพื่อบันทึกทันที
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {/* +200 ml */}
          <button
            onClick={() => handleAddWater(200)}
            className="py-2.5 px-3 rounded-lg bg-white border border-neutral-200 hover:border-sky-300 hover:bg-sky-50/50 text-neutral-800 text-xs font-semibold transition-all shadow-2xs flex flex-col items-center justify-center gap-0.5 group"
          >
            <span className="text-sm font-bold text-sky-600 group-hover:scale-110 transition-transform">
              +200 ml
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">แก้วเล็ก / ถ้วย</span>
          </button>

          {/* +250 ml */}
          <button
            onClick={() => handleAddWater(250)}
            className="py-2.5 px-3 rounded-lg bg-white border border-neutral-200 hover:border-sky-300 hover:bg-sky-50/50 text-neutral-800 text-xs font-semibold transition-all shadow-2xs flex flex-col items-center justify-center gap-0.5 group"
          >
            <span className="text-sm font-bold text-sky-600 group-hover:scale-110 transition-transform">
              +250 ml
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">แก้วน้ำมาตรฐาน</span>
          </button>

          {/* +500 ml */}
          <button
            onClick={() => handleAddWater(500)}
            className="py-2.5 px-3 rounded-lg bg-white border border-neutral-200 hover:border-sky-300 hover:bg-sky-50/50 text-neutral-800 text-xs font-semibold transition-all shadow-2xs flex flex-col items-center justify-center gap-0.5 group"
          >
            <span className="text-sm font-bold text-sky-600 group-hover:scale-110 transition-transform">
              +500 ml
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">กระบอกน้ำ / แก้วเก็บความเย็น</span>
          </button>

          {/* +600 ml */}
          <button
            onClick={() => handleAddWater(600)}
            className="py-2.5 px-3 rounded-lg bg-white border border-neutral-200 hover:border-sky-300 hover:bg-sky-50/50 text-neutral-800 text-xs font-semibold transition-all shadow-2xs flex flex-col items-center justify-center gap-0.5 group"
          >
            <span className="text-sm font-bold text-sky-600 group-hover:scale-110 transition-transform">
              +600 ml
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">ขวดน้ำ 600 มล.</span>
          </button>

          {/* Custom ml button */}
          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="py-2.5 px-3 rounded-lg bg-white border border-neutral-200 hover:border-sky-300 hover:bg-sky-50/50 text-neutral-800 text-xs font-semibold transition-all shadow-2xs flex flex-col items-center justify-center gap-0.5"
          >
            <span className="text-sm font-bold text-neutral-700">
              {showCustomInput ? 'ปิด' : 'กำหนดเอง'}
            </span>
            <span className="text-[10px] text-neutral-500 font-normal">ระบุมิลลิลิตร</span>
          </button>
        </div>

        {/* Custom ml Form */}
        {showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="pt-2 flex items-center gap-2 max-w-sm">
            <input
              type="number"
              min="10"
              max="2000"
              step="50"
              placeholder="ระบุปริมาณ เช่น 350 มล."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono-numbers"
              autoFocus
            />
            <button
              type="submit"
              className="py-1.5 px-4 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors"
            >
              + บันทึก
            </button>
          </form>
        )}

        {/* Undo button */}
        {currentWaterMl > 0 && (
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={() => handleAddWater(-250)}
              className="text-xs text-neutral-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              title="ลดยอดน้ำดื่มออก 250 มล."
            >
              <Minus className="w-3.5 h-3.5" />
              ลดยอดน้ำดื่มออก 250 มล. (หากกดเกิน)
            </button>
          </div>
        )}
      </div>

      {/* Hydration Health Schedule Guide */}
      <div className="border border-sky-100 bg-sky-50/20 rounded-xl p-4 text-xs space-y-2">
        <span className="font-bold text-sky-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-600" />
          ตารางเวลาการดื่มน้ำเพื่อสุขภาพที่มีประสิทธิภาพสูงสุด:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-neutral-700">
          <div className="bg-white p-2.5 rounded-lg border border-sky-100">
            <strong className="text-sky-800 block mb-0.5">1. หลังตื่นนอน (1 แก้ว)</strong>
            <span>กระตุ้นระบบขับถ่าย ปลุกอวัยวะภายในให้ตื่นตัว</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-sky-100">
            <strong className="text-sky-800 block mb-0.5">2. ก่อนอาหาร 30 นาที</strong>
            <span>เตรียมระบบย่อยอาหาร ไม่อิ่มน้ำเกินไป</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-sky-100">
            <strong className="text-sky-800 block mb-0.5">3. ระหว่างวัน (จิบบ่อยๆ)</strong>
            <span>รักษาความชุ่มชื้น ลดอาการง่วง สมองแล่น</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-sky-100">
            <strong className="text-sky-800 block mb-0.5">4. ก่อนนอน 1 ชม.</strong>
            <span>ป้องกันเลือดข้นขณะนอนหลับ ไม่รบกวนการพักผ่อน</span>
          </div>
        </div>
      </div>
    </div>
  );
};
