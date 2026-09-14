// app/[lang]/donation/page.tsx
import type { Metadata } from "next";
import {
  HandCoins,
  QrCode,
  Landmark,
  FileText,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import { getBankDetails } from "@/data/donation";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/page-header";
import { DonationQR } from "@/components/donation/donation-qr";
import {
  BankDetailsBlock,
  TrustNote,
} from "@/components/donation/bank-details";
import { ChequeImage } from "@/components/donation/cheque-image";
import { ChequeDetails } from "@/components/donation/cheque-details";
import type { Locale } from "@/types";

interface Props {
  params: { lang: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const isMr = locale === "mr";
  return buildMetadata({
    title: isMr ? "देणगी" : "Donation",
    description: isMr
      ? "जनहित लोकशाही पक्षाला देणगी द्या."
      : "Donate to Janhit Lokshahi Party.",
    path: "/donation",
    locale,
  });
}

export default async function DonationPage({ params }: Props) {
  const locale = (params.lang === "mr" ? "mr" : "en") as Locale;
  const bankDetails = await getBankDetails();
  const L = locale;
  // The supplied official QR stays available even before the backend settings
  // record is imported. An admin-managed QR always takes precedence.
  const qrImage =
    bankDetails.qrImage || "/donation/janhit-lokshahi-party-idbi-upi-qr.jpeg";
  const upiId = bankDetails.upiId || "janhitlokshahiparty@idbi";
  // The supplied cancelled cheque is the public default. Admins can still
  // replace it later from Donation Settings without a code deployment.
  const chequeImage =
    bankDetails.chequeImage || "/donation/cancelled-cheque.jpeg";

  return (
    <>
      <PageHeader
        eyebrow={L === "mr" ? "देणगी" : "Donation"}
        title={
          L === "mr"
            ? "जनहित लोकशाही पक्षाला समर्थन द्या"
            : "Support Janhit Lokshahi Party"
        }
        description={
          L === "mr"
            ? "आमच्या ध्येयासाठी योगदान द्या आणि आमच्या लोकशाही उपक्रमांना समर्थन द्या."
            : "Contribute to our mission and support our democratic initiatives."
        }
      />

      <div className="section container-page">
        {/* Two-Column Donation Methods */}
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* QR / UPI Donation */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-card md:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
              <QrCode className="h-5 w-5 text-orange-600" aria-hidden="true" />
              {L === "mr" ? "QR / UPI देणगी" : "QR / UPI Donation"}
            </h2>
            <div className="mt-6">
              <DonationQR
                qrImage={qrImage}
                upiId={upiId}
                locale={locale}
              />
            </div>
            <p className="mt-4 text-center text-sm text-ink-muted">
              {L === "mr"
                ? "कोणत्याही समर्थित UPI अनुप्रयोगाचा वापर करून QR कोड स्कॅन करा."
                : "Scan the QR code using any supported UPI application."}
            </p>
          </section>

          {/* Direct Bank Transfer */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
              <Landmark
                className="h-5 w-5 text-orange-600"
                aria-hidden="true"
              />
              {L === "mr" ? "थेट बँक हस्तांतरण" : "Direct Bank Transfer"}
            </h2>
            <BankDetailsBlock bank={bankDetails} locale={locale} />
            <TrustNote locale={locale} />
          </section>
        </div>

        {/* Donation by cheque */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <FileText className="h-5 w-5 text-orange-600" aria-hidden="true" />
            {L === "mr" ? "धनादेशाद्वारे देणगी" : "Donation by Cheque"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            {L === "mr"
              ? "धनादेश पक्षाच्या नावे काढून खालील पत्त्यावर पाठवा. धनादेशाची प्रतिमा मोठी करून पाहण्यासाठी त्यावर क्लिक करा."
              : "Make the cheque payable to the party and send it to the address below. Click the image to zoom."}
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <ChequeDetails locale={locale} />
            <ChequeImage src={chequeImage} locale={locale} />
          </div>
        </section>

        {/* Important Information */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <ListChecks
              className="h-5 w-5 text-orange-600"
              aria-hidden="true"
            />
            {L === "mr" ? "महत्वाची माहिती" : "Important Information"}
          </h2>
          <div className="mt-4 max-w-3xl space-y-3">
            {[
              L === "mr"
                ? "कृपया या पृष्ठावर दर्शविलेल्या अधिकृत देणगी पद्धतींचाच वापर करा."
                : "Please use only the official donation methods displayed on this page.",
              L === "mr"
                ? "तुमच्या व्यवहार/संदर्भ तपशील तुमच्या नोंदींसाठी जतन करा."
                : "Keep your transaction/reference details for your records.",
              L === "mr"
                ? "जेथे लागू असेल तेथे अधिकृत पावती प्रदान केली जाईल."
                : "An official receipt will be provided where applicable.",
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-border bg-paper p-4"
              >
                <span className="text-orange-600">•</span>
                <span className="text-sm leading-relaxed text-ink-soft">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-border bg-paper p-6">
          <HandCoins
            className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
            aria-hidden="true"
          />
          <p className="text-sm leading-relaxed text-ink-muted">
            {L === "mr"
              ? "कृपया शोधणीय माहिती दिली असल्यास त्यांचा वापर करा; अन्यथा अधिकृत माहितीसाठी आमच्याशी संपर्क साधा. कोणतीही अनधिकृत देणगी वसुली टाळा."
              : "Please use the details provided above, or contact us for official information. Avoid any unauthorised collection."}
          </p>
        </div>
      </div>
    </>
  );
}
