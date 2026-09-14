import type { BankDetails, VolunteerCategory } from "@/types";
import { getDonationSettings } from "@/lib/api";

export async function getBankDetails(): Promise<BankDetails> {
  try {
    return await getDonationSettings();
  } catch {
    return {
      accountName: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      ifsc: "",
      upiId: "",
      qrImage: "",
      chequeImage: "",
      instructions: [],
    };
  }
}

export const volunteerCategories: VolunteerCategory[] = [
  {
    id: "digital",
    name: { en: "Digital Volunteer", mr: "डिजिटल स्वयंसेवक" },
    description: {
      en: "Support our online presence and digital outreach.",
      mr: "आमच्या ऑनलाइन उपस्थितीला व डिजिटल प्रचाराला सहाय्य करा.",
    },
  },
  {
    id: "social-media",
    name: { en: "Social Media Volunteer", mr: "सोशल मीडिया स्वयंसेवक" },
    description: {
      en: "Help create and share content on social platforms.",
      mr: "सोशल मीडियावर सामग्री तयार करण्यास व शेअर करण्यास मदत करा.",
    },
  },
  {
    id: "ground",
    name: { en: "Ground Volunteer", mr: "जमिनीवरील स्वयंसेवक" },
    description: {
      en: "Participate in on-ground outreach and campaigns.",
      mr: "जमिनीवरील प्रचार व मोहिमांमध्ये सहभागी व्हा.",
    },
  },
  {
    id: "event",
    name: { en: "Event Volunteer", mr: "कार्यक्रम स्वयंसेवक" },
    description: {
      en: "Assist with organizing party events and meetings.",
      mr: "पक्षाचे कार्यक्रम व सभा आयोजित करण्यास मदत करा.",
    },
  },
  {
    id: "youth",
    name: { en: "Youth Volunteer", mr: "युवा स्वयंसेवक" },
    description: {
      en: "Engage and mobilize young citizens.",
      mr: "तरुण नागरिकांना सहभागी करा व प्रेरित करा.",
    },
  },
];