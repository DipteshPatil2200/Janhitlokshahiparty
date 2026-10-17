/**
 * Imports the official leadership directory and About Us image from the supplied
 * Janhit Lokshahi Party booklet. This is intentionally additive and idempotent:
 * it never deletes records, and only sets the About image when an admin has not
 * already selected one.
 */
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "./config/db";
import { Leader, SiteSettings } from "./models";

const leaders = [
  ["ashokrao-ramchandra-aaltor", "श्री. अशोकराव रामचंद्र आलटूर", "Shri Ashokrao Ramchandra Aaltor", "राष्ट्रीय अध्यक्ष", "National President"],
  ["vinodrao-more", "डॉ. विनोदराव मोरे", "Dr. Vinodrao More", "प्रदेशाध्यक्ष", "State President"],
  ["santoshdada-chaudhari", "मा. श्री. संतोषदादा चौधरी", "Shri Santoshdada Chaudhari", "राष्ट्रीय उपाध्यक्ष", "National Vice President"],
  ["ramdas-maharaj-bhatogavkar", "श्री. रामदासमहाराज भाटोगावकर", "Shri Ramdas Maharaj Bhatogavkar", "सल्लागार म. रा.", "Maharashtra Adviser"],
  ["anita-jadhav", "सौ. अनिता जाधव", "Sau. Anita Jadhav", "खजिनदार", "Treasurer"],
  ["ashokrao-dhanavkar", "श्री. अशोकराव धनावकर", "Shri Ashokrao Dhanavkar", "महाराष्ट्र उपाध्यक्ष", "Maharashtra Vice President"],
  ["balasaheb-patole", "श्री. बाळासाहेब पाटोळे", "Shri Balasaheb Patole", "महाराष्ट्र - नेते", "Maharashtra Leader"],
  ["mahesh-thorat", "श्री. महेश थोरात", "Shri Mahesh Thorat", "महाराष्ट्र - संघटक", "Maharashtra Organiser"],
  ["santosh-nandkar", "श्री. संतोष नांदकर", "Shri Santosh Nandkar", "ठाणे जिल्हा - अध्यक्ष", "Thane District President"],
  ["ajit-saroj", "श्री. अजित सरोज", "Shri Ajit Saroj", "सल्लागार", "Adviser"],
  ["rajkumar-chandan-sah", "श्री. राजकुमार चंदन साह", "Shri Rajkumar Chandan Sah", "नवी मुंबई - अध्यक्ष", "Navi Mumbai President"],
  ["kachru-patil-wagh", "कचरू पाटील वाघ", "Kachru Patil Wagh", "अ. नगर द. वि. - अध्यक्ष", "Ahmednagar Division President"],
  ["sachin-aaltor", "श्री. सचिन आलटूर", "Shri Sachin Aaltor", "नवी मुंबई - संघटक", "Navi Mumbai Organiser"],
  ["vilas-kadam", "श्री. विलास कदम", "Shri Vilas Kadam", "अहमदनगर - जिल्हा अध्यक्ष", "Ahmednagar District President"],
  ["ravindra-kamble", "श्री. रविंद्र कांबळे", "Shri Ravindra Kamble", "अहमदनगर - द. वि. युवा अध्यक्ष", "Ahmednagar Division Youth President"],
  ["satyakash-jenvar", "श्री. सत्यप्रकाश जेंवर", "Shri Satyaprakash Jenvar", "महाराष्ट्र सचिव", "Maharashtra Secretary"],
  ["majba-salve", "श्री. मजबा साळवे", "Shri Majba Salve", "प. महाराष्ट्र अध्यक्ष", "West Maharashtra President"],
  ["kailas-jenvar", "श्री. कैलास जेंवर", "Shri Kailas Jenvar", "मुंबई - संघटक", "Mumbai Organiser"],
  ["sandip-pawar", "श्री. संदीप पवार", "Shri Sandip Pawar", "मुंबई - संघटक", "Mumbai Organiser"],
  ["arun-pawar", "श्री. अरुण पवार", "Shri Arun Pawar", "नवी मुंबई - अध्यक्ष", "Navi Mumbai President"],
  ["shivajirao-patil", "श्री. शिवाजीराव पाटील", "Shri Shivajirao Patil", "नवी मुंबई - संघटक", "Navi Mumbai Organiser"],
] as const;

async function importPdfLeadership() {
  if (process.env.IMPORT_PDF_LEADERSHIP !== "true") {
    throw new Error("Set IMPORT_PDF_LEADERSHIP=true before running this safe import.");
  }
  await connectDB();
  for (const [slug, mrName, enName, mrDesignation, enDesignation] of leaders) {
    await Leader.findOneAndUpdate(
      { slug },
      {
        $setOnInsert: {
          slug,
          name: { mr: mrName, en: enName },
          designation: { mr: mrDesignation, en: enDesignation },
          bio: {
            mr: "जनहित लोकशाही पार्टीच्या अधिकृत पुस्तिकेतील नेतृत्व परिचय.",
            en: "Leadership profile from the official Janhit Lokshahi Party booklet.",
          },
          photo: `/leadership/official-book/${slug}.jpg`,
          order: leaders.findIndex((item) => item[0] === slug) + 1,
          isActive: true,
          featured: slug === "ashokrao-ramchandra-aaltor",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  const settings = await SiteSettings.findOne();
  if (settings && !settings.aboutImage) {
    settings.aboutImage = "/about/official-party-programme.jpg";
    await settings.save();
  }
  console.log(`[pdf-leadership] Imported ${leaders.length} official leadership profiles safely.`);
}

importPdfLeadership()
  .then(() => disconnectDB())
  .catch(async (error) => {
    console.error("[pdf-leadership] Import failed:", error);
    try { await mongoose.disconnect(); } catch { /* no connection */ }
    process.exitCode = 1;
  });