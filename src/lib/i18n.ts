import { Language } from "@/lib/data/types";

export const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी" }
];

export const translations = {
  appName: {
    en: "Krishak",
    bn: "কৃষক",
    hi: "कृषक"
  },
  welcome: {
    en: "Farming made simple",
    bn: "চাষাবাদ এখন আরও সহজ",
    hi: "खेती अब और आसान"
  },
  login: {
    en: "Login",
    bn: "লগইন",
    hi: "लॉगिन"
  },
  register: {
    en: "Register",
    bn: "রেজিস্টার",
    hi: "रजिस्टर"
  },
  mobileNumber: {
    en: "Mobile Number",
    bn: "মোবাইল নম্বর",
    hi: "मोबाइल नंबर"
  },
  password: {
    en: "Password",
    bn: "পাসওয়ার্ড",
    hi: "पासवर्ड"
  },
  name: {
    en: "Name",
    bn: "নাম",
    hi: "नाम"
  },
  marketplace: {
    en: "Marketplace",
    bn: "বাজার",
    hi: "बाजार"
  },
  labours: {
    en: "Labours",
    bn: "শ্রমিক",
    hi: "मजदूर"
  },
  profile: {
    en: "Profile",
    bn: "প্রোফাইল",
    hi: "प्रोफाइल"
  },
  orders: {
    en: "Orders",
    bn: "অর্ডার",
    hi: "ऑर्डर"
  },
  seller: {
    en: "Seller",
    bn: "বিক্রেতা",
    hi: "विक्रेता"
  },
  newSell: {
    en: "New Sell",
    bn: "নতুন বিক্রি",
    hi: "नई बिक्री"
  },
  history: {
    en: "History",
    bn: "ইতিহাস",
    hi: "इतिहास"
  },
  goBack: {
    en: "Go Back",
    bn: "ফিরে যান",
    hi: "वापस जाएं"
  },
  addToCart: {
    en: "Add to Cart",
    bn: "কার্টে যোগ করুন",
    hi: "कार्ट में जोड़ें"
  },
  order: {
    en: "Order",
    bn: "অর্ডার",
    hi: "ऑर्डर"
  },
  chat: {
    en: "Chat",
    bn: "চ্যাট",
    hi: "चैट"
  },
  call: {
    en: "Call",
    bn: "কল",
    hi: "कॉल"
  },
  language: {
    en: "Language",
    bn: "ভাষা",
    hi: "भाषा"
  },
  save: {
    en: "Save",
    bn: "সেভ",
    hi: "सेव"
  },
  submit: {
    en: "Submit",
    bn: "জমা দিন",
    hi: "सबमिट"
  },
  location: {
    en: "Location",
    bn: "অবস্থান",
    hi: "स्थान"
  },
  description: {
    en: "Description",
    bn: "বিবরণ",
    hi: "विवरण"
  },
  quantity: {
    en: "Quantity",
    bn: "পরিমাণ",
    hi: "मात्रा"
  },
  price: {
    en: "Price",
    bn: "দাম",
    hi: "कीमत"
  },
  switchLanguage: {
    en: "Switch Language",
    bn: "ভাষা পরিবর্তন",
    hi: "भाषा बदलें"
  },
  pendingApproval: {
    en: "Pending approval",
    bn: "অনুমোদনের অপেক্ষায়",
    hi: "स्वीकृति की प्रतीक्षा"
  },
  registerLabour: {
    en: "Register as Labour",
    bn: "শ্রমিক হিসেবে নিবন্ধন",
    hi: "मजदूर के रूप में पंजीकरण"
  },
  hire: {
    en: "Hire",
    bn: "নিয়োগ করুন",
    hi: "किराए पर लें"
  },
  bio: {
    en: "Bio",
    bn: "পরিচিতি",
    hi: "परिचय"
  },
  logout: {
    en: "Logout",
    bn: "লগআউট",
    hi: "लॉगआउट"
  },
  chooseLanguage: {
    en: "Choose your preferred language",
    bn: "আপনার পছন্দের ভাষা বেছে নিন",
    hi: "अपनी पसंदीदा भाषा चुनें"
  },
  sellerTools: {
    en: "Seller tools",
    bn: "বিক্রেতা সরঞ্জাম",
    hi: "विक्रेता उपकरण"
  },
  labourTools: {
    en: "Labour tools",
    bn: "শ্রমিক সরঞ্জাম",
    hi: "मजदूर उपकरण"
  },
  cart: {
    en: "Cart",
    bn: "কার্ট",
    hi: "कार्ट"
  },
  admin: {
    en: "Admin",
    bn: "অ্যাডমিন",
    hi: "एडमिन"
  }
} satisfies Record<string, Record<Language, string>>;

export function t(language: Language, key: keyof typeof translations) {
  return translations[key][language];
}
