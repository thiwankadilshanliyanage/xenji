import "dotenv/config";
import mongoose from "mongoose";

import Service from "../models/Service.js";
import { createSlug } from "../utils/createSlug.js";

const services = [
  // Housing
  {
    title: { en: "Sakura Apartment Support", ja: "さくらアパートサポート" },
    category: "Housing",
    shortDescription: {
      en: "Apartment search support for foreigners in Gifu and Nagoya.",
      ja: "岐阜・名古屋で外国人向けの部屋探しをサポートします。",
    },
    fullDescription: {
      en: "Sakura Apartment Support helps foreign residents search for rental rooms, understand initial costs, and prepare documents for housing applications.",
      ja: "外国人の部屋探し、初期費用、申込書類の準備をサポートします。",
    },
    companyName: "Sakura Living Support Co., Ltd.",
    websiteUrl: "https://sakura-living.example.com",
    contactEmail: "housing@sakura-living.example.com",
    phoneNumber: "058-200-1101",
    postalCode: "500-8844",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Consultation from ¥3,000",
    workingHours: "Mon - Sat 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Nagoya Room Finder", ja: "名古屋ルームファインダー" },
    category: "Housing",
    shortDescription: {
      en: "Foreigner-friendly room search and contract explanation.",
      ja: "外国人向けの部屋探しと契約説明サポート。",
    },
    fullDescription: {
      en: "This service helps users compare apartments, understand rent, deposit, key money, guarantor requirements, and contract conditions.",
      ja: "家賃、敷金、礼金、保証人、契約条件の確認をサポートします。",
    },
    companyName: "Nagoya Global Housing Partners",
    websiteUrl: "https://nagoya-room.example.com",
    contactEmail: "info@nagoya-room.example.com",
    phoneNumber: "052-300-2210",
    postalCode: "450-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nagoya Station Area",
    languagesSupported: ["English", "Japanese", "Vietnamese"],
    priceInfo: "Free first consultation",
    workingHours: "Daily 9:30 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Foreigner Lease Help", ja: "外国人賃貸サポート" },
    category: "Housing",
    shortDescription: {
      en: "Rental application and guarantor support for foreign residents.",
      ja: "外国人の賃貸申込と保証人関連をサポートします。",
    },
    fullDescription: {
      en: "Support for rental applications, document preparation, move-in explanation, and communication with property agencies.",
      ja: "賃貸申込、書類準備、入居説明、不動産会社との連絡をサポートします。",
    },
    companyName: "Global Lease Assist Japan",
    websiteUrl: "https://global-lease.example.com",
    contactEmail: "support@global-lease.example.com",
    phoneNumber: "058-210-4455",
    postalCode: "501-0222",
    prefecture: "Gifu",
    city: "Mizuho",
    address: "Mizuho City, Gifu",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥5,000",
    workingHours: "Mon - Fri 10:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
  },

  // Jobs
  {
    title: { en: "Foreigner Job Support Desk", ja: "外国人仕事サポートデスク" },
    category: "Jobs",
    shortDescription: {
      en: "Resume and interview support for foreigners searching for work.",
      ja: "外国人向けの履歴書・面接サポート。",
    },
    fullDescription: {
      en: "Support for resume writing, interview preparation, job search planning, and Japanese workplace communication.",
      ja: "履歴書作成、面接準備、就職活動計画、日本の職場コミュニケーションをサポートします。",
    },
    companyName: "Career Bridge Japan",
    websiteUrl: "https://career-bridge.example.com",
    contactEmail: "jobs@career-bridge.example.com",
    phoneNumber: "052-410-3321",
    postalCode: "460-0008",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Sakae, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Resume check from ¥2,500",
    workingHours: "Mon - Fri 9:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Part-Time Job Navigation", ja: "アルバイトナビゲーション" },
    category: "Jobs",
    shortDescription: {
      en: "Support for students looking for part-time jobs in Japan.",
      ja: "日本でアルバイトを探す学生向けサポート。",
    },
    fullDescription: {
      en: "Helps students understand work-hour rules, prepare basic Japanese interview answers, and search suitable part-time job categories.",
      ja: "就労時間ルール、面接回答準備、合うアルバイト探しをサポートします。",
    },
    companyName: "Student Work Assist",
    websiteUrl: "https://student-work.example.com",
    contactEmail: "hello@student-work.example.com",
    phoneNumber: "058-240-7788",
    postalCode: "500-8367",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese", "Nepali"],
    priceInfo: "Free guidance",
    workingHours: "Tue - Sat 11:00 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "IT Career Starter Japan", ja: "ITキャリアスタートジャパン" },
    category: "Jobs",
    shortDescription: {
      en: "Basic career support for foreign IT graduates in Japan.",
      ja: "日本でIT就職を目指す外国人向けキャリアサポート。",
    },
    fullDescription: {
      en: "Support for IT portfolio review, Japanese resume structure, interview practice, and career path consultation.",
      ja: "ITポートフォリオ確認、履歴書、面接練習、キャリア相談を行います。",
    },
    companyName: "NextStep Tech Career",
    websiteUrl: "https://nextstep-tech.example.com",
    contactEmail: "career@nextstep-tech.example.com",
    phoneNumber: "052-600-9044",
    postalCode: "450-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nagoya, Aichi",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Career session from ¥4,000",
    workingHours: "Mon - Fri 10:00 - 18:30",
    thumbnailImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },

  // Visa Support
  {
    title: { en: "Visa Document Support", ja: "ビザ書類サポート" },
    category: "Visa Support",
    shortDescription: {
      en: "Document preparation support for visa and residence procedures.",
      ja: "ビザ・在留手続きの書類準備サポート。",
    },
    fullDescription: {
      en: "General document checking support for residence status, renewal, and application preparation. Official confirmation should be done with immigration.",
      ja: "在留資格、更新、申請準備の一般的な書類確認サポート。最終確認は入管で行ってください。",
    },
    companyName: "Japan Residence Assist",
    websiteUrl: "https://residence-assist.example.com",
    contactEmail: "visa@residence-assist.example.com",
    phoneNumber: "052-700-8211",
    postalCode: "460-0003",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Naka Ward, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Consultation from ¥5,000",
    workingHours: "Mon - Fri 9:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Student Visa Guidance", ja: "留学ビザガイダンス" },
    category: "Visa Support",
    shortDescription: {
      en: "Basic guidance for student visa renewal preparation.",
      ja: "留学ビザ更新準備の基本サポート。",
    },
    fullDescription: {
      en: "Helps students prepare common documents and understand general renewal steps. Users must confirm official rules with immigration or school office.",
      ja: "一般的な更新書類と流れを説明します。正式なルールは入管・学校で確認してください。",
    },
    companyName: "Study Life Visa Desk",
    websiteUrl: "https://studyvisa-desk.example.com",
    contactEmail: "student@studyvisa-desk.example.com",
    phoneNumber: "058-220-9031",
    postalCode: "501-0296",
    prefecture: "Gifu",
    city: "Mizuho",
    address: "Mizuho, Gifu",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥3,500",
    workingHours: "Mon - Sat 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Work Visa Consultation Support", ja: "就労ビザ相談サポート" },
    category: "Visa Support",
    shortDescription: {
      en: "General guidance for work visa application preparation.",
      ja: "就労ビザ申請準備の一般相談サポート。",
    },
    fullDescription: {
      en: "Provides general support for understanding work visa document preparation and points to confirm before application.",
      ja: "就労ビザの書類準備と申請前に確認するポイントを一般的に案内します。",
    },
    companyName: "Global Work Visa Partners",
    websiteUrl: "https://workvisa-partners.example.com",
    contactEmail: "support@workvisa-partners.example.com",
    phoneNumber: "052-900-4412",
    postalCode: "450-0003",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Meieki, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Consultation from ¥6,000",
    workingHours: "Weekdays 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1200&q=80",
  },

  // Moving Support
  {
    title: { en: "Easy Move Gifu", ja: "イージームーブ岐阜" },
    category: "Moving Support",
    shortDescription: {
      en: "Small moving support for students and foreign residents.",
      ja: "学生・外国人向けの小型引越しサポート。",
    },
    fullDescription: {
      en: "Support for small moves, luggage transport, appliance pickup, and room setup around Gifu and Aichi.",
      ja: "岐阜・愛知周辺で小型引越し、荷物運搬、家電引取、部屋準備をサポートします。",
    },
    companyName: "Easy Move Gifu Service",
    websiteUrl: "https://easymove-gifu.example.com",
    contactEmail: "move@easymove-gifu.example.com",
    phoneNumber: "058-310-8890",
    postalCode: "500-8288",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Small move from ¥8,000",
    workingHours: "Daily 9:00 - 20:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1600518464441-9306b0f0e9da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Student Moving Van", ja: "学生引越しバン" },
    category: "Moving Support",
    shortDescription: {
      en: "Affordable van moving service for students.",
      ja: "学生向けの手頃なバン引越しサービス。",
    },
    fullDescription: {
      en: "A compact moving service for dorm changes, apartment move-in, and furniture transport.",
      ja: "寮移動、アパート入居、家具運搬に対応する小型引越しサービス。",
    },
    companyName: "Campus Move Van Japan",
    websiteUrl: "https://campusmove.example.com",
    contactEmail: "booking@campusmove.example.com",
    phoneNumber: "058-330-4567",
    postalCode: "501-0223",
    prefecture: "Gifu",
    city: "Mizuho",
    address: "Mizuho City, Gifu",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "From ¥6,500",
    workingHours: "Sat - Sun 8:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Furniture Pickup Support", ja: "家具引取サポート" },
    category: "Moving Support",
    shortDescription: {
      en: "Furniture pickup and delivery support for foreign residents.",
      ja: "外国人向け家具の引取・配送サポート。",
    },
    fullDescription: {
      en: "Helps users pick up used furniture, deliver items, and arrange basic room setup.",
      ja: "中古家具の引取、配送、基本的な部屋セットアップをサポートします。",
    },
    companyName: "Life Setup Delivery",
    websiteUrl: "https://lifesetup-delivery.example.com",
    contactEmail: "support@lifesetup-delivery.example.com",
    phoneNumber: "052-820-6733",
    postalCode: "451-0045",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nishi Ward, Nagoya",
    languagesSupported: ["English", "Japanese", "Vietnamese"],
    priceInfo: "Delivery from ¥4,000",
    workingHours: "Daily 10:00 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
  },

  // Japanese Schools
  {
    title: { en: "Nagoya Japanese Lesson Support", ja: "名古屋日本語レッスンサポート" },
    category: "Japanese Schools",
    shortDescription: {
      en: "Japanese lessons for daily life and job interviews.",
      ja: "生活・面接向け日本語レッスン。",
    },
    fullDescription: {
      en: "Offers practical Japanese learning support for daily conversation, work communication, and interview practice.",
      ja: "日常会話、仕事の日本語、面接練習など実用的な日本語学習をサポートします。",
    },
    companyName: "Nihongo Bridge Academy",
    websiteUrl: "https://nihongo-bridge.example.com",
    contactEmail: "lesson@nihongo-bridge.example.com",
    phoneNumber: "052-450-2332",
    postalCode: "460-0008",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Sakae, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Trial lesson ¥1,500",
    workingHours: "Mon - Sat 10:00 - 21:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "JLPT Study Room Gifu", ja: "岐阜JLPTスタディルーム" },
    category: "Japanese Schools",
    shortDescription: {
      en: "JLPT N5 to N2 study support for foreign students.",
      ja: "外国人学生向けJLPT N5〜N2学習サポート。",
    },
    fullDescription: {
      en: "Study support for grammar, kanji, reading, listening, and speaking practice.",
      ja: "文法、漢字、読解、聴解、会話練習をサポートします。",
    },
    companyName: "Gifu Language Study Hub",
    websiteUrl: "https://gifu-studyhub.example.com",
    contactEmail: "jlpt@gifu-studyhub.example.com",
    phoneNumber: "058-270-8120",
    postalCode: "500-8833",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu Station Area",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "Monthly from ¥8,000",
    workingHours: "Evenings and weekends",
    thumbnailImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Conversation Japanese Café", ja: "会話日本語カフェ" },
    category: "Japanese Schools",
    shortDescription: {
      en: "Relaxed Japanese conversation practice for daily life.",
      ja: "日常生活向けの日本語会話練習。",
    },
    fullDescription: {
      en: "Casual conversation sessions for foreigners who want to improve daily Japanese speaking confidence.",
      ja: "日常会話を自信を持って話せるようにするカジュアルな練習会です。",
    },
    companyName: "Talk Japan Learning Café",
    websiteUrl: "https://talkjapan-cafe.example.com",
    contactEmail: "hello@talkjapan-cafe.example.com",
    phoneNumber: "052-720-5510",
    postalCode: "460-0011",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Osu, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Session from ¥1,000",
    workingHours: "Wed - Sun 13:00 - 20:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  },

  // SIM / Internet
  {
    title: { en: "SIM Setup Support", ja: "SIM設定サポート" },
    category: "SIM / Internet",
    shortDescription: {
      en: "SIM card setup and mobile plan explanation.",
      ja: "SIMカード設定と携帯プラン説明サポート。",
    },
    fullDescription: {
      en: "Support for choosing a mobile plan, SIM setup, APN settings, and basic phone configuration.",
      ja: "携帯プラン選び、SIM設定、APN設定、スマホ初期設定をサポートします。",
    },
    companyName: "Mobile Connect Japan",
    websiteUrl: "https://mobileconnect.example.com",
    contactEmail: "support@mobileconnect.example.com",
    phoneNumber: "052-810-2440",
    postalCode: "450-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nagoya Station Area",
    languagesSupported: ["English", "Japanese", "Vietnamese"],
    priceInfo: "Setup from ¥2,000",
    workingHours: "Daily 10:00 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Home Wi-Fi Support", ja: "ホームWi-Fiサポート" },
    category: "SIM / Internet",
    shortDescription: {
      en: "Home internet and pocket Wi-Fi setup support.",
      ja: "自宅インターネットとポケットWi-Fi設定サポート。",
    },
    fullDescription: {
      en: "Helps users understand home internet options, pocket Wi-Fi setup, and router installation.",
      ja: "自宅インターネット、ポケットWi-Fi、ルーター設定をサポートします。",
    },
    companyName: "Smart Net Life Japan",
    websiteUrl: "https://smartnet-life.example.com",
    contactEmail: "wifi@smartnet-life.example.com",
    phoneNumber: "058-260-7001",
    postalCode: "500-8175",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Consultation free",
    workingHours: "Mon - Sat 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Foreigner Phone Setup Desk", ja: "外国人スマホ設定デスク" },
    category: "SIM / Internet",
    shortDescription: {
      en: "Phone setup support after arriving in Japan.",
      ja: "来日後のスマホ設定サポート。",
    },
    fullDescription: {
      en: "Support for phone settings, language setup, mobile apps, email setup, and account configuration.",
      ja: "スマホ設定、言語設定、アプリ、メール、アカウント設定をサポートします。",
    },
    companyName: "Japan Phone Assist",
    websiteUrl: "https://phoneassist.example.com",
    contactEmail: "help@phoneassist.example.com",
    phoneNumber: "052-911-2310",
    postalCode: "461-0001",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Higashi Ward, Nagoya",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥1,500",
    workingHours: "Daily 11:00 - 20:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  },

  // Hospital / Medical
  {
    title: { en: "Medical Visit Support", ja: "病院同行サポート" },
    category: "Hospital / Medical",
    shortDescription: {
      en: "Support for hospital visits and basic medical communication.",
      ja: "病院訪問と医療コミュニケーションサポート。",
    },
    fullDescription: {
      en: "Helps users prepare for clinic visits, explain symptoms simply, and understand basic hospital procedures.",
      ja: "病院訪問の準備、症状説明、基本的な手続き理解をサポートします。",
    },
    companyName: "Care Bridge Support",
    websiteUrl: "https://carebridge.example.com",
    contactEmail: "medical@carebridge.example.com",
    phoneNumber: "058-250-6630",
    postalCode: "500-8384",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City Medical Area",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Support from ¥4,000",
    workingHours: "Mon - Fri 9:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Health Insurance Guide", ja: "健康保険ガイド" },
    category: "Hospital / Medical",
    shortDescription: {
      en: "Basic guidance for health insurance and clinic use.",
      ja: "健康保険と病院利用の基本ガイド。",
    },
    fullDescription: {
      en: "Explains general points about health insurance card use, clinic reception, and payment flow.",
      ja: "保険証利用、受付、支払いの流れなどを一般的に説明します。",
    },
    companyName: "Life Health Guide Japan",
    websiteUrl: "https://lifehealth-guide.example.com",
    contactEmail: "info@lifehealth-guide.example.com",
    phoneNumber: "052-660-9090",
    postalCode: "460-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nagoya, Aichi",
    languagesSupported: ["English", "Japanese", "Vietnamese"],
    priceInfo: "Free basic consultation",
    workingHours: "Mon - Sat 9:30 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Clinic Translation Help", ja: "クリニック通訳ヘルプ" },
    category: "Hospital / Medical",
    shortDescription: {
      en: "Simple translation help for clinic reservations and visits.",
      ja: "クリニック予約・受診の簡単な通訳サポート。",
    },
    fullDescription: {
      en: "Supports simple communication for clinic booking, reception, symptoms and medicine explanation.",
      ja: "予約、受付、症状、薬の説明など簡単なコミュニケーションをサポートします。",
    },
    companyName: "Med Talk Assist",
    websiteUrl: "https://medtalk-assist.example.com",
    contactEmail: "clinic@medtalk-assist.example.com",
    phoneNumber: "058-299-2215",
    postalCode: "501-0203",
    prefecture: "Gifu",
    city: "Mizuho",
    address: "Mizuho, Gifu",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥3,000",
    workingHours: "Weekdays 10:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
  },

  // Translation
  {
    title: { en: "Document Translation Support", ja: "書類翻訳サポート" },
    category: "Translation",
    shortDescription: {
      en: "Translation support for daily life documents.",
      ja: "生活関連書類の翻訳サポート。",
    },
    fullDescription: {
      en: "Translation support for simple documents, letters, application forms, and daily life notices.",
      ja: "簡単な書類、手紙、申込書、生活通知の翻訳をサポートします。",
    },
    companyName: "Clear Words Japan",
    websiteUrl: "https://clearwords.example.com",
    contactEmail: "translate@clearwords.example.com",
    phoneNumber: "052-505-3088",
    postalCode: "460-0008",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Sakae, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "From ¥2,000 per page",
    workingHours: "Mon - Fri 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "City Office Interpretation", ja: "市役所通訳サポート" },
    category: "Translation",
    shortDescription: {
      en: "Interpretation support for city office procedures.",
      ja: "市役所手続きの通訳サポート。",
    },
    fullDescription: {
      en: "Basic interpretation support for address registration, certificates, national health insurance and daily procedures.",
      ja: "住所登録、証明書、国民健康保険など日常手続きの通訳をサポートします。",
    },
    companyName: "Yakusho Language Assist",
    websiteUrl: "https://yakusho-assist.example.com",
    contactEmail: "support@yakusho-assist.example.com",
    phoneNumber: "058-266-4500",
    postalCode: "500-8701",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese", "Vietnamese", "Sinhala"],
    priceInfo: "From ¥3,500",
    workingHours: "Weekdays 9:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Personal Letter Translation", ja: "個人レター翻訳" },
    category: "Translation",
    shortDescription: {
      en: "Help understanding letters, notices, and forms in Japanese.",
      ja: "日本語の手紙・通知・フォーム理解サポート。",
    },
    fullDescription: {
      en: "Helps users understand Japanese letters from city offices, apartments, schools, banks and service providers.",
      ja: "市役所、アパート、学校、銀行、サービス会社からの日本語通知を理解するサポートです。",
    },
    companyName: "Everyday Japan Translate",
    websiteUrl: "https://everyday-translate.example.com",
    contactEmail: "hello@everyday-translate.example.com",
    phoneNumber: "052-460-7771",
    postalCode: "450-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Meieki, Nagoya",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥1,000",
    workingHours: "Daily 10:00 - 20:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  },

  // Insurance
  {
    title: { en: "Life Insurance Guide", ja: "生命保険ガイド" },
    category: "Insurance",
    shortDescription: {
      en: "Simple explanation of insurance options for foreign residents.",
      ja: "外国人向け保険オプションの簡単な説明。",
    },
    fullDescription: {
      en: "General guidance about life insurance, medical insurance and basic points to check before applying.",
      ja: "生命保険、医療保険、申込前の確認ポイントを一般的に案内します。",
    },
    companyName: "SafeLife Japan Advisory",
    websiteUrl: "https://safelife.example.com",
    contactEmail: "info@safelife.example.com",
    phoneNumber: "052-770-1900",
    postalCode: "460-0003",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Naka Ward, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Free consultation",
    workingHours: "Mon - Fri 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Apartment Insurance Support", ja: "賃貸保険サポート" },
    category: "Insurance",
    shortDescription: {
      en: "Support understanding apartment insurance requirements.",
      ja: "賃貸契約時の保険条件を理解するサポート。",
    },
    fullDescription: {
      en: "Explains common apartment insurance requirements, contract points, and basic coverage information.",
      ja: "賃貸保険の一般的な条件、契約ポイント、補償内容を説明します。",
    },
    companyName: "Rental Safety Desk",
    websiteUrl: "https://rental-safety.example.com",
    contactEmail: "support@rental-safety.example.com",
    phoneNumber: "058-350-7120",
    postalCode: "501-0232",
    prefecture: "Gifu",
    city: "Mizuho",
    address: "Mizuho, Gifu",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "From ¥1,500",
    workingHours: "Mon - Sat 10:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Student Insurance Help", ja: "学生保険ヘルプ" },
    category: "Insurance",
    shortDescription: {
      en: "Insurance explanation support for international students.",
      ja: "留学生向け保険説明サポート。",
    },
    fullDescription: {
      en: "Helps international students understand basic insurance documents and important points before signing.",
      ja: "留学生が保険書類や契約前の重要ポイントを理解できるようにサポートします。",
    },
    companyName: "Campus Safety Insurance Guide",
    websiteUrl: "https://campus-insurance.example.com",
    contactEmail: "student@campus-insurance.example.com",
    phoneNumber: "058-280-4451",
    postalCode: "500-8381",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese", "Vietnamese"],
    priceInfo: "Free document check",
    workingHours: "Weekdays 9:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },

  // Banking
  {
    title: { en: "Bank Account Opening Help", ja: "銀行口座開設サポート" },
    category: "Banking",
    shortDescription: {
      en: "Support for preparing documents for bank account opening.",
      ja: "銀行口座開設の書類準備サポート。",
    },
    fullDescription: {
      en: "Guidance for preparing residence card, address information, phone number and other common bank requirements.",
      ja: "在留カード、住所、電話番号など銀行口座開設に必要な一般書類を案内します。",
    },
    companyName: "Japan Bank Setup Assist",
    websiteUrl: "https://banksetup.example.com",
    contactEmail: "bank@banksetup.example.com",
    phoneNumber: "052-300-4560",
    postalCode: "450-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nagoya Station Area",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "From ¥2,000",
    workingHours: "Mon - Fri 10:00 - 16:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Payment App Setup Support", ja: "決済アプリ設定サポート" },
    category: "Banking",
    shortDescription: {
      en: "Help setting up payment apps and bank connection basics.",
      ja: "決済アプリと銀行連携の基本設定サポート。",
    },
    fullDescription: {
      en: "Support for understanding payment app registration, identity verification and basic bank linking steps.",
      ja: "決済アプリ登録、本人確認、銀行連携の基本的な流れをサポートします。",
    },
    companyName: "Smart Payment Japan Desk",
    websiteUrl: "https://smartpayment.example.com",
    contactEmail: "payment@smartpayment.example.com",
    phoneNumber: "058-260-3920",
    postalCode: "500-8842",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥1,500",
    workingHours: "Daily 10:00 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Money Transfer Guidance", ja: "送金ガイダンス" },
    category: "Banking",
    shortDescription: {
      en: "Basic support for understanding remittance options.",
      ja: "海外送金オプションの基本サポート。",
    },
    fullDescription: {
      en: "General guidance about international money transfer preparation, documents and points to check.",
      ja: "海外送金の準備、必要書類、確認ポイントを一般的に案内します。",
    },
    companyName: "Global Remit Help Desk",
    websiteUrl: "https://globalremit-help.example.com",
    contactEmail: "remit@globalremit-help.example.com",
    phoneNumber: "052-350-8088",
    postalCode: "460-0008",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Sakae, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Consultation from ¥2,000",
    workingHours: "Mon - Sat 10:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  },

  // Driving School
  {
    title: { en: "Driving License Support", ja: "運転免許サポート" },
    category: "Driving School",
    shortDescription: {
      en: "General support for driving license process in Japan.",
      ja: "日本の運転免許手続きの一般サポート。",
    },
    fullDescription: {
      en: "Guidance about license conversion, document preparation, driving school options and basic test preparation.",
      ja: "免許切替、書類準備、教習所、試験準備について一般的に案内します。",
    },
    companyName: "Road Start Japan",
    websiteUrl: "https://roadstart.example.com",
    contactEmail: "drive@roadstart.example.com",
    phoneNumber: "058-240-1120",
    postalCode: "500-8233",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Consultation from ¥3,000",
    workingHours: "Mon - Sat 9:00 - 18:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Beginner Driving School Guide", ja: "初心者教習所ガイド" },
    category: "Driving School",
    shortDescription: {
      en: "Driving school selection support for beginners.",
      ja: "初心者向け教習所選びサポート。",
    },
    fullDescription: {
      en: "Helps users compare driving school options, understand lesson flow, schedule, and approximate costs.",
      ja: "教習所の比較、授業の流れ、スケジュール、費用の目安をサポートします。",
    },
    companyName: "Drive Learning Assist",
    websiteUrl: "https://drivelearning.example.com",
    contactEmail: "school@drivelearning.example.com",
    phoneNumber: "052-840-2300",
    postalCode: "468-0051",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Tenpaku Ward, Nagoya",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "Free consultation",
    workingHours: "Daily 9:00 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Foreign License Conversion Help", ja: "外国免許切替ヘルプ" },
    category: "Driving School",
    shortDescription: {
      en: "Support for understanding foreign license conversion.",
      ja: "外国免許切替の流れを理解するサポート。",
    },
    fullDescription: {
      en: "General guidance for foreign license conversion document preparation and appointment points.",
      ja: "外国免許切替の書類準備、予約、確認ポイントを一般的に案内します。",
    },
    companyName: "License Change Support Japan",
    websiteUrl: "https://licensechange.example.com",
    contactEmail: "support@licensechange.example.com",
    phoneNumber: "058-290-8821",
    postalCode: "500-8383",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "From ¥4,000",
    workingHours: "Weekdays 10:00 - 17:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  },

  // Daily Life Support
  {
    title: { en: "City Office Procedure Help", ja: "市役所手続きヘルプ" },
    category: "Daily Life Support",
    shortDescription: {
      en: "Daily life procedure support for foreign residents.",
      ja: "外国人向け生活手続きサポート。",
    },
    fullDescription: {
      en: "Support for address registration, residence certificate, national health insurance and basic city office procedures.",
      ja: "住所登録、住民票、国民健康保険、市役所の基本手続きをサポートします。",
    },
    companyName: "Japan Life Admin Support",
    websiteUrl: "https://lifeadmin.example.com",
    contactEmail: "admin@lifeadmin.example.com",
    phoneNumber: "058-210-7009",
    postalCode: "500-8701",
    prefecture: "Gifu",
    city: "Gifu City",
    address: "Gifu City, Japan",
    languagesSupported: ["English", "Japanese", "Vietnamese", "Sinhala"],
    priceInfo: "From ¥3,000",
    workingHours: "Weekdays 9:00 - 17:30",
    thumbnailImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "New Resident Setup Pack", ja: "新生活セットアップパック" },
    category: "Daily Life Support",
    shortDescription: {
      en: "Setup support for new foreign residents in Japan.",
      ja: "来日後の新生活セットアップサポート。",
    },
    fullDescription: {
      en: "Support for SIM, bank, address, basic shopping, household setup and daily life explanation.",
      ja: "SIM、銀行、住所登録、買い物、生活準備、生活説明をサポートします。",
    },
    companyName: "Start Japan Life Support",
    websiteUrl: "https://startjapan-life.example.com",
    contactEmail: "start@startjapan-life.example.com",
    phoneNumber: "052-405-1122",
    postalCode: "450-0002",
    prefecture: "Aichi",
    city: "Nagoya",
    address: "Nagoya Station Area",
    languagesSupported: ["English", "Japanese", "Sinhala"],
    priceInfo: "Setup pack from ¥12,000",
    workingHours: "Daily 10:00 - 19:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: { en: "Emergency Daily Support", ja: "緊急生活サポート" },
    category: "Daily Life Support",
    shortDescription: {
      en: "Support for urgent daily life problems.",
      ja: "生活上の急な困りごとサポート。",
    },
    fullDescription: {
      en: "Helps users understand what to do for lost items, urgent letters, apartment problems, or daily life trouble.",
      ja: "忘れ物、急な通知、アパート問題、生活トラブル時の対応をサポートします。",
    },
    companyName: "Help Now Japan Desk",
    websiteUrl: "https://helpnow-japan.example.com",
    contactEmail: "urgent@helpnow-japan.example.com",
    phoneNumber: "058-333-7000",
    postalCode: "501-0200",
    prefecture: "Gifu",
    city: "Mizuho",
    address: "Mizuho, Gifu",
    languagesSupported: ["English", "Japanese"],
    priceInfo: "From ¥3,500",
    workingHours: "Daily 8:00 - 22:00",
    thumbnailImage:
      "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?auto=format&fit=crop&w=1200&q=80",
  },
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    let created = 0;
    let updated = 0;

    for (const item of services) {
      const slug = createSlug(item.title.en);

      const payload = {
        ...item,
        slug,
        status: "published",
        isFeatured: ["Housing", "Jobs", "Daily Life Support"].includes(item.category),
      };

      const existing = await Service.findOne({ slug });

      if (existing) {
        await Service.findByIdAndUpdate(existing._id, payload, {
          new: true,
          runValidators: true,
        });
        updated += 1;
      } else {
        await Service.create(payload);
        created += 1;
      }
    }

    console.log(`Services seed completed: ${created} created, ${updated} updated`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();