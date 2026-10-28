(() => {
  "use strict";
  const ids = [
    "home",
    "education",
    "career",
    "digital",
    "access",
    "chat",
    "settings",
    "about",
  ];
  const icons = ["⌂", "▤", "▣", "◇", "♿", "✦", "⚙", "ⓘ"];
  const STORAGE_KEY = "accessbridge-v2";
  const savedState = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  })();
  let lang = savedState.lang || "en",
    page = "home",
    mode = savedState.mode || "live",
    busy = false;
  const history = Array.isArray(savedState.history)
    ? savedState.history.slice(-30)
    : [];
  let savedPlans = Array.isArray(savedState.plans)
    ? savedState.plans.slice(-20)
    : [];
  const $ = (id) => document.getElementById(id),
    t = (k) => LANGS[lang][k] || LANGS.en[k] || k;
  const escape = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const UI = {
    en: {
      liveReady: "Live AI ready",
      copy: "Copy",
      download: "Download",
      save: "Save plan",
      saved: "Saved plans",
      remove: "Delete",
      clear: "Clear chat",
      speak: "Read aloud",
      voice: "Voice input",
      details: "Your goal",
      privacy:
        "Your plans stay in this browser. Never enter passwords, OTPs or sensitive identity data.",
      sources: "Trusted sources",
      impact:
        "Built to reduce digital access barriers in education, careers and essential online services.",
      architecture:
        "Live AI with a safe rule-based fallback · multilingual · local privacy-first storage",
      verify:
        "Verify important information on the official website before acting.",
      required: "Please complete the highlighted fields before continuing.",
      topicRequired: "Enter a subject or service name.",
      detailsRequired: "Describe what help you need.",
      questionRequired: "Enter a question before sending.",
      working: "Preparing your result…",
      resultReady: "Your result is ready.",
    },
    bn: {
      liveReady: "Live AI প্রস্তুত",
      copy: "কপি",
      download: "ডাউনলোড",
      save: "পরিকল্পনা সেভ",
      saved: "সেভ করা পরিকল্পনা",
      remove: "ডিলিট",
      clear: "চ্যাট মুছুন",
      speak: "শুনুন",
      voice: "কথা বলুন",
      details: "আপনার লক্ষ্য",
      privacy:
        "পরিকল্পনা এই ব্রাউজারেই থাকে। পাসওয়ার্ড, OTP বা সংবেদনশীল পরিচয় তথ্য লিখবেন না।",
      sources: "বিশ্বস্ত উৎস",
      impact:
        "শিক্ষা, কর্মসংস্থান ও জরুরি অনলাইন সেবায় ডিজিটাল বাধা কমানোর জন্য তৈরি।",
      architecture:
        "Live AI ও নিরাপদ rule-based fallback · বহুভাষিক · privacy-first local storage",
      verify: "কাজ করার আগে গুরুত্বপূর্ণ তথ্য অফিসিয়াল ওয়েবসাইটে যাচাই করুন।",
      required: "চালিয়ে যাওয়ার আগে চিহ্নিত ঘরগুলো পূরণ করুন।",
      topicRequired: "বিষয় বা সেবার নাম লিখুন।",
      detailsRequired: "আপনার কী সাহায্য প্রয়োজন তা লিখুন।",
      questionRequired: "পাঠানোর আগে একটি প্রশ্ন লিখুন।",
      working: "ফলাফল প্রস্তুত হচ্ছে…",
      resultReady: "আপনার ফলাফল প্রস্তুত।",
    },
    ar: {
      liveReady: "الذكاء المباشر جاهز",
      copy: "نسخ",
      download: "تنزيل",
      save: "حفظ الخطة",
      saved: "الخطط المحفوظة",
      remove: "حذف",
      clear: "مسح المحادثة",
      speak: "قراءة بصوت عالٍ",
      voice: "إدخال صوتي",
      details: "هدفك",
      privacy:
        "تبقى الخطط في هذا المتصفح. لا تدخل كلمات المرور أو رموز OTP أو بيانات الهوية الحساسة.",
      sources: "مصادر موثوقة",
      impact:
        "مصمم لتقليل حواجز الوصول الرقمي في التعليم والعمل والخدمات الأساسية.",
      architecture:
        "ذكاء مباشر مع بديل آمن · متعدد اللغات · تخزين محلي يحترم الخصوصية",
      verify: "تحقق من المعلومات المهمة على الموقع الرسمي قبل التصرف.",
      required: "يرجى إكمال الحقول المحددة قبل المتابعة.",
      topicRequired: "أدخل اسم الموضوع أو الخدمة.",
      detailsRequired: "صف المساعدة التي تحتاجها.",
      questionRequired: "أدخل سؤالاً قبل الإرسال.",
      working: "جارٍ إعداد النتيجة…",
      resultReady: "النتيجة جاهزة.",
    },
    nl: {
      liveReady: "Live AI gereed",
      copy: "Kopiëren",
      download: "Downloaden",
      save: "Plan opslaan",
      saved: "Opgeslagen plannen",
      remove: "Verwijderen",
      clear: "Chat wissen",
      speak: "Voorlezen",
      voice: "Spraakinvoer",
      details: "Uw doel",
      privacy:
        "Plannen blijven in deze browser. Voer nooit wachtwoorden, OTP-codes of gevoelige identiteitsgegevens in.",
      sources: "Betrouwbare bronnen",
      impact:
        "Ontworpen om digitale drempels in onderwijs, werk en essentiële online diensten te verminderen.",
      architecture:
        "Live AI met veilige fallback · meertalig · lokale privacygerichte opslag",
      verify:
        "Controleer belangrijke informatie op de officiële website voordat u handelt.",
      required: "Vul de gemarkeerde velden in voordat u doorgaat.",
      topicRequired: "Vul een onderwerp of dienst in.",
      detailsRequired: "Beschrijf welke hulp u nodig hebt.",
      questionRequired: "Vul een vraag in voordat u verzendt.",
      working: "Uw resultaat wordt voorbereid…",
      resultReady: "Uw resultaat is klaar.",
    },
    de: {
      liveReady: "Live-KI bereit",
      copy: "Kopieren",
      download: "Herunterladen",
      save: "Plan speichern",
      saved: "Gespeicherte Pläne",
      remove: "Löschen",
      clear: "Chat löschen",
      speak: "Vorlesen",
      voice: "Spracheingabe",
      details: "Ihr Ziel",
      privacy:
        "Pläne bleiben in diesem Browser. Geben Sie keine Passwörter, OTPs oder sensiblen Identitätsdaten ein.",
      sources: "Vertrauenswürdige Quellen",
      impact:
        "Entwickelt, um digitale Barrieren in Bildung, Beruf und wichtigen Onlinediensten zu reduzieren.",
      architecture:
        "Live-KI mit sicherem Fallback · mehrsprachig · lokaler datenschutzorientierter Speicher",
      verify: "Prüfen Sie wichtige Informationen auf der offiziellen Website.",
      required: "Füllen Sie die markierten Felder aus, bevor Sie fortfahren.",
      topicRequired: "Geben Sie ein Thema oder einen Dienst ein.",
      detailsRequired: "Beschreiben Sie, welche Hilfe Sie benötigen.",
      questionRequired: "Geben Sie vor dem Senden eine Frage ein.",
      working: "Ergebnis wird vorbereitet…",
      resultReady: "Ihr Ergebnis ist fertig.",
    },
  };
  const u = (k) => (UI[lang] || UI.en)[k] || UI.en[k] || k;
  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lang,
        mode,
        history: history.slice(-30),
        plans: savedPlans.slice(-20),
        large: document.body.classList.contains("large-text"),
        contrast: document.body.classList.contains("high-contrast"),
      }),
    );
  }
  function markdown(value) {
    let html = escape(value);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/^[-•] (.+)$/gm, '<span class="md-bullet">• $1</span>');
    return html.replace(/\n/g, "<br>");
  }
  function copyText(text) {
    return navigator.clipboard.writeText(text).then(() => announce(u("copy")));
  }
  function downloadText(text, name) {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
  function announce(text) {
    const el = $("announcer");
    if (el) el.textContent = text;
  }
  function measure() {
    const r = $("app").getBoundingClientRect();
    $("size").textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
  }
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document
      .querySelectorAll("[data-lang]")
      .forEach((b) => {
        const selected = b.dataset.lang === l;
        b.classList.toggle("selected", selected);
        b.setAttribute("aria-pressed", String(selected));
      });
    document
      .querySelectorAll("[data-i]")
      .forEach((el) => (el.textContent = t(el.dataset.i)));
    if ($("liveStatus")) $("liveStatus").textContent = u("liveReady");
    persist();
    render();
  }
  function nav() {
    $("menu").innerHTML = ids
      .map(
        (p, i) =>
          `<button type="button" data-page="${p}" class="${p === page ? "active" : ""}" ${p === page ? 'aria-current="page"' : ""} title="${escape(t(p))}"><span class="ico" aria-hidden="true">${icons[i]}</span><span class="txt">${escape(t(p))}</span></button>`,
      )
      .join("");
    $("menu")
      .querySelectorAll("button")
      .forEach(
        (b) =>
          (b.onclick = () => {
            page = b.dataset.page;
            render();
          }),
      );
  }
  function head(title, desc) {
    return `<div class="pagehead"><div><div class="eyebrow">AccessBridge AI</div><h1 id="pageTitle" tabindex="-1">${escape(title)}</h1><div class="muted">${escape(desc)}</div></div><span class="pill">● ${escape(u("liveReady"))}</span></div>`;
  }
  function card(p, i) {
    return `<article class="card"><div class="symbol">${icons[i]}</div><h3>${escape(t(p))}</h3><p>${escape(t({ education: "learnDesc", career: "careerDesc", digital: "digitalDesc", access: "accessDesc", chat: "chatDesc", settings: "settingsDesc", about: "aboutDesc" }[p]))}</p><button data-go="${p}">${escape(t("getStarted"))}</button></article>`;
  }
  const FORMS = {
    en: {
      education: [
        "Learning subject",
        "e.g. Web development",
        "Education level",
        "Beginner",
        "Intermediate",
        "Advanced",
        "Learning goal",
        "What would you like to learn?",
        "Create study plan",
        "Study plan",
        "Start with a short introductory lesson.",
        "Practice for 20–30 minutes daily.",
        "Build a small project and review progress weekly.",
      ],
      career: [
        "Target role",
        "e.g. Front-end developer",
        "Experience level",
        "Student / Entry level",
        "1–3 years",
        "Experienced",
        "Skills or CV details",
        "Describe your skills or interview needs",
        "Create career plan",
        "Career preparation",
        "List the skills required for this role.",
        "Prepare a focused one-page CV with evidence of your work.",
        "Practice five interview questions and identify next steps.",
      ],
      digital: [
        "Type of online service",
        "e.g. Online application",
        "Service category",
        "Government",
        "Education",
        "Other",
        "Help needed",
        "Explain the service or form you need help with",
        "Show service steps",
        "Digital service checklist",
        "Find the official website and confirm its address.",
        "Check the required documents, fees and eligibility.",
        "Complete the form carefully; never share OTPs or passwords.",
      ],
    },
    bn: {
      education: [
        "শেখার বিষয়",
        "যেমন ওয়েব ডেভেলপমেন্ট",
        "শিক্ষার স্তর",
        "নতুন শিখছি",
        "মধ্যম",
        "দক্ষ",
        "শেখার লক্ষ্য",
        "কী শিখতে চান লিখুন",
        "পড়াশোনার পরিকল্পনা",
        "পড়াশোনার পরিকল্পনা",
        "প্রথমে বিষয়টির পরিচিতিমূলক পাঠ দেখুন।",
        "প্রতিদিন ২০–৩০ মিনিট অনুশীলন করুন।",
        "ছোট প্রকল্প তৈরি করে প্রতি সপ্তাহে অগ্রগতি দেখুন।",
      ],
      career: [
        "কাঙ্ক্ষিত পেশা",
        "যেমন ফ্রন্টএন্ড ডেভেলপার",
        "অভিজ্ঞতা",
        "শিক্ষার্থী / নতুন",
        "১–৩ বছর",
        "অভিজ্ঞ",
        "দক্ষতা বা সিভির তথ্য",
        "দক্ষতা বা ইন্টারভিউর প্রয়োজন লিখুন",
        "ক্যারিয়ার পরিকল্পনা",
        "ক্যারিয়ার প্রস্তুতি",
        "পেশাটির প্রয়োজনীয় দক্ষতাগুলো তালিকা করুন।",
        "কাজের প্রমাণসহ সংক্ষিপ্ত এক পাতার সিভি বানান।",
        "পাঁচটি ইন্টারভিউ প্রশ্ন অনুশীলন করুন।",
      ],
      digital: [
        "অনলাইন সেবার নাম",
        "যেমন অনলাইন আবেদন",
        "সেবার বিভাগ",
        "সরকারি",
        "শিক্ষা",
        "অন্যান্য",
        "কী সাহায্য প্রয়োজন",
        "সেবা বা ফর্মটির বিবরণ লিখুন",
        "সেবার ধাপ দেখুন",
        "ডিজিটাল সেবা চেকলিস্ট",
        "সঠিক সরকারি/অফিশিয়াল ওয়েবসাইট খুঁজুন।",
        "প্রয়োজনীয় কাগজপত্র, ফি ও যোগ্যতা যাচাই করুন।",
        "সতর্কতার সঙ্গে ফর্ম পূরণ করুন; OTP বা পাসওয়ার্ড দেবেন না।",
      ],
    },
    ar: {
      education: [
        "موضوع التعلم",
        "مثال: تطوير الويب",
        "المستوى الدراسي",
        "مبتدئ",
        "متوسط",
        "متقدم",
        "هدف التعلم",
        "ماذا تريد أن تتعلم؟",
        "إنشاء خطة دراسة",
        "خطة الدراسة",
        "ابدأ بدرس تمهيدي قصير.",
        "تدرّب من 20 إلى 30 دقيقة يوميًا.",
        "أنشئ مشروعًا صغيرًا وراجع تقدمك أسبوعيًا.",
      ],
      career: [
        "الوظيفة المستهدفة",
        "مثال: مطور واجهات",
        "مستوى الخبرة",
        "طالب / مبتدئ",
        "1–3 سنوات",
        "ذو خبرة",
        "المهارات أو السيرة الذاتية",
        "اذكر مهاراتك أو احتياجات المقابلة",
        "إنشاء خطة مهنية",
        "الاستعداد المهني",
        "حدد المهارات المطلوبة للوظيفة.",
        "جهّز سيرة ذاتية مختصرة مع أمثلة عمل.",
        "تدرب على خمسة أسئلة مقابلة.",
      ],
      digital: [
        "نوع الخدمة الإلكترونية",
        "مثال: طلب إلكتروني",
        "فئة الخدمة",
        "حكومية",
        "تعليمية",
        "أخرى",
        "المساعدة المطلوبة",
        "اشرح الخدمة أو النموذج",
        "عرض خطوات الخدمة",
        "قائمة الخدمة الرقمية",
        "ابحث عن الموقع الرسمي وتحقق من عنوانه.",
        "راجع الوثائق والرسوم وشروط الأهلية.",
        "املأ النموذج بحذر ولا تشارك كلمات المرور أو رموز OTP.",
      ],
    },
    nl: {
      education: [
        "Leervak",
        "bijv. Webontwikkeling",
        "Opleidingsniveau",
        "Beginner",
        "Gemiddeld",
        "Gevorderd",
        "Leerdoel",
        "Wat wilt u leren?",
        "Studieplan maken",
        "Studieplan",
        "Begin met een korte introductieles.",
        "Oefen elke dag 20–30 minuten.",
        "Maak een klein project en evalueer wekelijks.",
      ],
      career: [
        "Gewenste functie",
        "bijv. Front-endontwikkelaar",
        "Ervaring",
        "Student / Starter",
        "1–3 jaar",
        "Ervaren",
        "Vaardigheden of cv",
        "Beschrijf vaardigheden of sollicitatievragen",
        "Loopbaanplan maken",
        "Loopbaanvoorbereiding",
        "Maak een lijst van vereiste vaardigheden.",
        "Maak een beknopt cv met voorbeelden van werk.",
        "Oefen vijf sollicitatievragen.",
      ],
      digital: [
        "Soort online dienst",
        "bijv. Online aanvraag",
        "Dienstcategorie",
        "Overheid",
        "Onderwijs",
        "Overig",
        "Hulpvraag",
        "Beschrijf de dienst of het formulier",
        "Toon servicestappen",
        "Digitale dienstenchecklist",
        "Zoek de officiële website en controleer het adres.",
        "Controleer documenten, kosten en voorwaarden.",
        "Vul alles zorgvuldig in; deel nooit wachtwoorden of OTP-codes.",
      ],
    },
    de: {
      education: [
        "Lernthema",
        "z. B. Webentwicklung",
        "Lernniveau",
        "Anfänger",
        "Mittelstufe",
        "Fortgeschritten",
        "Lernziel",
        "Was möchten Sie lernen?",
        "Lernplan erstellen",
        "Lernplan",
        "Beginnen Sie mit einer kurzen Einführung.",
        "Üben Sie täglich 20–30 Minuten.",
        "Erstellen Sie ein kleines Projekt und prüfen Sie wöchentlich Fortschritte.",
      ],
      career: [
        "Zielberuf",
        "z. B. Frontend-Entwickler",
        "Erfahrung",
        "Studierende / Einstieg",
        "1–3 Jahre",
        "Erfahren",
        "Fähigkeiten oder Lebenslauf",
        "Beschreiben Sie Ihre Fähigkeiten oder Interviewfragen",
        "Karriereplan erstellen",
        "Karrierevorbereitung",
        "Listen Sie die benötigten Fähigkeiten auf.",
        "Erstellen Sie einen kurzen Lebenslauf mit Arbeitsbeispielen.",
        "Üben Sie fünf Vorstellungsgesprächsfragen.",
      ],
      digital: [
        "Art des Onlinedienstes",
        "z. B. Online-Antrag",
        "Dienstkategorie",
        "Behörde",
        "Bildung",
        "Sonstiges",
        "Benötigte Hilfe",
        "Beschreiben Sie den Dienst oder das Formular",
        "Schritte anzeigen",
        "Checkliste für digitale Dienste",
        "Suchen Sie die offizielle Website und prüfen Sie die Adresse.",
        "Prüfen Sie Dokumente, Gebühren und Voraussetzungen.",
        "Füllen Sie das Formular sorgfältig aus; geben Sie niemals OTPs oder Passwörter weiter.",
      ],
    },
  };
  function form(kind) {
    const a = (FORMS[lang] || FORMS.en)[kind];
    return `<div class="panel domain-panel"><form id="helpForm" data-kind="${kind}" novalidate><div id="formError" class="form-error" role="alert" hidden></div><div class="fields"><label class="field">${escape(a[0])}<input name="topic" placeholder="${escape(a[1])}" required maxlength="160" aria-describedby="topicError"><span id="topicError" class="field-error" aria-live="polite"></span></label><label class="field">${escape(a[2])}<select name="level">${a
      .slice(3, 6)
      .map((x) => `<option>${escape(x)}</option>`)
      .join(
        "",
      )}</select></label><label class="field wide">${escape(a[6])}<textarea name="details" placeholder="${escape(a[7])}" required maxlength="3000" aria-describedby="detailsError"></textarea><span id="detailsError" class="field-error" aria-live="polite"></span></label></div><div class="actions"><button class="primary" type="submit">${escape(a[8])}</button><span class="note">${escape(mode === "live" ? LIVE_WORDS[lang].active : t("offline"))}</span></div></form><div id="formResult" class="result" role="status" aria-live="polite" tabindex="-1" hidden></div><div id="resultActions" class="actions" hidden aria-label="${escape(a[9])}"><button type="button" id="copyResult">${escape(u("copy"))}</button><button type="button" id="downloadResult">${escape(u("download"))}</button><button type="button" id="saveResult">${escape(u("save"))}</button><button type="button" id="speakResult">${escape(u("speak"))}</button></div>${savedPlansHtml(kind)}</div>`;
  }
  function guidance(kind, topic, level, details) {
    const a = (FORMS[lang] || FORMS.en)[kind];
    const line =
      lang === "bn"
        ? "বিষয়"
        : lang === "ar"
          ? "الموضوع"
          : lang === "nl"
            ? "Onderwerp"
            : lang === "de"
              ? "Thema"
              : "Topic";
    return `${a[9]} — ${topic}\n${line}: ${level}\n${u("details")}: ${details}\n\n1. ${a[10]}\n2. ${a[11]}\n3. ${a[12]}\n4. ${details}\n\n⚠ ${u("verify")}`;
  }
  function savedPlansHtml(kind) {
    const items = savedPlans
      .filter((p) => p.kind === kind)
      .slice(-5)
      .reverse();
    if (!items.length) return "";
    return `<section class="saved-plans"><h3>${escape(u("saved"))}</h3>${items.map((p) => `<article><button type="button" class="saved-open" data-plan="${p.id}">${escape(p.topic)}</button><span>${new Date(p.created).toLocaleDateString()}</span><button type="button" class="saved-delete" data-plan="${p.id}" aria-label="${escape(u("remove"))}">×</button></article>`).join("")}</section>`;
  }
  const LIVE_WORDS = {
    en: {
      active: "Live AI uses your secure server connection.",
      fallback:
        "Live AI is temporarily unavailable. Your question was kept; switching to Demo AI.",
    },
    bn: {
      active: "Live AI নিরাপদ সার্ভারের মাধ্যমে কাজ করে।",
      fallback:
        "Live AI এখন পাওয়া যাচ্ছে না। আপনার প্রশ্ন রাখা হয়েছে; Demo AI চালু হচ্ছে।",
    },
    ar: {
      active: "يعمل الذكاء المباشر عبر اتصال آمن بالخادم.",
      fallback:
        "الذكاء المباشر غير متاح الآن. احتفظنا بسؤالك وانتقلنا إلى الوضع التجريبي.",
    },
    nl: {
      active: "Live AI gebruikt een beveiligde serververbinding.",
      fallback:
        "Live AI is tijdelijk niet beschikbaar. Uw vraag is bewaard; we schakelen naar Demo AI.",
    },
    de: {
      active: "Live AI verwendet eine sichere Serververbindung.",
      fallback:
        "Live AI ist derzeit nicht verfügbar. Ihre Frage bleibt erhalten; Wechsel zu Demo AI.",
    },
  };
  async function callLive(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 32000);
    try {
      const res = await fetch("./api-chat.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok || typeof data.answer !== "string" || !data.answer.trim())
        throw Error("AI unavailable");
      return data.answer.trim();
    } finally {
      clearTimeout(timeout);
    }
  }
  function assistant() {
    return `<div class="panel"><div class="assistant-tools"><label class="field">${escape(t("selectMode"))}<select id="aiMode"><option value="live" ${mode === "live" ? "selected" : ""}>${escape(t("live"))}</option><option value="demo" ${mode === "demo" ? "selected" : ""}>${escape(t("demo"))}</option></select></label><button type="button" id="clearChat">${escape(u("clear"))}</button></div><p class="note" id="modeNote">${escape(mode === "live" ? LIVE_WORDS[lang].active : t("offline"))}</p><div id="chatlog" class="chat" role="log" aria-live="polite" aria-relevant="additions text">${history.length ? history.map((m) => `<div class="bubble ${m.who === "user" ? "user" : ""}">${m.who === "assistant" ? markdown(m.text) : escape(m.text)}</div>`).join("") : `<div class="bubble">${escape(t("welcomeChat"))}</div>`}</div><form id="chatForm" class="chatrow" novalidate><label class="sr-only" for="chatInput">${escape(t("question"))}</label><input id="chatInput" maxlength="3000" required placeholder="${escape(t("question"))}" aria-describedby="chatError"><button type="button" id="voiceInput" title="${escape(u("voice"))}" aria-label="${escape(u("voice"))}">🎤</button><button type="submit" class="primary">${escape(t("send"))}</button><div id="chatError" class="field-error chat-error" role="alert"></div></form><p class="privacy-note">🔒 ${escape(u("privacy"))}</p></div>`;
  }
  function render() {
    nav();
    let h = "";
    if (page === "home") {
      h =
        head(t("welcome"), t("subtitle")) +
        `<div class="eyebrow" style="margin-bottom:14px">${escape(t("quick"))}</div><div class="grid">${ids
          .slice(1, 7)
          .map((p, i) => card(p, i + 1))
          .join("")}</div>`;
    } else if (["education", "career", "digital"].includes(page)) {
      h =
        head(
          t(page),
          t(
            {
              education: "learnDesc",
              career: "careerDesc",
              digital: "digitalDesc",
            }[page],
          ),
        ) + form(page);
    } else if (page === "chat") {
      h = head(t("chat"), t("chatDesc")) + assistant();
    } else if (page === "access" || page === "settings") {
      h =
        head(t(page), t(page === "access" ? "accessDesc" : "settingsDesc")) +
        `<div class="panel"><div class="fields"><label class="field">${escape(t("language"))}<select id="langSelect">${Object.entries(
          {
            en: "English",
            bn: "বাংলা",
            ar: "العربية",
            nl: "Nederlands",
            de: "Deutsch",
          },
        )
          .map(
            ([k, v]) =>
              `<option value="${k}" ${lang === k ? "selected" : ""}>${v}</option>`,
          )
          .join(
            "",
          )}</select></label><label class="field"><span>${escape(t("textSize"))}</span><input id="largeText" type="checkbox" ${document.body.classList.contains("large-text") ? "checked" : ""}></label><label class="field"><span>${escape(t("contrast"))}</span><input id="highContrast" type="checkbox" ${document.body.classList.contains("high-contrast") ? "checked" : ""}></label></div></div>`;
    } else {
      h =
        head(t("about"), t("aboutDesc")) +
        `<div class="panel about-panel"><h2>AccessBridge AI</h2><p class="muted">${escape(t("mission"))}</p><p class="muted">${escape(t("team"))}</p><h3>${escape(u("impact"))}</h3><p>${escape(u("architecture"))}</p><p class="privacy-note">🔒 ${escape(u("privacy"))}</p><h3>${escape(u("sources"))}</h3><p><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener">W3C WCAG</a> · <a href="https://ctrl-v-hackathon-31831.devpost.com/rules" target="_blank" rel="noopener">Ctrl+V official rules</a></p></div>`;
    }
    $("page").dataset.page = page;
    $("page").innerHTML = h;
    $("page").scrollTop = 0;
    $("page")
      .querySelectorAll("[data-go]")
      .forEach(
        (b) =>
          (b.onclick = () => {
            page = b.dataset.go;
            render();
          }),
      );
    const f = $("helpForm");
    if (f)
      f.onsubmit = async (e) => {
        e.preventDefault();
        const d = new FormData(f);
        const out = $("formResult");
        const topicInput = f.elements.topic;
        const detailsInput = f.elements.details;
        const topic = String(d.get("topic") || "").trim();
        const level = String(d.get("level"));
        const details = String(d.get("details") || "").trim();
        const invalid = [];
        $("topicError").textContent = "";
        $("detailsError").textContent = "";
        [topicInput, detailsInput].forEach((el) => el.removeAttribute("aria-invalid"));
        if (!topic) {
          $("topicError").textContent = u("topicRequired");
          topicInput.setAttribute("aria-invalid", "true");
          invalid.push(topicInput);
        }
        if (!details) {
          $("detailsError").textContent = u("detailsRequired");
          detailsInput.setAttribute("aria-invalid", "true");
          invalid.push(detailsInput);
        }
        $("formError").hidden = !invalid.length;
        $("formError").textContent = invalid.length ? u("required") : "";
        if (invalid.length) {
          invalid[0].focus();
          return;
        }
        out.hidden = false;
        f.setAttribute("aria-busy", "true");
        f.querySelector('[type="submit"]').disabled = true;
        out.textContent =
          mode === "live"
            ? u("working")
            : guidance(f.dataset.kind, topic, level, details);
        let result = out.textContent;
        if (mode === "live") {
          try {
            result = await callLive({
              message: `Create a practical, personalized ${f.dataset.kind} plan. Subject: ${topic}. Level/category: ${level}. User goal: ${details}. Use the user's selected language. Give clear numbered steps, one safety/verification note, and do not invent official links.`,
              language: lang,
              action: "answer",
              history: [],
            });
          } catch {
            result = guidance(f.dataset.kind, topic, level, details);
          }
        }
        out.innerHTML = markdown(result);
        out.dataset.text = result;
        f.removeAttribute("aria-busy");
        f.querySelector('[type="submit"]').disabled = false;
        $("resultActions").hidden = false;
        announce(u("resultReady"));
        out.focus();
        $("copyResult").onclick = () => copyText(result);
        $("downloadResult").onclick = () =>
          downloadText(
            result,
            `AccessBridge-${f.dataset.kind}-${Date.now()}.txt`,
          );
        $("saveResult").onclick = () => {
          savedPlans.push({
            id: `${Date.now()}`,
            kind: f.dataset.kind,
            topic,
            text: result,
            created: new Date().toISOString(),
          });
          persist();
          announce(u("save"));
          render();
        };
        $("speakResult").onclick = () => {
          speechSynthesis.cancel();
          speechSynthesis.speak(new SpeechSynthesisUtterance(result));
        };
      };
    $("page")
      .querySelectorAll(".saved-open")
      .forEach(
        (b) =>
          (b.onclick = () => {
            const p = savedPlans.find((x) => x.id === b.dataset.plan);
            if (p) {
              const out = $("formResult");
              out.hidden = false;
              out.innerHTML = markdown(p.text);
              out.dataset.text = p.text;
              $("resultActions").hidden = false;
              $("copyResult").onclick = () => copyText(p.text);
              $("downloadResult").onclick = () =>
                downloadText(p.text, `AccessBridge-${p.kind}.txt`);
            }
          }),
      );
    $("page")
      .querySelectorAll(".saved-delete")
      .forEach(
        (b) =>
          (b.onclick = () => {
            savedPlans = savedPlans.filter((x) => x.id !== b.dataset.plan);
            persist();
            render();
          }),
      );
    const cf = $("chatForm");
    if (cf) {
      $("aiMode").onchange = (e) => {
        mode = e.target.value;
        persist();
        $("modeNote").textContent =
          mode === "live" ? LIVE_WORDS[lang].active : t("offline");
      };
      cf.onsubmit = async (e) => {
        e.preventDefault();
        if (busy) return;
        const q = $("chatInput").value.trim();
        if (!q) {
          $("chatError").textContent = u("questionRequired");
          $("chatInput").setAttribute("aria-invalid", "true");
          $("chatInput").focus();
          return;
        }
        $("chatError").textContent = "";
        $("chatInput").removeAttribute("aria-invalid");
        const previous = history.slice(-8).map((m) => ({
          role: m.who === "user" ? "user" : "assistant",
          content: m.text,
        }));
        history.push({ who: "user", text: q });
        $("chatInput").value = "";
        busy = true;
        render();
        try {
          let answer;
          if (mode === "live") {
            answer = await callLive({
              message: q,
              language: lang,
              action: "answer",
              history: previous,
            });
          } else {
            answer = t("demoAnswer");
          }
          history.push({ who: "assistant", text: answer });
          persist();
        } catch (err) {
          history.push({ who: "assistant", text: LIVE_WORDS[lang].fallback });
          mode = "demo";
          history.push({ who: "assistant", text: t("demoAnswer") });
          persist();
        } finally {
          busy = false;
          render();
          const c = $("chatlog");
          if (c) c.scrollTop = c.scrollHeight;
        }
      };
      $("clearChat").onclick = () => {
        history.length = 0;
        persist();
        render();
      };
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        $("voiceInput").onclick = () => {
          const recognition = new SpeechRecognition();
          recognition.lang = lang === "bn" ? "bn-BD" : lang;
          recognition.onresult = (event) => {
            $("chatInput").value = event.results[0][0].transcript;
          };
          recognition.start();
        };
      } else {
        $("voiceInput").hidden = true;
      }
    }
    const ls = $("langSelect");
    if (ls) ls.onchange = (e) => setLang(e.target.value);
    const large = $("largeText");
    if (large)
      large.onchange = (e) => {
        document.body.classList.toggle("large-text", e.target.checked);
        persist();
      };
    const hc = $("highContrast");
    if (hc)
      hc.onchange = (e) => {
        document.body.classList.toggle("high-contrast", e.target.checked);
        persist();
      };
  }
  document
    .querySelectorAll("[data-lang]")
    .forEach((b) => (b.onclick = () => setLang(b.dataset.lang)));
  document.querySelector(".languages").addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const buttons = [...document.querySelectorAll("[data-lang]")];
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    e.preventDefault();
    const next = (current + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  });
  $("menu").addEventListener("keydown", (e) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) return;
    const buttons = [...$("menu").querySelectorAll("button")];
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    e.preventDefault();
    let next = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : current + (e.key === "ArrowDown" ? 1 : -1);
    buttons[(next + buttons.length) % buttons.length].focus();
  });
  $("normal").onclick = () => {
    $("app").classList.add("normal");
    measure();
  };
  $("max").onclick = () => {
    $("app").classList.remove("normal");
    measure();
  };
  $("close").onclick = () => {
    $("app").hidden = true;
    $("closed").hidden = false;
  };
  $("reopen").onclick = () => {
    $("app").hidden = false;
    $("closed").hidden = true;
    measure();
  };
  new ResizeObserver(measure).observe($("app"));
  window.addEventListener("resize", measure);
  document.body.classList.toggle("large-text", !!savedState.large);
  document.body.classList.toggle("high-contrast", !!savedState.contrast);
  setLang(lang);
  measure();
})();

