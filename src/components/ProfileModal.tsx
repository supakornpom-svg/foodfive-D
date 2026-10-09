import React, { useState } from 'react';
import { UserProfile, DailyTargets, ActivityLevel, HealthGoal, Gender, HealthConstraint } from '../types/nutrition';
import { calculateDailyTargets } from '../utils/nutritionCalculators';
import { HEALTH_CONSTRAINTS_LIST } from '../data/healthConstraintsData';
import { Calculator, Check, ShieldAlert } from 'lucide-react';

interface ProfileModalProps {
  currentProfile: UserProfile;
  onSaveProfile: (newProfile: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentProfile,
  onSaveProfile,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);

  // Live preview targets based on form values
  const previewTargets: DailyTargets = calculateDailyTargets(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[92vh] overflow-y-auto space-y-5">
        <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
          <div>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              คำนวณความต้องการพลังงานส่วนบุคคล
            </span>
            <h2 className="text-lg font-bold text-neutral-900">
              ข้อมูลสรีระและเป้าหมายสุขภาพ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                เพศ
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  className={`py-1.5 px-3 text-xs rounded-lg border font-medium transition-colors ${
                    profile.gender === 'male'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  ชาย
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                  className={`py-1.5 px-3 text-xs rounded-lg border font-medium transition-colors ${
                    profile.gender === 'female'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  หญิง
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                อายุ (ปี)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 25 })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
              />
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                น้ำหนัก (กก.)
              </label>
              <input
                type="number"
                min="30"
                max="250"
                step="0.5"
                required
                value={profile.weightKg}
                onChange={(e) => setProfile({ ...profile, weightKg: parseFloat(e.target.value) || 60 })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-700 block mb-1">
                ส่วนสูง (ซม.)
              </label>
              <input
                type="number"
                min="100"
                max="230"
                required
                value={profile.heightCm}
                onChange={(e) => setProfile({ ...profile, heightCm: parseInt(e.target.value) || 165 })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono-numbers"
              />
            </div>
          </div>

          {/* Live BMI Indicator Banner */}
          <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: previewTargets.bmiAnalysis.statusColor }} />
              <div>
                <span className="font-bold text-neutral-900">
                  BMI: <span className="font-mono-numbers">{previewTargets.bmiAnalysis.bmi}</span>
                </span>
                <span className="text-neutral-500 ml-1.5">
                  ({previewTargets.bmiAnalysis.statusLabel})
                </span>
              </div>
            </div>
            <div className="text-right text-[11px] text-neutral-500">
              ช่วงน้ำหนักมาตรฐาน: <strong className="font-mono-numbers text-neutral-800">{previewTargets.bmiAnalysis.idealWeightMin} - {previewTargets.bmiAnalysis.idealWeightMax}</strong> กก.
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              ระดับกิจกรรมทางกายภาพ (Activity Level)
            </label>
            <select
              value={profile.activityLevel}
              onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as ActivityLevel })}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="sedentary">นั่งทำงานเป็นหลัก ไม่ออกกำลังกาย (x1.2)</option>
              <option value="light">ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์ (x1.375)</option>
              <option value="moderate">ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์ (x1.55)</option>
              <option value="active">ออกกำลังกายหนัก 6-7 วัน/สัปดาห์ (x1.725)</option>
              <option value="very_active">นักกีฬา / งานใช้แรงงานหนักเป็นประจำ (x1.9)</option>
            </select>
          </div>

          {/* Health Goal */}
          <div>
            <label className="text-xs font-medium text-neutral-700 block mb-1">
              เป้าหมายสุขภาพ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'balance', label: 'รักษาสมดุล', desc: 'TDEE คงที่' },
                { id: 'weight_loss', label: 'ลดน้ำหนัก/ไขมัน', desc: '-450 kcal' },
                { id: 'muscle_gain', label: 'สร้างกล้ามเนื้อ', desc: '+350 kcal' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, goal: g.id as HealthGoal })}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    profile.goal === g.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-xs font-bold block">{g.label}</span>
                  <span className="text-[10px] text-neutral-500 block">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Health Constraints & Precautions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>ข้อจำกัดและข้อควรระวังด้านสุขภาพ (Health Constraints)</span>
              </label>
              <span className="text-[11px] text-neutral-400">เลือกได้มากกว่า 1 ข้อ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {HEALTH_CONSTRAINTS_LIST.map((item) => {
                const isSelected = (profile.healthConstraints || []).includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const current = profile.healthConstraints || [];
                      const updated = isSelected
                        ? current.filter(x => x !== item.id)
                        : [...current, item.id];
                      setProfile({ ...profile, healthConstraints: updated });
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-1 ring-emerald-500'
                        : 'border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border text-[10px] ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                          : 'border-neutral-300 bg-white'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold block truncate">
                        {item.shortLabel}
                      </span>
                      <span className="text-[10px] text-neutral-500 block line-clamp-1">
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Calculated Output Box */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-2">
            <span className="text-xs font-bold text-neutral-800 block">
              ผลการคำนวณความต้องการพลังงานอัตโนมัติ:
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-neutral-100">
                <span className="text-[10px] text-neutral-500 block">BMR (เผาผลาญพื้นฐาน)</span>
                <span className="text-base font-bold font-mono-numbers text-neutral-900">
                  {previewTargets.bmr}
                </span>
                <span className="text-[10px] text-neutral-400 block">kcal</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-neutral-100">
                <span className="text-[10px] text-neutral-500 block">TDEE (ใช้พลังงานรวม)</span>
                <span className="text-base font-bold font-mono-numbers text-neutral-900">
                  {previewTargets.tdee}
                </span>
                <span className="text-[10px] text-neutral-400 block">kcal</span>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-medium block">เป้าหมายพลังงานต่อวัน</span>
                <span className="text-base font-bold font-mono-numbers text-emerald-900">
                  {previewTargets.targetCalories}
                </span>
                <span className="text-[10px] text-emerald-700 block">kcal</span>
              </div>
            </div>

            <div className="text-[11px] text-neutral-500 pt-1 flex justify-between font-mono-numbers">
              <span>โปรตีน: {previewTargets.targetProteinGrams}g</span>
              <span>คาร์บ: {previewTargets.targetCarbsGrams}g</span>
              <span>ไขมัน: {previewTargets.targetFatGrams}g</span>
              <span>น้ำดื่ม: {previewTargets.targetWaterMl} ml</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              บันทึกและอัปเดตแดชบอร์ด
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
