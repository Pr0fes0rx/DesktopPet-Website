(() => {
  const config = window.SITE_CONFIG || {};
  const repo = typeof config.githubRepo === "string"
    ? config.githubRepo.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "")
    : "";
  const repoIsConfigured = Boolean(repo && /^[\w.-]+\/[\w.-]+$/.test(repo));
  const repoUrl = repoIsConfigured ? `https://github.com/${repo}` : "https://github.com/";
  const releaseUrl = repoIsConfigured ? `${repoUrl}/releases/latest` : "https://github.com/";
  const releaseTag = String(config.releaseTag || "v1.0.0");
  const fallbackVersion = String(config.version || "1.0.0");
  const installerName = String(config.installerName || "DesktopPet-Setup-1.0.0.exe");
  const fallbackDownloadUrl = repoIsConfigured
    ? `${repoUrl}/releases/download/${encodeURIComponent(releaseTag)}/${encodeURIComponent(installerName)}`
    : "https://github.com/";

  document.querySelectorAll('[data-github="repo"]').forEach(a => a.href = repoUrl);
  document.querySelectorAll('[data-github="release"]').forEach(a => a.href = releaseUrl);
  document.querySelectorAll('[data-github="download"]').forEach(a => a.href = fallbackDownloadUrl);
  const yearEl = document.getElementById("year"); if (yearEl) yearEl.textContent = "2026";
  const versionTag = document.getElementById("releaseVersion");
  if (versionTag) versionTag.textContent = `v${fallbackVersion.replace(/^v/i, "")}`;
  if (!repoIsConfigured) document.getElementById("configNotice").hidden = false;

  // Prefer the newest published Windows installer; keep the configured release as an offline fallback.
  if (repoIsConfigured && window.fetch) {
    fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-cache"
    }).then(response => {
      if (!response.ok) throw new Error("Latest release is not available yet");
      return response.json();
    }).then(release => {
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const asset = assets.find(item => /^DesktopPet-Setup-.*\.exe$/i.test(item.name))
        || assets.find(item => /\.exe$/i.test(item.name));
      if (asset && asset.browser_download_url) {
        document.querySelectorAll('[data-github="download"]').forEach(a => a.href = asset.browser_download_url);
      }
      if (versionTag && release.tag_name) versionTag.textContent = release.tag_name;
    }).catch(() => {
      // The fallback is the configured v1.0.0 download URL above.
    });
  }

  const translations = {
    ar: {
      skipToContent:"تخطَّ إلى المحتوى",brandTag:"رفيق سطح المكتب",navFeatures:"المميزات",navHow:"كيف يعمل",navFaq:"الأسئلة الشائعة",navDownload:"تحميل البرنامج",eyebrow:"رفيق لطيف لنظام Windows",heroTitle:'خلي التركيز عادة،<br><span>والاستراحة جزء منها.</span>',heroDesc:"شخصية تفاعلية تعيش على سطح مكتبك، تمشي وتتفاعل معك، وتساعدك تنظّم يومك بمؤقّت تركيز، مهام، إحصائيات وتذكيرات ذكية.",downloadLatest:"تحميل أحدث إصدار",viewGithub:"ملاحظات الإصدار",noteWindows:"مصمم لسطح مكتب Windows",noteLang:"العربية و English",noteLocal:"إعدادات قابلة للتخصيص",releaseNote:"نزّل ملف التثبيت الرسمي مباشرةً من GitHub." ,releasePlatform:"Windows · x64",focusLabel:"جلسة تركيز",focusRemaining:"متبقي من الجلسة",moodTitle:"مزاج ممتاز",moodSub:"استمر، أنت تتقدم!",waterBubble:"وقت شرب الماء!",heroCaption:"رفيق سطح المكتب، وليس مجرد مؤقّت آخر.",stat1Title:"تركيز واعٍ",stat1Sub:"جلسات وهدف يومي",stat2Title:"مهام واضحة",stat2Sub:"اربط وقتك بما تريد إنجازه",stat3Title:"عادات ألطف",stat3Sub:"تذكيرات ماء وحركة وراحة",stat4Title:"تقدّم ملموس",stat4Sub:"إحصائيات وخبرة ومستويات",featuresKicker:"أكثر من شخصية متحركة",featuresTitle:"رفيق صغير، ومجموعة أدوات ليوم أفضل.",featuresDesc:"اجمع بين الرفقة اللطيفة والتنظيم العملي، من دون أن تغادر سطح المكتب.",f1Title:"شخصية تتفاعل معك",f1Desc:"تتحرك على الشاشة، تتجول وتتفاعل مع الماوس، ويمكنها الجلوس على النوافذ أو البقاء أمامها. خصّص المظهر والسلوك كما تحب.",petCaption:"هنا دائمًا، من دون إزعاج.",f2Title:"مؤقّت التركيز",f2Desc:"ابدأ جلسة، تابع الوقت، واكسب نقاط خبرة تساعدك على بناء عادة الاستمرار.",timerFocus:"وقت التركيز",timerReady:"جاهز لجلسة جديدة",f3Title:"المهام والإنجاز",f3Desc:"أنشئ قائمة مهام، ابدأ جلسة مرتبطة بمهمة، ثم علّمها كمكتملة عندما تنتهي.",todo1:"مراجعة الملاحظات",todo2:"إنهاء المشروع",todo3:"استراحة قصيرة",f4Title:"إحصائيات وتقدّم",f4Desc:"راجع نشاط آخر 7 أيام، أفضل يوم، متوسط التركيز، هدفك اليومي ومستوى الخبرة.",day1:"س",day2:"أ",day3:"ن",day4:"ث",day5:"ر",day6:"خ",day7:"ج",levelLabel:"المستوى",f5Title:"تذكيرات تراعيك",f5Desc:"تذكيرات شرب الماء والحركة وراحة العين، مع كتم التنبيهات تلقائيًا أثناء التركيز أو استخدام تطبيق بملء الشاشة.",reminder1:"اشرب بعض الماء",reminder2:"أرح عينيك قليلًا",f6Title:"تقويم وملخص يومي",f6Desc:"اربط تقويمًا عبر ICS لتذكيرك بالأحداث، وراجع ملخص يومك وإنجازاتك في مكان واحد.",calendarTitle:"مواعيدك القادمة",calendarEvent:"موعد مهم",calendarEvent2:"مراجعة خطة اليوم",f7Title:"ملاحظات سريعة",f7Desc:"دوّن فكرة بسرعة وحدد لها تذكيرًا بعد مدة أو في وقت تختاره، حتى لا تضيع منك التفاصيل الصغيرة.",notePreviewTitle:"فكرة لا تنساها",notePreviewReminder:"تذكير لاحقًا",f8Title:"تذكيرات مواقيت الصلاة",f8Desc:"اضبط أوقات الفجر والظهر والعصر والمغرب والعشاء يدويًا، واختر تشغيل التذكيرات بما يناسبك.",prayerFajr:"الفجر",prayerDhuhr:"الظهر",prayerAsr:"العصر",prayerMaghrib:"المغرب",prayerIsha:"العشاء",f9Title:"متجر لإضفاء طابعك",f9Desc:"استخدم التقدم الذي تجمعه لاقتناء قبعات وإكسسوارات وأطعمة للشخصية، وغيّر شكل رفيقك مع الوقت.",shopPreviewLabel:"اجمع النقاط وخصّص شخصيتك",howKicker:"ابدأ ببساطة",howTitle:"ثلاث خطوات، ويصبح مكتبك ألطف.",howDesc:"لا تحتاج إلى إعداد معقد حتى تبدأ يومًا أكثر تنظيمًا.",step1Title:"حمّل التطبيق",step1Desc:"افتح صفحة الإصدارات على GitHub ونزّل ملف التثبيت المتاح.",step2Title:"خصّص رفيقك",step2Desc:"اختر اللغة والمظهر والاختصارات والتنبيهات التي تناسبك.",step3Title:"ابدأ يومك",step3Desc:"ابدأ مؤقّت التركيز، أنجز مهامك، وتابع تقدمك يومًا بعد يوم.",extrasKicker:"تفاصيل تجعل التجربة لك",extrasTitle:"المظهر والسلوك على طريقتك.",extrasDesc:"واجهة عربية أو إنجليزية، سمة داكنة أو فاتحة، لون تمييز قابل للتغيير، أصوات واختصارات عامة. ويمكنك تصدير بيانات الإحصائيات والمهام والملاحظات إلى CSV أو JSON.",tagArabic:"العربية",tagThemes:"داكن / فاتح",tagExport:"CSV / JSON",tagShortcuts:"اختصارات عامة",settingsTitle:"إعدادات DesktopPet",appearance:"المظهر والصوت",behavior:"السلوك",reminders:"التنبيهات",themeLabel:"لون التمييز",languageLabel:"اللغة",arabicFull:"العربية",soundLabel:"تفعيل الأصوات",startLabel:"التشغيل مع Windows",faqKicker:"قبل التحميل",faqTitle:"أسئلة سريعة.",faq1Q:"على أي نظام يعمل DesktopPet؟",faq1A:"DesktopPet تطبيق سطح مكتب مبني لـ Windows باستخدام .NET 8 وWPF. راجع ملاحظات الإصدار لمعرفة متطلبات النسخة المنشورة.",faq2Q:"أين أجد أحدث نسخة؟",faq2A:"اضغط زر التحميل لفتح صفحة Releases في مستودع GitHub. عند نشر إصدار جديد ستجد ملفات التنزيل وملاحظات التحديث هناك.",faq3Q:"هل يدعم العربية والإنجليزية؟",faq3A:"نعم، يتضمن التطبيق خيارًا للتبديل بين العربية والإنجليزية من الإعدادات.",faq4Q:"هل يجب تفعيل كل التذكيرات؟",faq4A:"لا. يمكنك تعطيل التذكيرات والأصوات والاختصارات وتعديل السلوك من الإعدادات وفق ما يناسبك.",faq5Q:"كيف أثبّت البرنامج؟",faq5A:"نزّل ملف DesktopPet-Setup من صفحة الإصدار الرسمي، ثم افتحه واتبع خطوات التثبيت. عند ظهور نافذة من Windows، تأكد من أن الملف نُزّل من رابط GitHub الرسمي.",faq6Q:"هل يشارك البرنامج بياناتي؟",faq6A:"يخزّن التطبيق إعداداته وبياناته التشغيلية محليًا على جهازك. إذا اخترت ربط تقويم ICS عبر رابط، فسيحتاج التطبيق إلى قراءة ذلك الرابط لتذكيرك بالأحداث.",ctaKicker:"جاهز ليوم ألطف؟",ctaTitle:"خلّي رفيقك يرافقك في كل خطوة.",ctaDesc:"نزّل DesktopPet من صفحة المشروع الرسمية، وابدأ بتنظيم وقتك بطريقتك.",ctaDownload:"اذهب إلى التحميل",ctaSource:"ملاحظات الإصدار",footerCopy:"مصنوع ليجعل وقتك أكثر لطفًا وتنظيمًا.",footerGithub:"GitHub",footerReleases:"الإصدارات",copyright:"جميع الحقوق محفوظة.",configTitle:"إعداد مطلوب للموقع",configText:"تحقّق من إعدادات GitHub في config.js قبل النشر."
    },
    en: {
      skipToContent:"Skip to content",brandTag:"Your desktop companion",navFeatures:"Features",navHow:"How it works",navFaq:"FAQ",navDownload:"Get the app",eyebrow:"A friendly companion for Windows",heroTitle:'Make focus a habit,<br><span>and breaks part of it.</span>',heroDesc:"A playful desktop companion that moves and reacts around your screen, while helping you plan your day with a focus timer, tasks, stats, and thoughtful reminders.",downloadLatest:"Download latest release",viewGithub:"Release notes",noteWindows:"Made for Windows desktop",noteLang:"Arabic & English",noteLocal:"Customizable settings",releaseNote:"Download the official installer directly from GitHub.",releasePlatform:"Windows · x64",focusLabel:"Focus session",focusRemaining:"Session in progress",moodTitle:"Feeling great",moodSub:"Keep going, you're growing!",waterBubble:"Time to drink water!",heroCaption:"A desktop companion, not just another timer.",stat1Title:"Intentional focus",stat1Sub:"Sessions and daily goals",stat2Title:"Clear tasks",stat2Sub:"Connect time to what matters",stat3Title:"Gentler habits",stat3Sub:"Water, movement and rest",stat4Title:"Visible progress",stat4Sub:"Stats, XP and levels",featuresKicker:"More than an animated pet",featuresTitle:"A little companion, a toolkit for a better day.",featuresDesc:"Pair a friendly presence with practical tools, without leaving your desktop.",f1Title:"A companion that reacts",f1Desc:"Wanders across your screen, reacts to the mouse, and can sit on windows or stay on top. Customize its appearance and behavior.",petCaption:"Always nearby, never in the way.",f2Title:"Focus timer",f2Desc:"Start a session, keep track of time, and earn experience points as you build a consistent routine.",timerFocus:"Focus time",timerReady:"Ready for a new session",f3Title:"Tasks and progress",f3Desc:"Create a task list, link a focus session to a task, and mark it complete when you finish.",todo1:"Review notes",todo2:"Finish the project",todo3:"Take a short break",f4Title:"Stats and progress",f4Desc:"Review the last 7 days, your best day, average focus, daily goal, and experience level.",day1:"S",day2:"S",day3:"M",day4:"T",day5:"W",day6:"T",day7:"F",levelLabel:"LEVEL",f5Title:"Reminders that care",f5Desc:"Get water, movement, and eye-rest reminders. Notifications can be muted automatically during focus or while a fullscreen app is active.",reminder1:"Have some water",reminder2:"Give your eyes a rest",f6Title:"Calendar and daily summary",f6Desc:"Connect an ICS calendar for event reminders, then review your daily summary and wins in one place.",calendarTitle:"Coming up",calendarEvent:"Important appointment",calendarEvent2:"Review today's plan",f7Title:"Quick notes",f7Desc:"Capture an idea in seconds and set a reminder for later or for a specific time, so small details do not slip away.",notePreviewTitle:"Remember this idea",notePreviewReminder:"Remind me later",f8Title:"Prayer-time reminders",f8Desc:"Set Fajr, Dhuhr, Asr, Maghrib, and Isha times manually, then enable reminders that fit your routine.",prayerFajr:"Fajr",prayerDhuhr:"Dhuhr",prayerAsr:"Asr",prayerMaghrib:"Maghrib",prayerIsha:"Isha",f9Title:"A little shop for your pet",f9Desc:"Use the progress you earn to get hats, accessories, and food for your companion, and change its look over time.",shopPreviewLabel:"Earn points and personalize your pet",howKicker:"Easy to get started",howTitle:"Three steps to a friendlier desktop.",howDesc:"No complicated setup needed to begin a more organized day.",step1Title:"Download the app",step1Desc:"Open GitHub Releases and download the available installer.",step2Title:"Make it yours",step2Desc:"Choose your language, appearance, shortcuts, and reminders.",step3Title:"Start your day",step3Desc:"Run a focus timer, complete tasks, and track your progress over time.",extrasKicker:"Personalize the experience",extrasTitle:"Your look. Your rules.",extrasDesc:"Arabic or English, dark or light theme, a customizable accent color, sounds, and global shortcuts. Export stats, tasks, and notes to CSV or JSON as well.",tagArabic:"Arabic",tagThemes:"Dark / Light",tagExport:"CSV / JSON",tagShortcuts:"Global shortcuts",settingsTitle:"DesktopPet settings",appearance:"Appearance & sound",behavior:"Behavior",reminders:"Reminders",themeLabel:"Accent color",languageLabel:"Language",arabicFull:"Arabic",soundLabel:"Enable sounds",startLabel:"Start with Windows",faqKicker:"Before you download",faqTitle:"Quick questions.",faq1Q:"Which operating system does DesktopPet support?",faq1A:"DesktopPet is a Windows desktop app built with .NET 8 and WPF. Check the release notes for the requirements of each published version.",faq2Q:"Where can I find the latest version?",faq2A:"Use a download button to open the project's GitHub Releases page. Published releases include download files and update notes.",faq3Q:"Does it support Arabic and English?",faq3A:"Yes. You can switch between Arabic and English from the app settings.",faq4Q:"Do I have to enable every reminder?",faq4A:"No. You can disable reminders, sounds, and shortcuts, and adjust behavior in settings.",faq5Q:"How do I install the app?",faq5A:"Download the DesktopPet-Setup installer from the official release page, open it, and follow the setup steps. If Windows shows a warning, make sure you downloaded the file from the official GitHub link.",faq6Q:"Does the app send my data anywhere?",faq6A:"The app stores its settings and working data locally on your PC. If you choose to connect an ICS calendar by URL, the app needs to read that calendar URL to remind you about events.",ctaKicker:"Ready for a gentler day?",ctaTitle:"Let your companion tag along.",ctaDesc:"Get DesktopPet from the official project page and organize your time your way.",ctaDownload:"Go to downloads",ctaSource:"Release notes",footerCopy:"Made to make your time a little kinder and more organized.",footerGithub:"GitHub",footerReleases:"Releases",copyright:"All rights reserved.",configTitle:"One site setup step left",configText:"Check the GitHub settings in config.js before publishing."
    }
  };
  let lang = "ar";
  try { lang = localStorage.getItem("desktoppet-site-language") === "en" ? "en" : "ar"; } catch (_) {}
  const langToggle = document.getElementById("languageToggle");
  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.body.dir = next === "ar" ? "rtl" : "ltr";
    langToggle.textContent = next === "ar" ? "EN" : "عربي";
    langToggle.setAttribute("aria-label", next === "ar" ? "Switch language to English" : "التبديل إلى العربية");
    document.title = next === "ar" ? "DesktopPet — مساحة صغيرة ليوم أفضل" : "DesktopPet — A little space for a better day";
    document.querySelector('meta[name="description"]').content = next === "ar" ? "DesktopPet — رفيق صغير على سطح مكتب Windows يساعدك على التركيز، تنظيم المهام، متابعة تقدمك، وتذكّر أخذ استراحات." : "DesktopPet is a friendly Windows desktop companion with a focus timer, tasks, stats, and thoughtful reminders.";
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const value = translations[next][el.dataset.i18n];
      if (value !== undefined) el.innerHTML = value;
    });
  }
  langToggle.addEventListener("click", () => {
    const next = lang === "ar" ? "en" : "ar";
    try { localStorage.setItem("desktoppet-site-language", next); } catch (_) {}
    setLanguage(next);
  });
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".main-nav");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
  }));
  setLanguage(lang);
  document.querySelectorAll('a[data-github]').forEach(a => {
    a.addEventListener("click", () => {
      if (!repoIsConfigured) {
        document.getElementById("configNotice").hidden = false;
        document.getElementById("configNotice").scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  });
})();
