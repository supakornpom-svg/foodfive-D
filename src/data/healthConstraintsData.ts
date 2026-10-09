import { HealthConstraint } from '../types/nutrition';

export interface HealthConstraintDef {
  id: HealthConstraint;
  label: string;
  shortLabel: string;
  description: string;
  guidelines: string;
  avoidKeywords: string[];
  recommendedKeywords: string[];
  badgeColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const HEALTH_CONSTRAINTS_LIST: HealthConstraintDef[] = [
  {
    id: 'low_sodium',
    label: 'ความดันโลหิตสูง / โรคไตระยะแรก (คุมโซเดียม DASH)',
    shortLabel: 'คุมโซเดียม/ลดเค็ม',
    description: 'จำกัดปริมาณโซเดียมไม่เกิน 1,500 - 2,000 มก./วัน หลีกเลี่ยงอาหารหมักดอง กะปิ น้ำปลาเข้มข้น และผงชูรส',
    guidelines: 'เน้นอาหารต้ม นึ่ง ยำรสเปรี้ยวนำ และใช้เครื่องเทศสมุนไพรสดแต่งรสแทนเกลือ',
    avoidKeywords: ['กะปิ', 'เค็มจัด', 'ของหมักดอง', 'โซเดียมสูง'],
    recommendedKeywords: ['โซเดียมต่ำ', 'สมุนไพรบำรุง', 'ไม่ปรุงเค็ม', 'ลดโซเดียม'],
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-200',
  },
  {
    id: 'diabetes',
    label: 'เบาหวาน / ควบคุมระดับน้ำตาลในเลือด (Low GI)',
    shortLabel: 'คุมน้ำตาล/เบาหวาน',
    description: 'เน้นคาร์โบไฮเดรตเชิงซ้อน ใยอาหารสูง หลีกเลี่ยงน้ำตาลทราย ขนมหวาน และผลไม้รสหวานจัด',
    guidelines: 'เลือกข้าวกล้อง ข้าวไรซ์เบอร์รี่ ธัญพืชไม่ขัดสี ทานผักนำ และผลไม้น้ำตาลต่ำ เช่น ฝรั่ง แอปเปิ้ลเขียว',
    avoidKeywords: ['น้ำตาลสูง', 'น้ำเชื่อม', 'หวานจัด', 'ขนมหวาน'],
    recommendedKeywords: ['น้ำตาลต่ำ', 'ไฟเบอร์สูง', 'คาร์บเชิงซ้อน', 'GI ต่ำ'],
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-200',
  },
  {
    id: 'gerd',
    label: 'โรคกรดไหลย้อน / แผลในกระเพาะอาหาร (GERD)',
    shortLabel: 'กรดไหลย้อน/กระเพาะ',
    description: 'หลีกเลี่ยงอาหารรสเผ็ดจัด เปรี้ยวจัด ของทอดน้ำมันเยิ้ม คาเฟอีน และอาหารย่อยยากช่วงเย็น',
    guidelines: 'เน้นอาหารรสอ่อน ย่อยง่าย เช่น ต้มจืด โจ๊ก ข้าวต้ม แกงจืดเต้าหู้ ทานมื้อเล็กๆ ไม่นอนทันทีหลังทาน',
    avoidKeywords: ['พริกเผ็ดจัด', 'รสจัดจ้าน', 'เปรี้ยวจี๊ด', 'ของทอดมันเยิ้ม'],
    recommendedKeywords: ['รสอ่อนโยน', 'ย่อยง่าย', 'มื้อเช้าอุ่นท้อง', 'สบายท้อง'],
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200',
  },
  {
    id: 'vegetarian',
    label: 'มังสวิรัติเพื่อสุขภาพ / เน้นพืช (Vegetarian & Plant-Based)',
    shortLabel: 'มังสวิรัติ/เจ',
    description: 'งดเว้นเนื้อสัตว์ทุกชนิด ได้แก่ ไก่ หมู เนื้อ และอาหารทะเล ทานโปรตีนจากพืชและถั่วเหลือง',
    guidelines: 'เน้นโปรตีนเกษตร เต้าหู้ขาว ถั่วเมล็ดแห้ง นมถั่วเหลือง ธัญพืช และผักหลากสี',
    avoidKeywords: ['อกไก่', 'กุ้ง', 'ปลา', 'เนื้อสัตว์'],
    recommendedKeywords: ['โปรตีนพืช', 'มังสวิรัติ', 'เต้าหู้'],
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'no_seafood',
    label: 'แพ้อาหารทะเล / งดสัตว์น้ำมีเปลือก (No Seafood)',
    shortLabel: 'งดอาหารทะเล/กุ้ง',
    description: 'หลีกเลี่ยงกุ้ง หอย ปู ปลาหมึก และผลิตภัณฑ์จากสัตว์ทะเลที่มีความเสี่ยงก่อภูมิแพ้',
    guidelines: 'เลือกโปรตีนจากไก่ ไข่ นม และถั่วเหลืองเป็นหลัก',
    avoidKeywords: ['กุ้ง', 'อาหารทะเล', 'ปู', 'ปลาหมึก'],
    recommendedKeywords: ['อกไก่', 'ไข่ไก่', 'เต้าหู้'],
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-900',
    borderColor: 'border-rose-200',
  },
  {
    id: 'no_dairy',
    label: 'แพ้นมวัว / ย่อยแลคโตสไม่ได้ (Lactose Intolerance)',
    shortLabel: 'งดนมวัว/แลคโตส',
    description: 'หลีกเลี่ยงนมวัว เนย ชีส ครีมเทียม และขนมที่มีส่วนผสมของนมวัว',
    guidelines: 'ใช้นมถั่วเหลือง นมอัลมอนด์ นมข้าวโอ๊ต หรือโยเกิร์ตจากพืชทดแทน',
    avoidKeywords: ['นมวัว', 'ชีส', 'เนยสด', 'ครีมเทียม'],
    recommendedKeywords: ['นมถั่วเหลือง', 'ไร้นมวัว', 'Plant Milk'],
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-200',
  },
  {
    id: 'no_nuts',
    label: 'แพ้ถั่วเปลือกแข็ง / ถั่วลิสง (Nut Allergy)',
    shortLabel: 'แพ้ถั่วเปลือกแข็ง',
    description: 'หลีกเลี่ยงถั่วลิสง อัลมอนด์ วอลนัท เม็ดมะม่วงหิมพานต์ และน้ำมันถั่ว',
    guidelines: 'รับไขมันดีจากน้ำมันรำข้าว น้ำมันมะกอก อะโวคาโด และเมล็ดพืช เช่น เมล็ดเจีย เมล็ดฟักทอง',
    avoidKeywords: ['ถั่วลิสง', 'อัลมอนด์', 'ถั่วเปลือกแข็ง'],
    recommendedKeywords: ['ไร้ถั่ว', 'เมล็ดเจีย', 'เมล็ดฟักทอง'],
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-900',
    borderColor: 'border-teal-200',
  },
];
