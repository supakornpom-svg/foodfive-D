import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client with proper header telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for rule-based fallback tip if Gemini API key is missing or offline
function generateFallbackWellnessTip(data: any) {
  const { macros, waterIntakeMl, targetWaterMl, foodGroups, profile } = data;
  const sodium = macros?.sodium || 0;
  const fiber = macros?.fiber || 0;
  const protein = macros?.protein || 0;
  const waterPct = Math.round((waterIntakeMl / (targetWaterMl || 2000)) * 100);
  const vegServing = foodGroups?.group3_vegetables || 0;

  if (sodium > 1200) {
    return {
      headline: 'ปรับสมดุลโซเดียมและดูแลไต',
      highlight: 'ลดโซเดียมจากเครื่องปรุงและน้ำซุป (แนะนำซีอิ๊วขาวลดโซเดียม)',
      analysis: `วันนี้ได้รับโซเดียมไปแล้วประมาณ ${sodium} มก. (เกณฑ์แนะนำต่อวันไม่ควรเกิน 2,000 มก.) โดยเฉพาะจากน้ำซุปหรือน้ำแกงปรุงรสเค็ม`,
      actionSteps: [
        'สลับมาใช้ "ซีอิ๊วขาวหรือน้ำปลาสูตรลดโซเดียม 40-50%" และใช้สมุนไพรธรรมชาติ เช่น มะนาว พริกไทย ขิงสด เพิ่มรสชาติแทนเกลือ',
        'หลีกเลี่ยงการซดน้ำแกงหรือน้ำซุปจนหมดชาม เพราะโซเดียมละลายอยู่ในน้ำซุปกว่า 60%',
        'ดื่มน้ำเปล่าเพิ่ม 1-2 แก้ว เพื่อช่วยไตขับโซเดียมส่วนเกินและลดอาการบวมน้ำ',
      ],
      condimentTip: 'เลือกเครื่องปรุงที่มีสัญลักษณ์ "ลดโซเดียม" หรือ "ทางเลือกสุขภาพ" และชิมก่อนปรุงทุกครั้ง',
      focusFoodGroup: 'กลุ่มเครื่องปรุงและผักผลไม้โพแทสเซียมสูง',
      encouragement: 'การลดโซเดียมเพียงเล็กน้อยในแต่ละมื้อ ช่วยให้หลอดเลือดและไตแข็งแรงในระยะยาวได้ยอดเยี่ยมครับ!',
    };
  }

  if (waterPct < 70) {
    return {
      headline: 'เติมความชุ่มชื้นและระบบไหลเวียนโลหิต',
      highlight: 'ดื่มน้ำให้ถึงเป้าหมาย เพื่อกระตุ้นการเผาผลาญ',
      analysis: `ดื่มน้ำไปแล้ว ${waterIntakeMl} มล. (${waterPct}% ของเป้าหมาย ${targetWaterMl} มล.) ร่างกายยังต้องการน้ำเพิ่มเติมเพื่อระบบย่อยและผิวพรรณ`,
      actionSteps: [
        'ดื่มน้ำเปล่าอุณหภูมิห้อง 1 แก้วใหญ่ (250 มล.) ทันที',
        'วางขวดน้ำหรือแก้วน้ำไว้ใกล้ตัวขณะทำงาน จิบทีละนิดทุกๆ 20-30 นาที',
        'หากต้องการความสดชื่น สามารถบีบมะนาวสดฝานหรือใส่ใบสะระแหน่ลงในน้ำดื่มได้',
      ],
      condimentTip: 'ลดเครื่องดื่มที่มีน้ำตาลสูงหรือคาเฟอีนเข้มข้น เพราะอาจทำให้ร่างกายสูญเสียน้ำเพิ่มขึ้น',
      focusFoodGroup: 'น้ำดื่มและสมดุลของเหลวในร่างกาย',
      encouragement: 'การจิบน้ำสม่ำเสมอช่วยให้สมองปลอดโปร่งและลดความอยากอาหารจุกจิกได้ดีมากครับ!',
    };
  }

  if (vegServing < 2 || fiber < 15) {
    return {
      headline: 'เพิ่มใยอาหารธรรมชาติเพื่อลำไส้ที่แข็งแรง',
      highlight: 'จัดจานสูตร 2:1:1 เติมผักหลากสี 2 ส่วนในมื้อถัดไป',
      analysis: `ปริมาณผักและใยอาหารวันนี้อยู่ที่ ${fiber.toFixed(1)} กรัม แนะนำเพิ่มผักใบเขียวหรือผักต้มให้ถึงครึ่งจานตามเกณฑ์กรมอนามัย`,
      actionSteps: [
        'เพิ่มผักลวกหรือผักสด เช่น แตงกวา ผักกาดขาว หรือบรอกโคลี 1 ทัพพีในมื้อถัดไป',
        'เลือกข้าวกล้องหรือข้าวไรซ์เบอร์รี่แทนข้าวขาวขัดสี เพื่อเพิ่มกากใยอาหารพรีไบโอติกส์',
        'ทานผลไม้หวานน้อย เช่น ฝรั่งสด 1/2 ผล หรือแอปเปิ้ลเขียวเป็นของว่าง',
      ],
      condimentTip: 'ใช้น้ำสลัดงาญี่ปุ่นซีอิ๊วใส หรือน้ำพริกผักต้มแทนน้ำสลัดครีมข้นเพื่อคุมไขมัน',
      focusFoodGroup: 'หมู่ที่ 3 (ผัก) และหมู่ที่ 4 (ผลไม้)',
      encouragement: 'ใยอาหารคืออาหารชั้นดีของจุลินทรีย์ในลำไส้ ช่วยให้ระบบภูมิคุ้มกันแข็งแรงแจ่มใสครับ!',
    };
  }

  return {
    headline: 'รักษาสมดุลโภชนาการยอดเยี่ยม',
    highlight: 'รักษาโปรตีนคุณภาพดีและสัดส่วนจาน 2:1:1',
    analysis: `พฤติกรรมการทานอาหารและน้ำดื่มของคุณอยู่ในเกณฑ์ดีเยี่ยม มีความสมดุลของสารอาหารหลักทั้งโปรตีน คาร์โบไฮเดรต และผัก`,
    actionSteps: [
      'กระจายโปรตีนคุณภาพ เช่น อกไก่ ปลา หรือเต้าหู้ ให้ครบทุกมื้อหลัก',
      'ใช้น้ำมันปรุงอาหารไม่เกิน 1-2 ช้อนชาต่อมื้อ (เน้นน้ำมันรำข้าวหรือน้ำมันมะกอก)',
      'ขยับร่างกายหรือเดินย่อย 15-20 นาทีหลังมื้ออาหาร เพื่อช่วยคุมระดับน้ำตาลในเลือด',
    ],
    condimentTip: 'ใช้เครื่องเทศธรรมชาติ เช่น กระเทียม พริกไทย โหระพา ใบกะเพรา ชูรสชาติอาหารโดยไม่ต้องพึ่งผงปรุงรส',
    focusFoodGroup: 'สมดุล 5 หมู่ครบถ้วน',
    encouragement: 'คุณทำได้ยอดเยี่ยมมาก รักษาวินัยแบบนี้ต่อเนื่องเพื่อสุขภาพที่แข็งแรงยั่งยืนครับ!',
  };
}

