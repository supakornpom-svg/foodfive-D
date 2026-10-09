import { FoodItem, WeeklyMealPlan, DayOfWeek, GroceryItem, HealthConstraint } from '../types/nutrition';
import { THAI_RECOMMENDED_MEALS } from '../data/nutritionData';

export const DAYS_OF_WEEK: { id: DayOfWeek; label: string; fullLabel: string }[] = [
  { id: 'mon', label: 'จันทร์', fullLabel: 'วันจันทร์' },
  { id: 'tue', label: 'อังคาร', fullLabel: 'วันอังคาร' },
  { id: 'wed', label: 'พุธ', fullLabel: 'วันพุธ' },
  { id: 'thu', label: 'พฤหัสบดี', fullLabel: 'วันพฤหัสบดี' },
  { id: 'fri', label: 'ศุกร์', fullLabel: 'วันศุกร์' },
  { id: 'sat', label: 'เสาร์', fullLabel: 'วันเสาร์' },
  { id: 'sun', label: 'อาทิตย์', fullLabel: 'วันอาทิตย์' },
];

export function getDefaultWeeklyMealPlan(): WeeklyMealPlan {
  const getMeal = (id: string) => THAI_RECOMMENDED_MEALS.find(m => m.id === id);

  return {
    mon: {
      dayOfWeek: 'mon',
      dayLabel: 'วันจันทร์',
      breakfast: getMeal('meal_5'), // โจ๊กข้าวกล้องอกไก่
      lunch: getMeal('meal_1'),     // ข้าวกะเพราอกไก่
      dinner: getMeal('meal_3'),    // ต้มยำกุ้งน้ำใส
      snack: getMeal('snack_1'),    // ฝรั่ง + นมถั่วเหลือง
    },
    tue: {
      dayOfWeek: 'tue',
      dayLabel: 'วันอังคาร',
      breakfast: getMeal('meal_7'), // ข้าวต้มแซลมอน
      lunch: getMeal('meal_2'),     // แกงส้มผักรวมปลาช่อน
      dinner: getMeal('meal_6'),    // น้ำพริกอ่องผักนึ่ง 5 สี
      snack: getMeal('snack_2'),    // โยเกิร์ตเบอร์รี่เจีย
    },
    wed: {
      dayOfWeek: 'wed',
      dayLabel: 'วันพุธ',
      breakfast: getMeal('meal_12'), // แซนด์วิชโฮลวีตไข่ต้มอะโวคาโด
      lunch: getMeal('meal_4'),      // ส้มตำไทยอกไก่ย่าง
      dinner: getMeal('meal_8'),     // แกงเลียงกุ้งสด
      snack: getMeal('snack_3'),     // ผลไม้รวม 3 สี
    },
    thu: {
      dayOfWeek: 'thu',
      dayLabel: 'วันพฤหัสบดี',
      breakfast: getMeal('meal_5'), // โจ๊กข้าวกล้องอกไก่
      lunch: getMeal('meal_10'),    // ข้าวผัดไข่บล็อกโคลี่กุ้ง
      dinner: getMeal('meal_9'),     // ยำวุ้นเส้นอกไก่กุ้ง
      snack: getMeal('snack_4'),    // กล้วยน้ำว้าต้ม + อัลมอนด์
    },
    fri: {
      dayOfWeek: 'fri',
      dayLabel: 'วันศุกร์',
      breakfast: getMeal('meal_7'), // ข้าวต้มแซลมอน
      lunch: getMeal('meal_11'),    // เต้าหู้ทรงเครื่องเห็ดหอม
      dinner: getMeal('meal_3'),    // ต้มยำกุ้งน้ำใส
      snack: getMeal('snack_1'),    // ฝรั่ง + นมถั่วเหลือง
    },
    sat: {
      dayOfWeek: 'sat',
      dayLabel: 'วันเสาร์',
      breakfast: getMeal('meal_12'), // แซนด์วิชโฮลวีต
      lunch: getMeal('meal_1'),      // ข้าวกะเพราอกไก่
      dinner: getMeal('meal_6'),     // น้ำพริกอ่องผักนึ่ง 5 สี
      snack: getMeal('snack_2'),     // โยเกิร์ตเบอร์รี่เจีย
    },
    sun: {
      dayOfWeek: 'sun',
      dayLabel: 'วันอาทิตย์',
      breakfast: getMeal('meal_5'), // โจ๊กข้าวกล้อง
      lunch: getMeal('meal_2'),     // แกงส้มผักรวมปลาช่อน
      dinner: getMeal('meal_8'),     // แกงเลียงกุ้งสด
      snack: getMeal('snack_3'),     // ผลไม้รวม 3 สี
    },
  };
}

