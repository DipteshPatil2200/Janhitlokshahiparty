/**
 * Safely registers the supplied party booklet photos and donation QR code.
 *
 * This is deliberately separate from `seed`: it never deletes collections or
 * overwrites existing gallery/donation configuration. Run it once against the
 * intended MongoDB database with IMPORT_OFFICIAL_ASSETS=true.
 */
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "./config/db";
import { DonationSettings, Gallery, GalleryImage } from "./models";

const galleryImages = [
  {
    url: "/gallery/party-book/party-reception.jpg",
    alt: "Party representatives at a felicitation programme",
  },
  {
    url: "/gallery/party-book/party-discussion.jpg",
    alt: "Party representatives in discussion at a public programme",
  },
  {
    url: "/gallery/party-book/citizens-march.jpg",
    alt: "Citizens participating in a party march",
  },
  {
    url: "/gallery/party-book/public-rally.jpg",
    alt: "Citizens gathered at a Janhit Lokshahi Party public rally",
  },
  {
    url: "/gallery/party-book/party-office-meeting.jpg",
    alt: "Party office meeting with representatives",
  },
];

async function importOfficialAssets() {
  if (process.env.IMPORT_OFFICIAL_ASSETS !== "true") {
    throw new Error("Set IMPORT_OFFICIAL_ASSETS=true before running this safe import.");
  }

  await connectDB();

  const gallery = await Gallery.findOneAndUpdate(
    { slug: "party-programmes-and-public-meetings" },
    {
      $setOnInsert: {
        title: { en: "Party Programmes & Public Meetings", mr: "पक्षाचे कार्यक्रम आणि सार्वजनिक सभा" },
        description: {
          en: "Selected photographs from the Janhit Lokshahi Party booklet.",
          mr: "जनहित लोकशाही पार्टीच्या पुस्तिकेतील निवडक छायाचित्रे.",
        },
        category: "meetings",
        coverImage: galleryImages[0].url,
        isPublished: true,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  for (let index = 0; index < galleryImages.length; index += 1) {
    const image = galleryImages[index];
    await GalleryImage.findOneAndUpdate(
      { galleryId: gallery._id, url: image.url },
      { $setOnInsert: { galleryId: gallery._id, ...image, order: index + 1 } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  let donation = await DonationSettings.findOne();
  if (!donation) donation = await DonationSettings.create({});
  const donationUpdate: Record<string, string> = {};
  if (!donation.qrImage) donationUpdate.qrImage = "/donation/janhit-lokshahi-party-idbi-upi-qr.jpeg";
  if (!donation.upiId) donationUpdate.upiId = "janhitlokshahiparty@idbi";
  if (Object.keys(donationUpdate).length) {
    await DonationSettings.findByIdAndUpdate(donation._id, { $set: donationUpdate });
  }

  console.log("[official-assets] Gallery and donation QR import completed safely.");
}

importOfficialAssets()
  .then(async () => {
    await disconnectDB();
  })
  .catch(async (error) => {
    console.error("[official-assets] Import failed:", error);
    try {
      await mongoose.disconnect();
    } catch {
      // Connection may not have been established.
    }
    process.exitCode = 1;
  });