// AI Endpoint: Generate personalized Daily Wellness Tip
app.post('/api/wellness-tip', async (req, res) => {
  try {
    const data = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback when API key is not configured
      const fallbackTip = generateFallbackWellnessTip(data);
      return res.json({ success: true, tip: fallbackTip, source: 'smart-rules' });
    }

    const {
      actualCalories,
      targetCalories,
      macros,
      waterIntakeMl,
      targetWaterMl,
      weeklyScore,
      grade,
      streakDays,
      foodGroups,
      profile,
      recentMealNames,
    } = data;

    const prompt = `คุณคือนักกำหนดอาหารวิชาชีพและผู้เชี่ยวชาญโภชนาการชาวไทย (Certified Clinical Dietitian)
โปรดวิเคราะห์ข้อมูลการบริโภคจริงในวันนี้ของผู้ใช้และแนะนำ "Daily Wellness Tip" ประจำวัน 1 ข้อที่เฉพาะเจาะจง ตรงจุด และปฏิบัติได้จริงทันที

ข้อมูลสุขภาพของผู้ใช้:
- เป้าหมาย: ${profile?.goal === 'weight_loss' ? 'ลดไขมัน/น้ำหนัก' : profile?.goal === 'muscle_gain' ? 'เพิ่มกล้ามเนื้อ' : 'สมดุลสุขภาพ'}
- พลังงานวันนี้: ${actualCalories || 0} / ${targetCalories || 2000} kcal (TDEE)
- สารอาหาร: โปรตีน ${macros?.protein || 0}g, คาร์โบไฮเดรต ${macros?.carbs || 0}g, ไขมัน ${macros?.fat || 0}g, ใยอาหาร ${macros?.fiber || 0}g, โซเดียม ${macros?.sodium || 0}mg
- ปริมาณน้ำดื่ม: ${waterIntakeMl || 0} / ${targetWaterMl || 2000} มล.
- คะแนนสุขภาพสัปดาห์นี้: ${weeklyScore || 85}/100 (เกรด ${grade || 'A'}, Streak ${streakDays || 1} วัน)
- สัดส่วนอาหาร 5 หมู่: โปรตีน ${foodGroups?.group1_protein || 0} ส่วน, ข้าวแป้ง ${foodGroups?.group2_carbs || 0} ส่วน, ผัก ${foodGroups?.group3_vegetables || 0} ส่วน, ผลไม้ ${foodGroups?.group4_fruits || 0} ส่วน, ไขมัน ${foodGroups?.group5_fats || 0} ส่วน
- เมนูที่บันทึกวันนี้: ${(recentMealNames || []).join(', ') || 'ไม่มีข้อมูล'}
- ข้อจำกัดสุขภาพ: ${(profile?.healthConstraints || []).join(', ') || 'ไม่มี'}

โปรดส่งคำตอบกลับมาเป็น JSON ตามรูปแบบนี้เท่านั้น (ห้ามใส่ Markdown code blocks อื่น ให้ตอบ JSON ล้วนๆ):
{
  "headline": "ชื่อหัวข้อคำแนะนำสั้นๆ กระชับ (ภาษาไทย)",
  "highlight": "ประโยคไฮไลท์คำแนะนำที่ต้องทำวันนี้ (เช่น การเลือกเครื่องปรุงลดโซเดียม, เพิ่มผัก, ดื่มน้ำ)",
  "analysis": "บทวิเคราะห์สั้นๆ 1-2 ประโยค เชื่อมโยงกับตัวเลขจริงของผู้ใช้วันนี้อย่างตรงประเด็น",
  "actionSteps": [
    "ขั้นตอนปฏิบัติที่ 1 ชัดเจน ทำตามได้ทันที",
    "ขั้นตอนปฏิบัติที่ 2 เช่น ชื่อเครื่องปรุงลดโซเดียม หรือวิธีปรุง",
    "ขั้นตอนปฏิบัติที่ 3"
  ],
  "condimentTip": "คำแนะนำการเลือกเครื่องปรุง เช่น ซีอิ๊วลดโซเดียม น้ำปลาลดเกลือ หรือสมุนไพรสด",
  "focusFoodGroup": "หมู่สารอาหารที่ควรเน้นเป็นพิเศษ",
  "encouragement": "ข้อความให้กำลังใจสั้นๆ อบอุ่น เป็นมิตร"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim() || '';
    let parsedTip;
    try {
      parsedTip = JSON.parse(responseText);
    } catch (e) {
      // Strip markdown code fences if any
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      parsedTip = JSON.parse(cleaned);
    }

    return res.json({ success: true, tip: parsedTip, source: 'gemini-ai' });
  } catch (error: any) {
    console.error('Gemini Wellness Tip API error:', error);
    // Graceful fallback to rule-based recommendation
    const fallbackTip = generateFallbackWellnessTip(req.body);
    return res.json({ success: true, tip: fallbackTip, source: 'smart-rules-fallback' });
  }
});

// Configure Vite middleware in development or serve static in production
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
