/**
 * Seed script — populates the database with realistic PLACEHOLDER content so
 * every page and the admin panel work end-to-end. All editorial content is
 * clearly example material; replace with official party content via admin.
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";
import {
  User,
  News,
  Leader,
  Campaign,
  Event,
  Gallery,
  GalleryImage,
  Video,
  DocumentModel,
  OrganizationUnit,
  JoinRequest,
  VolunteerRequest,
  ContactMessage,
  DonationSettings,
  SiteSettings,
  SocialLink,
} from "./models";

const L = (en: string, mr: string) => ({ en, mr });
const para = (text: { en: string | string[]; mr: string | string[] }) => ({
  en: Array.isArray(text.en) ? text.en.join("\n\n") : text.en,
  mr: Array.isArray(text.mr) ? text.mr.join("\n\n") : text.mr,
});

async function seed() {
  // Protect a real (production) database from being wiped and from fabricated
  // demo content. Seeding is a development bootstrap tool; proceeding requires
  // an explicit SEED_CONFIRM=true even then, and demo placeholders are gated
  // behind SEED_DEMO (which env.ts forbids in production).
  if (env.nodeEnv === "production" && process.env.SEED_CONFIRM !== "true") {
    // eslint-disable-next-line no-console
    console.error("[seed] Refusing to run in production unless SEED_CONFIRM=true.");
    process.exit(1);
  }

  await connectDB();

  // ---- wipe (idempotent re-seed) ----
  const collections = [
    User, News, Leader, Campaign, Event, Gallery, GalleryImage, Video,
    DocumentModel, OrganizationUnit, JoinRequest, VolunteerRequest,
    ContactMessage, DonationSettings, SiteSettings, SocialLink,
  ];
  for (const c of collections) {
    await c.deleteMany({});
  }

  // ---- admin user ----
  await User.create({
    name: "Site Administrator",
    email: env.adminEmail,
    passwordHash: await bcrypt.hash(env.adminPassword, 10),
    role: "super_admin",
    isActive: true,
  });

  // ---- site settings ----
  await SiteSettings.create({
    siteName: L("Janhit Lokshahi Party", "जनहित लोकशाही पक्ष"),
    tagline: L(
      "A people-first political party committed to the progress of Maharashtra.", "महाराष्ट्राच्या प्रगतीसाठी जनतेचा पक्ष."),
    announcement: L(
      env.seedDemo
        ? "Visit our donation page to support the cause. All placeholder content to be replaced with official details shortly."
        : "Welcome to the official website of the Janhit Lokshahi Party.",
      env.seedDemo
        ? "कार्याला पाठिंबा देण्यासाठी आमच्या देणगी पानाला भेट द्या."
        : "जनहित लोकशाही पक्षाच्या अधिकृत वेबसाइटवर आपले स्वागत आहे."
    ),
    announcementEnabled: true,
    ...(env.seedDemo
      ? {
          contactPhone: "+91-98765-43210",
          contactEmail: "contact@janhitlokshahi.in",
          address: L(
            "Party Headquarters, Navi Mumbai, Maharashtra",
            "पक्ष मुख्यालय, नवी मुंबई, महाराष्ट्र"
          ),
          facebookUrl: "https://facebook.com/JanhitLokshahiParty",
          twitterUrl: "https://twitter.com/JanhitLokshahi",
          instagramUrl: "https://instagram.com/janhitlokshahi",
          youtubeUrl: "https://youtube.com/@JanhitLokshahiParty",
        }
      : {
          contactPhone: "",
          contactEmail: "",
          address: L("", ""),
          facebookUrl: "",
          twitterUrl: "",
          instagramUrl: "",
          youtubeUrl: "",
        }),
    mapEmbedUrl: "",
    heroTitle: L(
      "Janhit Lokshahi Party, Maharashtra",
      "जनहित लोकशाही पक्ष, महाराष्ट्र"
    ),
    heroSubtitle: L(
      "Standing with the people. Working for a prosperous Maharashtra.",
      "जनतेच्या पाठीशी. समृद्ध महाराष्ट्रासाठी कार्यरत."
    ),
    heroImage: "",
    about: L(
      "Janhit Lokshahi Party is a Maharashtra-based political party devoted to public welfare, transparency and inclusive development.",
      "जनहित लोकशाही पक्ष हा महाराष्ट्रातील जनकल्याण, पारदर्शकता आणि सर्वसमावेशक विकासासाठी कटिबद्ध राजकीय पक्ष आहे."
    ),
    vision: {
      en: [
        "A prosperous and just Maharashtra for every citizen",
        "Transparent, accountable and efficient governance",
        "Equal opportunities in education, health and livelihood",
      ],
      mr: [
        "प्रत्येक नागरिकासाठी समृद्ध आणि न्याय्य महाराष्ट्र",
        "पारदर्शक, जबाबदार आणि सक्षम प्रशासन",
        "शिक्षण, आरोग्य आणि उपजीविकेत समान संधी",
      ],
    },
    mission: {
      en: [
        "Serve the public interest above all",
        "Empower local communities and panchayats",
        "Drive sustainable, farmer- and youth-friendly policies",
      ],
      mr: [
        "सर्वांना प्राधान्य देत जनहितासाठी सेवा",
        "स्थानिक समुदायांना आणि पंचायतींना सक्षम करणे",
        "शेतकरी- आणि तरुण-अनुकूल शाश्वत धोरणे",
      ],
    },
  });

  // ---- social links (only in demo mode — no fabricated live handles) ----
  if (env.seedDemo) {
    await SocialLink.insertMany([
      { platform: "facebook", url: "https://facebook.com/JanhitLokshahiParty", order: 1 },
      { platform: "twitter", url: "https://twitter.com/JanhitLokshahi", order: 2 },
      { platform: "instagram", url: "https://instagram.com/janhitlokshahi", order: 3 },
      { platform: "youtube", url: "https://youtube.com/@JanhitLokshahiParty", order: 4 },
    ]);
  }

  // ---- donation settings ----
  // Demo gets clearly-marked placeholder; production gets empty values so no
  // fabricated bank details are ever shown to donors.
  await DonationSettings.create(
    env.seedDemo
      ? {
          heading: L("Support the Party", "पक्षाला पाठिंबा द्या"),
          intro: L(
            "Your support helps us reach more people across Maharashtra. Donate using UPI or bank transfer.",
            "आपला पाठिंबा महाराष्ट्रातील अधिक लोकांपर्यंत पोहोचण्यास मदत करतो. यूपीआय किंवा बँक ट्रान्सफरद्वारे देणगी द्या."
          ),
          qrImage: "",
          upiId: "janhitlokshahi@upi",
          accountName: "Janhit Lokshahi Party",
          accountNumber: "0000000000000000",
          bankName: "Example Bank Ltd",
          branch: "Navi Mumbai",
          ifsc: "EXMP0000000",
          chequeImage: "",
          instructions: {
            en: [
              "Use UPI ID or scan the QR code to donate instantly.",
              "For bank transfers, use the account details provided.",
              "These are placeholder details — official bank information will be updated by the party.",
            ],
            mr: [
              "तात्काळ देणगीसाठी यूपीआय आयडी वापरा किंवा क्यूआर कोड स्कॅन करा.",
              "बँक ट्रान्सफरसाठी दिलेले खाते तपशील वापरा.",
              "हे उदाहरण तपशील आहेत — अधिकृत बँक माहिती लवकरच अपडेट केली जाईल.",
            ],
          },
        }
      : {
          heading: L("Support the Party", "पक्षाला पाठिंबा द्या"),
          intro: L(
            "Official donation details will be shared here by the party.",
            "अधिकृत देणगी तपशील पक्षाकडून येथे दिले जातील."
          ),
          qrImage: "",
          upiId: "",
          accountName: "",
          accountNumber: "",
          bankName: "",
          branch: "",
          ifsc: "",
          chequeImage: "",
          instructions: { en: [], mr: [] },
        }
  );

  // ---- organization units (only in demo mode — no fabricated live structure) ----
  if (env.seedDemo) {
  const state = await OrganizationUnit.create({
    name: L("Maharashtra State Unit", "महाराष्ट्र राज्य समिती"),
    slug: "maharashtra-state",
    type: "state",
    inChargeName: "",
    order: 1,
  });
  const mumbaiRegion = await OrganizationUnit.create({
    name: L("Mumbai Region", "मुंबई विभाग"),
    slug: "mumbai-region",
    type: "division",
    parentId: state._id,
    inChargeName: "",
    order: 1,
  });
  await OrganizationUnit.create({
    name: L("Mumbai City District", "मुंबई शहर जिल्हा"),
    slug: "mumbai-city",
    type: "district",
    parentId: mumbaiRegion._id,
    inChargeName: "",
    order: 1,
  });
  await OrganizationUnit.create({
    name: L("Mumbai Suburban District", "मुंबई उपनगर जिल्हा"),
    slug: "mumbai-suburban",
    type: "district",
    parentId: mumbaiRegion._id,
    inChargeName: "",
    order: 2,
  });
  const puneRegion = await OrganizationUnit.create({
    name: L("Pune Region", "पुणे विभाग"),
    slug: "pune-region",
    type: "division",
    parentId: state._id,
    inChargeName: "",
    order: 2,
  });
  await OrganizationUnit.create({
    name: L("Pune District", "पुणे जिल्हा"),
    slug: "pune-district",
    type: "district",
    parentId: puneRegion._id,
    inChargeName: "",
    order: 1,
  });
  await OrganizationUnit.create({
    name: L("Nashik Division", "नाशिक विभाग"),
    slug: "nashik-division",
    type: "division",
    parentId: state._id,
    inChargeName: "",
    order: 3,
  });
  await OrganizationUnit.create({
    name: L("Sample Assembly Constituency", "नमुना विधानसभा मतदारसंघ"),
    slug: "sample-assembly-constituency",
    type: "assembly",
    parentId: null,
    inChargeName: "",
    order: 1,
  });
  } // end env.seedDemo organization units

  // ---- editorial / demo content (only in demo mode) ----
  // Real site content must be entered by admins. We never fabricate political
  // figures, news, videos, documents, or bank details in production.
  if (env.seedDemo) {
  // ---- leaders (PLACEHOLDER — no invented public figures) ----
  const leaders = [
    {
      name: L("Leader Name Holder", "नेते नाव धारक"),
      slug: "leader-name-holder",
      designation: L("State President", "राज्य अध्यक्ष"),
      bio: L(
        "Example biography placeholder. Official leader details will be provided by the party.",
        "उदाहरण चरित्र-माहिती. अधिकृत नेत्यांची माहिती पक्षाकडून दिली जाईल."
      ),
      order: 1,
      featured: true,
    },
    {
      name: L("Second Leader Holder", "दुसरे नेते धारक"),
      slug: "second-leader-holder",
      designation: L("General Secretary", "सरचिटणीस"),
      bio: L(
        "Example biography placeholder. Official leader details will be provided by the party.",
        "उदाहरण चरित्र-माहिती. अधिकृत नेत्यांची माहिती पक्षाकडून दिली जाईल."
      ),
      order: 2,
      featured: true,
    },
    {
      name: L("Third Leader Holder", "तिसरे नेते धारक"),
      slug: "third-leader-holder",
      designation: L("State Spokesperson", "प्रवक्ते"),
      bio: L(
        "Example biography placeholder.",
        "उदाहरण चरित्र-माहिती."
      ),
      order: 3,
      featured: true,
    },
  ];
  await Leader.insertMany(leaders);

  // ---- news (placeholder articles) ----
  const now = Date.now();
  const news = [
    {
      title: L("Party launches statewide membership drive", "पक्षाची राज्यव्यापी सदस्यता मोहीम"),
      slug: "membership-drive-launched",
      excerpt: L(
        "A statewide drive to connect with citizens and strengthen the party base.",
        "नागरिकांशी संपर्क आणि पक्ष बळकट करण्यासाठी राज्यव्यापी मोहीम."
      ),
      content: para({
        en: ["The party has launched a statewide membership drive across Maharashtra.", "Volunteers are reaching out to citizens in every district."],
        mr: ["पक्षाने महाराष्ट्रभर सदस्यता मोहीम सुरू केली आहे.", "स्वयंसेवक प्रत्येक जिल्ह्यात नागरिकांपर्यंत पोहोचत आहेत."],
      }),
      category: "Announcement",
      publishedAt: new Date(now - 1 * 86400000),
      isPublished: true,
      featured: true,
    },
    {
      title: L("Public meeting held in Pune", "पुण्यात सार्वजनिक सभा संपन्न"),
      slug: "public-meeting-pune",
      excerpt: L("A large public meeting discussed local development priorities.", "स्थानिक विकास प्राधान्यांवर मोठी सार्वजनिक सभा."),
      content: para({
        en: ["A public meeting was held in Pune to discuss development priorities.", "Local leaders addressed citizens on key issues."],
        mr: ["विकास प्राधान्यांवर चर्चा करण्यासाठी पुण्यात सार्वजनिक सभा झाली.", "स्थानिक नेत्यांनी नागरिकांशी संवाद साधला."],
      }),
      category: "Event",
      publishedAt: new Date(now - 4 * 86400000),
      isPublished: true,
      featured: false,
    },
    {
      title: L("Youth convention announced", "तरुणाई परिषदेची घोषणा"),
      slug: "youth-convention-announced",
      excerpt: L("A youth convention will bring young leaders together.", "तरुण नेत्यांना एकत्र आणणारी तरुणाई परिषद."),
      content: para({
        en: ["A youth convention is being organized to engage young citizens.", "Details will be announced soon."],
        mr: ["तरुण नागरिकांना सामील करण्यासाठी परिषद आयोजित केली जात आहे.", "तपशील लवकरच जाहीर केला जाईल."],
      }),
      category: "Youth",
      publishedAt: new Date(now - 9 * 86400000),
      isPublished: true,
      featured: true,
    },
    {
      title: L("Party releases statement on farmer support", "शेतकरी समर्थनावर पक्षाचे निवेदन"),
      slug: "farmer-support-statement",
      excerpt: L("Party reiterates its commitment to farmers' welfare.", "शेतकरी कल्याणासाठी पक्षाची बांधिलकी."),
      content: para({
        en: ["The party reiterates its commitment to the welfare of farmers."],
        mr: ["पक्ष शेतकरी कल्याणासाठी आपली बांधिलकी पुन्हा व्यक्त करतो."],
      }),
      category: "Policy",
      publishedAt: new Date(now - 15 * 86400000),
      isPublished: true,
      featured: false,
    },
    {
      title: L("State executive committee meeting updates", "राज्य कार्यकारिणी बैठकीची माहिती"),
      slug: "executive-committee-meeting",
      excerpt: L("Key decisions taken in the executive committee meeting.", "कार्यकारिणी बैठकीत घेतलेले महत्त्वाचे निर्णय."),
      content: para({
        en: ["The executive committee met to review party activities.", "Key decisions were taken for the coming months."],
        mr: ["कार्यकारिणीने पक्षाच्या कार्याचा आढावा घेतला.", "येत्या महिन्यांसाठी महत्त्वाचे निर्णय घेतले."],
      }),
      category: "Organizational",
      publishedAt: new Date(now - 20 * 86400000),
      isPublished: true,
      featured: false,
    },
    {
      title: L("Volunteer registration now open", "स्वयंसेवक नोंदणी सुरू"),
      slug: "volunteer-registration-open",
      excerpt: L("Join as a volunteer and support party activities.", "स्वयंसेवक म्हणून सामील व्हा आणि पक्ष कार्याला सहाय्य करा."),
      content: para({
        en: ["Volunteer registration is now open on the website.", "Fill the form and join us."],
        mr: ["वेबसाइटवर स्वयंसेवक नोंदणी सुरू आहे.", "फॉर्म भरा आणि सामील व्हा."],
      }),
      category: "Announcement",
      publishedAt: new Date(now - 26 * 86400000),
      isPublished: true,
      featured: false,
    },
  ];
  await News.insertMany(news);

  // ---- campaigns ----
  const campaigns = [
    {
      title: L("Jal Swaraj — Water for Every Village", "जल स्वराज्य — प्रत्येक गावाला पाणी"),
      slug: "jal-swaraj-water",
      description: L(
        "Ensuring safe drinking water and sustainable water management in villages.",
        "गावांमध्ये शुद्ध पिण्याचे पाणी आणि शाश्वत जलव्यवस्थापन सुनिश्चित करणे."
      ),
      objectives: [
        L("Drinking water in every household", "प्रत्येक घरी पिण्याचे पाणी"),
        L("Rainwater harvesting awareness", "पावसाचे पाणी साठवणुकीची जनजागृती"),
      ],
      status: "active",
      startDate: new Date(),
      featured: true,
    },
    {
      title: L("Yuva Connect Initiative", "युवा कनेक्ट उपक्रम"),
      slug: "yuva-connect",
      description: L(
        "Engaging youth in political participation and skill development.",
        "राजकीय सहभाग आणि कौशल्य विकासासाठी तरुणांचा सहभाग."
      ),
      objectives: [
        L("Skill development workshops", "कौशल्य विकास कार्यशाळा"),
        L("Leadership training for youth", "तरुणांसाठी नेतृत्व प्रशिक्षण"),
      ],
      status: "active",
      startDate: new Date(),
      featured: true,
    },
    {
      title: L("Annapurna — Food Security Drive", "अन्नपूर्णा — अन्न सुरक्षा मोहीम"),
      slug: "annapurna-food-security",
      description: L(
        "Distributing food aid and promoting food security in vulnerable communities.",
        "असुरक्षित समुदायांमध्ये अन्न सहाय्य आणि अन्न सुरक्षा प्रोत्साहन."
      ),
      objectives: [
        L("Food distribution drives", "अन्न वाटप मोहिमा"),
        L("Nutrition awareness", "पोषण जनजागृती"),
      ],
      status: "completed",
      startDate: new Date(now - 40 * 86400000),
      featured: false,
    },
  ];
  await Campaign.insertMany(campaigns);

  // ---- events ----
  const events = [
    {
      title: L("Maharashtra Jan Arogya Rally", "महाराष्ट्र जन आरोग्य रॅली"),
      slug: "jan-arogya-rally",
      description: L("A public rally focused on health awareness across the state.", "राज्यभर आरोग्य जनजागृतीवर केंद्रित सार्वजनिक रॅली."),
      date: new Date(now + 10 * 86400000),
      location: L("Navi Mumbai", "नवी मुंबई"),
      status: "upcoming",
      featured: true,
    },
    {
      title: L("Youth Leadership Summit", "तरुण नेतृत्व शिखर परिषद"),
      slug: "youth-leadership-summit",
      description: L("A summit to train and connect young leaders.", "तरुण नेत्यांना प्रशिक्षण देण्यासाठी शिखर परिषद."),
      date: new Date(now + 20 * 86400000),
      location: L("Pune", "पुणे"),
      status: "upcoming",
      featured: true,
    },
    {
      title: L("Farmers' Conclave", "शेतकरी परिषद"),
      slug: "farmers-conclave",
      description: L("Conclave on farmer welfare and sustainable agriculture.", "शेतकरी कल्याण आणि शाश्वत शेतीवर परिषद."),
      date: new Date(now - 6 * 86400000),
      location: L("Nashik", "नाशिक"),
      status: "past",
      featured: false,
    },
    {
      title: L("Ward Committee Meeting", "वॉर्ड समिती बैठक"),
      slug: "ward-committee-meeting",
      description: L("Municipal ward-level development meeting.", "नगरपालिका वॉर्ड स्तरावरील विकास बैठक."),
      date: new Date(now - 12 * 86400000),
      location: L("Mumbai", "मुंबई"),
      status: "past",
      featured: false,
    },
  ];
  await Event.insertMany(events);

  // ---- galleries + images (no external images — empty image arrays, cover empty) ----
  const g1 = await Gallery.create({
    title: L("Rally Highlights", "रॅलीचे हायलाइट्स"),
    slug: "rally-highlights",
    description: L("Photo highlights from public rallies.", "सार्वजनिक रॅलीतील फोटो हायलाइट्स."),
    category: "Rallies",
    isPublished: true,
  });
  await GalleryImage.create({ galleryId: g1._id, url: "", order: 1 });
  const g2 = await Gallery.create({
    title: L("Events & Meetings", "कार्यक्रम आणि बैठका"),
    slug: "events-meetings",
    description: L("Photos from party events and meetings.", "पक्षाच्या कार्यक्रम आणि बैठकांचे फोटो."),
    category: "Meetings",
    isPublished: true,
  });
  await GalleryImage.create({ galleryId: g2._id, url: "", order: 1 });

  // ---- videos (placeholder — official channel links to be added) ----
  await Video.insertMany([
    {
      title: L("Party Introduction", "पक्षाची ओळख"),
      youtubeId: "dQw4w9WgXcQ",
      category: "Introduction",
      description: L("Example video placeholder.", "उदाहरण व्हिडिओ."),
      isPublished: true,
      featured: true,
    },
    {
      title: L("Leadership Message", "नेत्यांचा संदेश"),
      youtubeId: "dQw4w9WgXcQ",
      category: "Message",
      description: L("Example video placeholder.", "उदाहरण व्हिडिओ."),
      isPublished: true,
      featured: true,
    },
  ]);

  // ---- documents (placeholders pointing to be-added files) ----
  await DocumentModel.insertMany([
    {
      title: L("Press Release — Initiative Launch", "प्रसिद्धीपत्रक — उपक्रमाची सुरुवात"),
      slug: "press-release-initiative",
      description: L("Example press release.", "उदाहरण प्रसिद्धीपत्रक."),
      category: "Press Release",
      fileUrl: "",
      isPublished: true,
    },
    {
      title: L("Party Constitution", "पक्षाची घटना"),
      slug: "party-constitution",
      description: L("Constitution of the party.", "पक्षाची घटना."),
      category: "Constitution",
      fileUrl: "",
      isPublished: true,
    },
  ]);

  // ---- sample form submissions (so admin tables aren't empty) ----
  await JoinRequest.create({
    fullName: "Sample Member Placeholder",
    mobile: "9876500000",
    email: "sample@example.in",
    district: "Pune",
    taluka: "Haveli",
    city: "Pune",
    message: "Placeholder submission.",
    status: "new",
  });
  await VolunteerRequest.create({
    fullName: "Sample Volunteer Placeholder",
    mobile: "9876511111",
    email: "volunteer@example.in",
    district: "Mumbai",
    categories: ["digital"],
    availability: "Weekends",
    message: "Placeholder submission.",
    status: "new",
  });
  await ContactMessage.create({
    fullName: "Sample Contact Placeholder",
    email: "message@example.in",
    mobile: "9876522222",
    subject: "Inquiry",
    message: "Placeholder message.",
    status: "new",
  });
  } // end env.seedDemo editorial content

  const summary = { admin: env.adminEmail, password: env.adminPassword };
  // eslint-disable-next-line no-console
  console.log("[seed] Completed. Admin login:", JSON.stringify(summary, null, 2));
  await disconnectDB();
  process.exit(0);
}

seed().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error("[seed] Failed", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});