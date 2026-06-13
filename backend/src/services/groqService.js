import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askGroq = async ({
  question,
  context = "",
  language = "en",
  intent = "general",
  hasServices = false,
  hasKnowledge = false,
}) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const hasContext = Boolean(context && context.trim());

  const systemPrompt = `
You are Xeno AI, the assistant inside Xenji.

Identity:
- You are not a general internet assistant.
- You help users understand and use Xenji.
- Xenji is a support platform for foreigners living in Japan.
- Xenji focuses on services such as housing, jobs, moving, medical support, translation, banking, driving school, SIM/internet, Japanese schools, visa support and daily life support.

Answer rules:
- Answer in ${language === "ja" ? "Japanese" : "English"}.
- Keep answers short, practical and friendly.
- Maximum 4 short sentences.
- Use the provided Xenji context first.
- If matching Xenji services are provided, recommend those service categories or service links.
- If no matching services are provided, guide the user to the correct Xenji Services category.
- If static knowledge is provided, use it to explain Xenji features and process.
- Do not invent service names, company names, prices, emails or phone numbers.
- Do not recommend external websites, companies, agencies, communities, apps or platforms.
- Do not mention Japan Times, GaijinPot, Indeed, LinkedIn, Hello Work or other external services unless they appear in the provided context.
- For visa, tax, legal, medical, immigration or official procedures, give general guidance and tell users to confirm with the correct official office.
- Never claim that Xenji has a service unless it appears in XENJI SERVICE RESULTS.
`;

  const userPrompt = `
User intent: ${intent}

Context status:
- Has matching published services: ${hasServices ? "yes" : "no"}
- Has matching static Xenji knowledge: ${hasKnowledge ? "yes" : "no"}
- Has any context: ${hasContext ? "yes" : "no"}

Provided Xenji context:
${hasContext ? context : "No matching Xenji context found."}

User question:
${question}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.12,
    max_tokens: 450,
  });

  const answer = completion.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    return fallbackXenoAnswer({ question, context, language, intent });
  }

  return answer;
};

export const fallbackXenoAnswer = ({
  question,
  context = "",
  language = "en",
  intent = "general",
}) => {
  const q = question.toLowerCase();

  if (context.trim()) {
    return language === "ja"
      ? "Xenjiに関連する情報が見つかりました。サービスページや関連カテゴリを確認してください。"
      : "I found related Xenji information. Please check the related service category or service details in Xenji.";
  }

  if (
    intent === "jobs" ||
    q.includes("job") ||
    q.includes("work") ||
    q.includes("baito") ||
    q.includes("career")
  ) {
    return language === "ja"
      ? "仕事のサポートを探す場合は、Xenji ServicesのJobsカテゴリを確認してください。Xenji内のサービスから、自分に合うサポートを探せます。"
      : "For job support, please check the Jobs category in Xenji Services. You can find suitable support from services listed inside Xenji.";
  }

  if (
    intent === "housing" ||
    q.includes("house") ||
    q.includes("room") ||
    q.includes("apartment") ||
    q.includes("housing")
  ) {
    return language === "ja"
      ? "部屋探しのサポートを探す場合は、Xenji ServicesのHousingカテゴリを確認してください。Xenji内のサービスから、住居サポートを探せます。"
      : "For housing support, please check the Housing category in Xenji Services. You can find housing support from services listed inside Xenji.";
  }

  if (intent === "visa" || q.includes("visa") || q.includes("immigration")) {
    return language === "ja"
      ? "ビザについては、Xenjiでサポートサービスを探せますが、重要な内容は入管や公式情報で確認してください。"
      : "For visa questions, Xenji can help you find support services, but please confirm important details with immigration or official sources.";
  }

  if (intent === "city" || q.includes("city office") || q.includes("yakusho")) {
    return language === "ja"
      ? "市役所の手続きについては、Xenji Servicesで生活サポートを確認してください。詳しい条件は市役所の公式情報で確認してください。"
      : "For city office procedures, please check daily life support in Xenji Services. For exact requirements, confirm with your city office’s official information.";
  }

  if (intent === "contact" || q.includes("contact") || q.includes("message")) {
    return language === "ja"
      ? "XenjiのContactページから質問やサービス依頼を送信できます。送信された内容は管理画面で確認されます。"
      : "You can send questions or service requests from the Xenji Contact page. Your message will be reviewed from the admin dashboard.";
  }

  if (intent === "report" || q.includes("report") || q.includes("problem")) {
    return language === "ja"
      ? "サービスや内容に問題がある場合は、Xenjiで報告できます。管理者がReports画面で確認します。"
      : "If there is a problem with a service or content, you can report it in Xenji. Admins can review reports from the Reports dashboard.";
  }

  return language === "ja"
    ? "Xenjiでは、仕事、住居、医療、生活サポートなどを探せます。Servicesページからカテゴリを選んで確認してください。"
    : "Xenji can help you search for jobs, housing, medical support and daily life services. Please check the Services page and choose a category.";
};