export function generateGroceryListFromWeeklyPlan(plan: WeeklyMealPlan): GroceryItem[] {
  const groceryMap = new Map<string, {
    name: string;
    category: GroceryItem['category'];
    categoryLabel: string;
    sourceMeals: Set<string>;
    count: number;
  }>();

  // Helper to categorize raw ingredients
  const categorizeIngredient = (text: string): { category: GroceryItem['category']; label: string } => {
    const t = text.toLowerCase();
    if (t.includes('ไก่') || t.includes('ปลา') || t.includes('กุ้ง') || t.includes('ไข่') || t.includes('เต้าหู้') || t.includes('นม') || t.includes('โยเกิร์ต')) {
      return { category: 'meat_protein', label: 'เนื้อสัตว์ & โปรตีน' };
    }
    if (t.includes('ผัก') || t.includes('กะหล่ำ') || t.includes('บล็อกโคลี่') || t.includes('แครอท') || t.includes('ฟักทอง') || t.includes('เห็ด') || t.includes('มะเขือเทศ') || t.includes('กะเพรา') || t.includes('ขิง') || t.includes('ตำลึง') || t.includes('บวบ') || t.includes('แตงกวา')) {
      return { category: 'produce', label: 'ผักสด & สมุนไพร' };
    }
    if (t.includes('ข้าว') || t.includes('ขนมปัง') || t.includes('วุ้นเส้น') || t.includes('แป้ง') || t.includes('ข้าวโพด')) {
      return { category: 'grain_carb', label: 'ข้าว แป้ง & ธัญพืช' };
    }
    if (t.includes('ฝรั่ง') || t.includes('ส้ม') || t.includes('กล้วย') || t.includes('มะละกอ') || t.includes('แอปเปิ้ล') || t.includes('เบอร์รี่') || t.includes('แก้วมังกร')) {
      return { category: 'fruit', label: 'ผลไม้สด' };
    }
    return { category: 'pantry_oil', label: 'เครื่องปรุง & ไขมันดี' };
  };

  // Iterate over all planned meals
  Object.values(plan).forEach((day) => {
    const meals = [day.breakfast, day.lunch, day.dinner, day.snack].filter(Boolean) as FoodItem[];

    meals.forEach((meal) => {
      // Extract from prepSteps or ingredientsBreakdown
      const rawParts: string[] = [];
      if (meal.ingredientsBreakdown.group1) rawParts.push(meal.ingredientsBreakdown.group1);
      if (meal.ingredientsBreakdown.group2) rawParts.push(meal.ingredientsBreakdown.group2);
      if (meal.ingredientsBreakdown.group3) rawParts.push(meal.ingredientsBreakdown.group3);
      if (meal.ingredientsBreakdown.group4) rawParts.push(meal.ingredientsBreakdown.group4);
      if (meal.ingredientsBreakdown.group5) rawParts.push(meal.ingredientsBreakdown.group5);

      rawParts.forEach((part) => {
        // Normalize ingredient name
        const cleanName = part.split('(')[0].replace(/[0-9.]+\s*(กรัม|ทัพพี|ช้อนชา|ช้อนโต๊ะ|ผล|กล่อง|ชิ้น|คู่)/g, '').trim();
        if (cleanName.length > 2) {
          const key = cleanName.toLowerCase();
          const catInfo = categorizeIngredient(cleanName);
          const existing = groceryMap.get(key);
          if (existing) {
            existing.sourceMeals.add(meal.name);
            existing.count += 1;
          } else {
            groceryMap.set(key, {
              name: cleanName,
              category: catInfo.category,
              categoryLabel: catInfo.label,
              sourceMeals: new Set([meal.name]),
              count: 1,
            });
          }
        }
      });
    });
  });

  // Convert to array
  const items: GroceryItem[] = [];
  groceryMap.forEach((val, key) => {
    items.push({
      id: `grocery_${key.replace(/\s+/g, '_')}`,
      name: val.name,
      category: val.category,
      categoryLabel: val.categoryLabel,
      quantityEst: val.count > 1 ? `ประมาณ ${val.count} มื้อ` : 'สำหรับ 1 มื้อ',
      sourceMeals: Array.from(val.sourceMeals),
      checked: false,
    });
  });

  // Sort by category order
  const catOrder: Record<GroceryItem['category'], number> = {
    produce: 1,
    meat_protein: 2,
    fruit: 3,
    grain_carb: 4,
    pantry_oil: 5,
  };

  return items.sort((a, b) => catOrder[a.category] - catOrder[b.category]);
}

