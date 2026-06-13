import Service from "../models/Service.js";
import { xenoKnowledge } from "../data/xenoKnowledge.js";
import { askGroq, fallbackXenoAnswer } from "../services/groqService.js";

const detectLanguage = (text = "") => {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text) ? "ja" : "en";
};

const intentKeywords = {
  jobs: [
    "job",
    "work",
    "career",
    "internship",
    "baito",
    "part-time",
    "仕事",
    "アルバイト",
    "就職",
    "インターン",
  ],
  housing: [
    "house",
    "room",
    "apartment",
    "rent",
    "housing",
    "moving",
    "部屋",
    "家",
    "アパート",
    "住居",
    "引っ越し",
  ],
  city: [
    "city office",
    "yakusho",
    "resident",
    "address",
    "city hall",
    "市役所",
    "役所",
    "住民票",
    "住所",
  ],
  medical: [
    "hospital",
    "doctor",
    "clinic",
    "insurance",
    "medical",
    "病院",
    "医者",
    "保険",
  ],
  visa: ["visa", "immigration", "status of residence", "在留", "ビザ", "入管"],
  contact: ["contact", "message", "support", "feedback", "admin", "問い合わせ"],
  report: ["report", "problem", "issue", "wrong", "scam", "報告", "問題"],
};

const detectIntent = (message = "") => {
  const lower = message.toLowerCase();

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((keyword) => lower.includes(keyword.toLowerCase()))) {
      return intent;
    }
  }

  return "general";
};

const normalize = (value = "") => String(value || "").toLowerCase();

const tokenize = (text = "") => {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2)
    .slice(0, 20);
};

const getServiceText = (service) => {
  return [
    service.title?.en,
    service.title?.ja,
    service.shortDescription?.en,
    service.shortDescription?.ja,
    service.fullDescription?.en,
    service.fullDescription?.ja,
    service.companyName,
    service.category,
    service.city,
    service.prefecture,
    service.languagesSupported?.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const scoreService = (service, message, intent) => {
  const text = getServiceText(service);
  const category = normalize(service.category);
  const words = tokenize(message);

  let score = 0;

  if (intent !== "general") {
    const keywords = intentKeywords[intent] || [];

    if (keywords.some((keyword) => category.includes(keyword.toLowerCase()))) {
      score += 15;
    }

    if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      score += 8;
    }
  }

  for (const word of words) {
    if (text.includes(word)) {
      score += 2;
    }
  }

  if (service.isFeatured) {
    score += 1;
  }

  return score;
};

const getKnowledgeText = (item) => {
  return [item.title, item.category, item.content, ...(item.keywords || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const scoreKnowledge = (item, message, intent) => {
  const text = getKnowledgeText(item);
  const words = tokenize(message);

  let score = 0;

  if (intent !== "general" && item.category === intent) {
    score += 12;
  }

  const keywords = item.keywords || [];

  for (const keyword of keywords) {
    if (message.toLowerCase().includes(keyword.toLowerCase())) {
      score += 8;
    }
  }

  for (const word of words) {
    if (text.includes(word)) {
      score += 2;
    }
  }

  if (item.category === "platform" && intent === "general") {
    score += 2;
  }

  return score;
};

const buildServicesContext = (services) => {
  if (!services.length) return "";

  return services
    .map((service, index) => {
      return `
SERVICE ${index + 1}:
Title: ${service.title?.en || ""}
Japanese Title: ${service.title?.ja || ""}
Category: ${service.category || ""}
Location: ${[service.city, service.prefecture].filter(Boolean).join(", ") || "Japan"}
Description: ${service.shortDescription?.en || ""}
Japanese Description: ${service.shortDescription?.ja || ""}
Price: ${service.priceInfo || ""}
Working Hours: ${service.workingHours || ""}
Link: /services/${service.slug}
`;
    })
    .join("\n");
};

const buildKnowledgeContext = (knowledgeItems) => {
  if (!knowledgeItems.length) return "";

  return knowledgeItems
    .map((item, index) => {
      return `
KNOWLEDGE ${index + 1}:
Title: ${item.title}
Category: ${item.category}
Content: ${item.content}
`;
    })
    .join("\n");
};

export const chatWithXeno = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const language = detectLanguage(message);
    const intent = detectIntent(message);

    const allServices = await Service.find({ status: "published" })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(80);

    const scoredServices = allServices
      .map((service) => ({
        service,
        score: scoreService(service, message, intent),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const scoredKnowledge = xenoKnowledge
      .map((item) => ({
        item,
        score: scoreKnowledge(item, message, intent),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    const services = scoredServices.map((item) => item.service);
    const knowledgeItems = scoredKnowledge.map((entry) => entry.item);

    const servicesContext = buildServicesContext(services);
    const knowledgeContext = buildKnowledgeContext(knowledgeItems);

    const context = `
XENJI STATIC KNOWLEDGE:
${knowledgeContext || "No matching static knowledge found."}

XENJI SERVICE RESULTS:
${servicesContext || "No matching published services found."}
`;

    let answer = "";
    let aiMode = "groq";

    try {
      answer = await askGroq({
        question: message,
        context,
        language,
        intent,
        hasServices: services.length > 0,
        hasKnowledge: knowledgeItems.length > 0,
      });
    } catch (error) {
      console.log("Groq fallback used:", error.status || error.message);

      aiMode = "fallback";

      answer = fallbackXenoAnswer({
        question: message,
        context,
        language,
        intent,
      });
    }

    return res.json({
      success: true,
      mode: aiMode,
      intent,
      answer,
      relatedServices: services,
      relatedKnowledge: knowledgeItems,
      relatedArticles: [],
      suggestedQuestions:
        language === "ja"
          ? [
              "仕事のサービスを探したい",
              "部屋探しをしたい",
              "市役所の手続きについて知りたい",
            ]
          : [
              "I need job support",
              "I need housing support",
              "How can I contact Xenji?",
            ],
    });
  } catch (error) {
    next(error);
  }
};