import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Trophy,
  Flame,
  Award,
} from 'lucide-react';
import { WeeklyScoreBreakdown, UserProfile } from '../types/nutrition';

interface WeeklyScoreShareModalProps {
  scoreBreakdown: WeeklyScoreBreakdown;
  profile: UserProfile;
  onClose: () => void;
}

export const WeeklyScoreShareModal: React.FC<WeeklyScoreShareModalProps> = ({
  scoreBreakdown,
  profile,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  // Render social card onto 1080x1080 HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#064e3b'); // emerald-900
    bgGradient.addColorStop(0.5, '#022c22'); // emerald-950
    bgGradient.addColorStop(1, '#051b14');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle ambient radial glow circles
    const radGlow1 = ctx.createRadialGradient(200, 200, 20, 200, 200, 450);
    radGlow1.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
    radGlow1.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow1;
    ctx.fillRect(0, 0, width, height);

    const radGlow2 = ctx.createRadialGradient(880, 880, 20, 880, 880, 450);
    radGlow2.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
    radGlow2.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow2;
    ctx.fillRect(0, 0, width, height);

    // Outer border frame
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // 2. Top Header & Brand
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Plus Jakarta Sans", "Prompt", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Nutri5', 80, 110);

    ctx.fillStyle = '#34d399';
    ctx.font = '500 20px "Prompt", sans-serif';
    ctx.fillText('· แดชบอร์ดโภชนาการอาหาร 5 หมู่', 195, 110);

    // Top Right Pill
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.roundRect(width - 340, 75, 260, 48, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WEEKLY HEALTH REPORT', width - 210, 106);

    // 3. Card Title
    ctx.fillStyle = '#f0fdf4';
    ctx.font = 'bold 42px "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('สรุปผลคะแนนสุขภาพ & โภชนาการประจำสัปดาห์', width / 2, 195);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '400 22px "Prompt", sans-serif';
    ctx.fillText('ประเมินความสมดุลอาหาร 5 หมู่ตามสูตร 2:1:1 และการควบคุมพลังงาน', width / 2, 235);

    // 4. Center Score Dial Ring
    const centerX = width / 2;
    const centerY = 410;
    const radius = 130;

    // Background track ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Foreground progress ring
    const scoreAngle = (scoreBreakdown.overallScore / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#10b981';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score text inside ring
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(scoreBreakdown.overallScore.toString(), centerX, centerY + 28);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 22px "Prompt", sans-serif';
    ctx.fillText('/ 100 คะแนน', centerX, centerY + 65);

    // Grade & Streak Badges below dial
    // Grade pill
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(centerX - 190, 580, 170, 50, 25);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Plus Jakarta Sans", "Prompt", sans-serif';
    ctx.fillText(`เกรด ${scoreBreakdown.grade}`, centerX - 105, 614);

    // Streak pill
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(centerX + 20, 580, 170, 50, 25);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "JetBrains Mono", "Prompt", sans-serif';
    ctx.fillText(`🔥 ${scoreBreakdown.streakDays} DAYS`, centerX + 105, 614);

    // 5. Four Health Pillars Breakdown Box
    const boxX = 100;
    const boxY = 665;
    const boxW = width - 200;
    const boxH = 240;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const pillars = [
      {
        title: 'ความสมบูรณ์อาหาร 5 หมู่',
        score: scoreBreakdown.foodGroupBalanceScore,
        max: 35,
        color: '#10b981',
      },
      {
        title: 'การควบคุมพลังงาน TDEE',
        score: scoreBreakdown.calorieAdherenceScore,
        max: 25,
        color: '#f59e0b',
      },
      {
        title: 'สมดุลการดื่มน้ำ (Hydration)',
        score: scoreBreakdown.hydrationScore,
        max: 20,
        color: '#0ea5e9',
      },
      {
        title: 'ใยอาหาร & สุขภาพร่างกาย',
        score: scoreBreakdown.lifestyleHabitsScore,
        max: 20,
        color: '#a855f7',
      },
    ];

    pillars.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const px = boxX + 40 + col * (boxW / 2 - 20);
      const py = boxY + 45 + row * 95;
      const barW = boxW / 2 - 80;

      // Label & Score
      ctx.textAlign = 'left';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 20px "Prompt", sans-serif';
      ctx.fillText(p.title, px, py);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "JetBrains Mono", sans-serif';
      ctx.fillText(`${p.score} / ${p.max}`, px + barW, py);

      // Track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(px, py + 12, barW, 12, 6);
      ctx.fill();

      // Fill
      const fillW = Math.max(8, (p.score / p.max) * barW);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(px, py + 12, fillW, 12, 6);
      ctx.fill();
    });

    // 6. User Motto Banner
    ctx.fillStyle = '#fef08a';
    ctx.font = '600 22px "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ "สัปดาห์นี้ฉันทานอาหารครบ 5 หมู่ตามสูตร 2:1:1 สำเร็จแล้ว!" ✨', width / 2, 945);

    // 7. Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '400 18px "Prompt", sans-serif';
    ctx.fillText(
      `สรีระ: ${profile.weightKg} กก. · BMI ${((profile.weightKg / Math.pow(profile.heightCm / 100, 2))).toFixed(1)} · อ้างอิงสูตร 2:1:1 สำนักโภชนาการ กรมอนามัย`,
      width / 2,
      995
    );

    setIsGenerating(false);
  }, [scoreBreakdown, profile]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `nutri5-weekly-health-score-${scoreBreakdown.overallScore}pts.png`;
    link.href = imageUri;
    link.click();
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      });
    } catch (err) {
      console.warn('Clipboard write failed, fallback to download:', err);
      handleDownloadImage();
    }
  };

  const handleShareNative = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'nutri5-health-score.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'ผลคะแนนสุขภาพรายสัปดาห์ Nutri5',
            text: `สัปดาห์นี้ฉันได้คะแนนสุขภาพ ${scoreBreakdown.overallScore}/100 (เกรด ${scoreBreakdown.grade}) รักษาวินัยอาหาร 5 หมู่ต่อเนื่อง ${scoreBreakdown.streakDays} วัน!`,
            files: [file],
          });
        } else {
          handleDownloadImage();
        }
      });
    } catch (e) {
      handleDownloadImage();
    }
  };

  const handleCopyTextSummary = () => {
    const text = `🏆 ผลคะแนนสุขภาพรายสัปดาห์จาก Nutri5:
• คะแนนรวม: ${scoreBreakdown.overallScore}/100 คะแนน (เกรด ${scoreBreakdown.grade})
• Streak ความต่อเนื่อง: ${scoreBreakdown.streakDays} วันติดต่อกัน
• ความสมบูรณ์อาหาร 5 หมู่: ${scoreBreakdown.foodGroupBalanceScore}/35
• การควบคุมพลังงาน TDEE: ${scoreBreakdown.calorieAdherenceScore}/25
• สมดุลการดื่มน้ำ: ${scoreBreakdown.hydrationScore}/20
• ไลฟ์สไตล์ & ใยอาหาร: ${scoreBreakdown.lifestyleHabitsScore}/20

✨ จัดจานตามสูตร 2:1:1 อ้างอิงกรมอนามัย`;
    navigator.clipboard?.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 leading-tight">
                แชร์สรุปคะแนนสุขภาพรายสัปดาห์
              </h3>
              <p className="text-xs text-neutral-500">
                การ์ดภาพความละเอียดสูง 1080x1080 สำหรับแชร์ลงโซเชียลมีเดีย
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Visual Preview Box */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-950 shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[380px] object-contain rounded-2xl"
          />
          {isGenerating && (
            <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center text-white text-xs font-semibold gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
              <span>กำลังเรนเดอร์การ์ดสุขภาพ...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadImage}
              className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดภาพการ์ด (PNG)</span>
            </button>

            <button
              onClick={handleShareNative}
              className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>แชร์ภาพไปยังแอปอื่น</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleCopyImage}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">คัดลอกรูปภาพแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-500" />
                  <span>คัดลอกรูปภาพลงคลิปบอร์ด</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyTextSummary}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">คัดลอกข้อความแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-500" />
                  <span>คัดลอกข้อความสรุปคะแนน</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips Footer */}
        <p className="text-[11px] text-neutral-400 text-center">
          ภาพการ์ดสร้างขึ้นด้วย HTML5 Canvas โดยตรงบนเครื่องของคุณ สามารถนำไปโพสต์บน Facebook, Instagram Story, LINE หรือ X ได้ทันที
        </p>
      </div>
    </div>
  );
};
