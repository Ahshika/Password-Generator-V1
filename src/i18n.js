import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Welcome to NightGold": "Welcome to NightGold",
      "Setup Authenticator": "Setup Authenticator",
      "Scan QR Code": "Scan this QR code with Google Authenticator or Authy.",
      "Enter Code": "Enter the 6-digit code:",
      "Verify & Setup": "Verify & Setup",
      "Login": "Login",
      "Password Manager": "Password Manager",
      "Generator": "Generator",
      "Site": "Site/App Name",
      "Username": "Username/Email",
      "Password": "Password",
      "Add": "Add",
      "Delete": "Delete",
      "Length": "Length",
      "Numbers": "Numbers",
      "Symbols": "Symbols",
      "Uppercase": "Uppercase",
      "Arabic": "Arabic Characters",
      "Generate": "Generate",
      "Copy": "Copy",
      "Strength": "Strength"
    }
  },
  ar: {
    translation: {
      "Welcome to NightGold": "مرحباً بك في NightGold",
      "Setup Authenticator": "إعداد تطبيق المصادقة",
      "Scan QR Code": "قم بمسح الكود باستخدام Google Authenticator أو Authy.",
      "Enter Code": "أدخل الكود المكون من 6 أرقام:",
      "Verify & Setup": "تأكيد وإعداد",
      "Login": "تسجيل الدخول",
      "Password Manager": "مدير كلمات المرور",
      "Generator": "مولد كلمات المرور",
      "Site": "اسم الموقع/التطبيق",
      "Username": "اسم المستخدم/الإيميل",
      "Password": "كلمة المرور",
      "Add": "إضافة",
      "Delete": "حذف",
      "Length": "الطول",
      "Numbers": "أرقام",
      "Symbols": "رموز",
      "Uppercase": "حروف كبيرة",
      "Arabic": "حروف عربية",
      "Generate": "توليد",
      "Copy": "نسخ",
      "Strength": "القوة"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
