import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "Rental Hero",
      login: "Login",
      location: "Location",
      language: "Language",
      languageNames: {
        en: "English",
        my: "Myanmar",
        th: "Thai",
      },
      heroLocationLabel: "Location",
      carsAvailableNow: "{{count}} cars available now",
      searchPlaceholder: "Search cars, locations, or type",
      filters: "Filters",
      searchFilters: "Search filters",
      searchFiltersSubtitle:
        "Choose dates, pickup city, car class, and budget in one focused view.",
      reset: "Reset",
      showCars: "Show {{count}} cars",
      resultsMatching: "{{count}} results matching your filters",
      emptyTitle: "No cars match those filters.",
      emptyBody: "Try another city, widen the price range, or clear your search.",
      insurance: "Insurance",
    },
  },
  my: {
    translation: {
      appName: "Rental Hero",
      login: "အကောင့်ဝင်ရန်",
      location: "တည်နေရာ",
      language: "ဘာသာစကား",
      languageNames: {
        en: "အင်္ဂလိပ်",
        my: "မြန်မာ",
        th: "ထိုင်း",
      },
      heroLocationLabel: "တည်နေရာ",
      carsAvailableNow: "ယခု ကား {{count}} စီး ရနိုင်သည်",
      searchPlaceholder: "ကား၊ နေရာ သို့မဟုတ် အမျိုးအစား ရှာဖွေပါ",
      filters: "စစ်ထုတ်မှုများ",
      searchFilters: "ရှာဖွေမှု စစ်ထုတ်မှုများ",
      searchFiltersSubtitle: "ရက်စွဲ၊ ကားယူမည့်မြို့၊ ကားအမျိုးအစားနှင့် ဈေးနှုန်းကို တစ်နေရာတည်းတွင် ရွေးချယ်ပါ။",
      reset: "ပြန်လည်သတ်မှတ်ရန်",
      showCars: "ကား {{count}} စီးကို ပြပါ",
      resultsMatching: "သင်၏စစ်ထုတ်မှုနှင့် ကိုက်ညီသော ရလဒ် {{count}} ခု",
      emptyTitle: "ဤစစ်ထုတ်မှုများနှင့် ကိုက်ညီသော ကားမရှိပါ။",
      emptyBody: "အခြားမြို့တစ်မြို့ရွေးပါ၊ ဈေးနှုန်းကိုချဲ့ပါ သို့မဟုတ် ရှာဖွေမှုကိုရှင်းပါ။",
      insurance: "အာမခံ",
    },
  },
  th: {
    translation: {
      appName: "Rental Hero",
      login: "เข้าสู่ระบบ",
      location: "สถานที่",
      language: "ภาษา",
      languageNames: {
        en: "อังกฤษ",
        my: "เมียนมา",
        th: "ไทย",
      },
      heroLocationLabel: "สถานที่",
      carsAvailableNow: "มีรถพร้อมให้บริการ {{count}} คัน",
      searchPlaceholder: "ค้นหารถ สถานที่ หรือประเภทรถ",
      filters: "ตัวกรอง",
      searchFilters: "ตัวกรองการค้นหา",
      searchFiltersSubtitle: "เลือกรับรถ วันที่ รุ่นรถ และงบประมาณได้ในหน้าจอเดียว",
      reset: "รีเซ็ต",
      showCars: "แสดงรถ {{count}} คัน",
      resultsMatching: "ผลลัพธ์ {{count}} รายการตรงกับตัวกรองของคุณ",
      emptyTitle: "ไม่มีรถที่ตรงกับตัวกรองนี้",
      emptyBody: "ลองเปลี่ยนเมือง ขยายช่วงราคา หรือล้างการค้นหา",
      insurance: "ประกัน",
    },
  },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