// Common pantry ingredients list for Ingredient Matcher
export interface PantryIngredient {
  id: string;
  name: string;
  category: 'protein' | 'produce' | 'carbs' | 'fruit' | 'pantry';
  categoryLabel: string;
}

export const COMMON_PANTRY_INGREDIENTS: PantryIngredient[] = [
  // Proteins
  { id: 'chicken', name: 'อกไก่ / สันในไก่', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'egg', name: 'ไข่ไก่', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'shrimp', name: 'กุ้งขาวสด', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'fish', name: 'เนื้อปลา (ช่อน / ปลากะพง)', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'salmon', name: 'ปลาแซลมอน', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'tofu', name: 'เต้าหู้ขาวถั่วเหลือง', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'soymilk', name: 'นมถั่วเหลืองจืด', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },
  { id: 'yogurt', name: 'โยเกิร์ตธรรมชาติ', category: 'protein', categoryLabel: 'เนื้อสัตว์ & โปรตีน' },

  // Vegetables
  { id: 'holy_basil', name: 'ใบกะเพราสด', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'broccoli', name: 'บล็อกโคลี่', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'carrot', name: 'แครอท', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'pumpkin', name: 'ฟักทอง', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'tomato', name: 'มะเขือเทศ', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'mushrooms', name: 'เห็ด (ฟาง / นางฟ้า / หอม)', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'cucumber', name: 'แตงกวา', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'morning_glory', name: 'ผักบุ้ง / ผักกาดขาว', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'ginger', name: 'ขิงสด / ต้นหอม ผักชี', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },
  { id: 'papaya_raw', name: 'มะละกอดิบ', category: 'produce', categoryLabel: 'ผัก & สมุนไพร' },

  // Carbs
  { id: 'brown_rice', name: 'ข้าวกล้องหุงสุก', category: 'carbs', categoryLabel: 'ข้าว แป้ง & เส้น' },
  { id: 'riceberry', name: 'ข้าวไรซ์เบอร์รี่', category: 'carbs', categoryLabel: 'ข้าว แป้ง & เส้น' },
  { id: 'wholewheat', name: 'ขนมปังโฮลวีต', category: 'carbs', categoryLabel: 'ข้าว แป้ง & เส้น' },
  { id: 'glass_noodle', name: 'วุ้นเส้นถั่วเขียว', category: 'carbs', categoryLabel: 'ข้าว แป้ง & เส้น' },

  // Fruits
  { id: 'guava', name: 'ฝรั่งสด', category: 'fruit', categoryLabel: 'ผลไม้สด' },
  { id: 'banana', name: 'กล้วยน้ำว้า', category: 'fruit', categoryLabel: 'ผลไม้สด' },
  { id: 'berries', name: 'ผลไม้ตระกูลเบอร์รี่', category: 'fruit', categoryLabel: 'ผลไม้สด' },
  { id: 'orange', name: 'ส้ม / มะนาวสด', category: 'fruit', categoryLabel: 'ผลไม้สด' },
  { id: 'papaya_ripe', name: 'มะละกอสุก', category: 'fruit', categoryLabel: 'ผลไม้สด' },

  // Pantry & Healthy Fats
  { id: 'avocado', name: 'อะโวคาโด', category: 'pantry', categoryLabel: 'ไขมันดี & ธัญพืช' },
  { id: 'almond', name: 'ถั่วอัลมอนด์', category: 'pantry', categoryLabel: 'ไขมันดี & ธัญพืช' },
  { id: 'chia_seed', name: 'เมล็ดเจีย / เมล็ดฟักทอง', category: 'pantry', categoryLabel: 'ไขมันดี & ธัญพืช' },
  { id: 'rice_bran_oil', name: 'น้ำมันรำข้าว / น้ำมันมะกอก', category: 'pantry', categoryLabel: 'ไขมันดี & ธัญพืช' },
];

export interface IngredientMatchResult {
  meal: FoodItem;
  matchCount: number;
  totalKeyIngredients: number;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export function matchMealsByPantryIngredients(
  selectedIngredientIds: string[],
  activeConstraints: HealthConstraint[] = []
): IngredientMatchResult[] {
  if (selectedIngredientIds.length === 0) return [];

  const selectedNames = selectedIngredientIds
    .map(id => COMMON_PANTRY_INGREDIENTS.find(item => item.id === id)?.name || '')
    .filter(Boolean);

  const results: IngredientMatchResult[] = [];

  THAI_RECOMMENDED_MEALS.forEach((meal) => {
    // Check constraints compatibility
    if (activeConstraints.length > 0) {
      if (activeConstraints.includes('vegetarian') && !meal.isVegetarian) return;
      if (activeConstraints.includes('no_seafood') && (meal.name.includes('กุ้ง') || meal.name.includes('ปลา'))) return;
      if (activeConstraints.includes('no_dairy') && (meal.name.includes('โยเกิร์ต') || meal.description.includes('นมวัว'))) return;
      if (activeConstraints.includes('no_nuts') && (meal.name.includes('อัลมอนด์') || meal.description.includes('ถั่วลิสง'))) return;
    }

    const mealFullText = `${meal.name} ${meal.description} ${Object.values(meal.ingredientsBreakdown).join(' ')} ${meal.tags.join(' ')}`.toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];

    selectedIngredientIds.forEach((ingId) => {
      const ing = COMMON_PANTRY_INGREDIENTS.find(i => i.id === ingId);
      if (!ing) return;

      // Match keywords
      const keywords = ing.name.split(/[\s/()]+/).filter(w => w.length > 1);
      const isMatch = keywords.some(k => mealFullText.includes(k.toLowerCase()));

      if (isMatch) {
        matched.push(ing.name);
      }
    });

    if (matched.length > 0) {
      // Estimate total ingredients in this dish (usually 3 to 6 key components)
      const estimatedTotal = Math.max(matched.length, 4);
      const matchPercentage = Math.min(100, Math.round((matched.length / estimatedTotal) * 100));

      results.push({
        meal,
        matchCount: matched.length,
        totalKeyIngredients: estimatedTotal,
        matchPercentage,
        matchedIngredients: matched,
        missingIngredients: missing,
      });
    }
  });

  return results.sort((a, b) => b.matchCount - a.matchCount || b.matchPercentage - a.matchPercentage);
}
