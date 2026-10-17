"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select-field";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { submitJoinRequest } from "@/lib/api";
import { isValidMobile, isValidEmail } from "@/lib/forms";
import type { Locale } from "@/types";

export function JoinUsForm({ locale }: { locale: Locale }) {
  const L = locale;
  const [state, setState] = React.useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!payload.fullName?.trim()) {
      nextErrors.fullName = L === "mr" ? "नाव आवश्यक आहे." : "Full name is required.";
    }
    if (!payload.mobile?.trim()) {
      nextErrors.mobile = L === "mr" ? "मोबाईल क्रमांक आवश्यक आहे." : "Mobile number is required.";
    } else if (!isValidMobile(payload.mobile)) {
      nextErrors.mobile = L === "mr" ? "अवैध मोबाईल क्रमांक." : "Invalid mobile number.";
    }
    if (payload.email && !isValidEmail(payload.email)) {
      nextErrors.email = L === "mr" ? "अवैध ईमेल." : "Invalid email.";
    }
    if (!payload.district?.trim()) {
      nextErrors.district = L === "mr" ? "जिल्हा आवश्यक आहे." : "District is required.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setErrorMsg(null);
    setState("submitting");
    const result = await submitJoinRequest({
      fullName: payload.fullName,
      mobile: payload.mobile,
      email: payload.email || "",
      district: payload.district,
      taluka: payload.taluka || "",
      city: payload.city || "",
    });
    if (result.ok) {
      setState("done");
    } else {
      setState("idle");
      setErrorMsg(
        result.error ||
          (L === "mr" ? "अर्ज पाठवता आला नाही. पुन्हा प्रयत्न करा." : "Unable to submit. Please try again.")
      );
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-bold text-ink">
          {L === "mr" ? "धन्यवाद!" : "Thank you!"}
        </h2>
        <p className="mt-2 text-ink-soft">
          {L === "mr"
            ? "आपला अर्ज प्राप्त झाला आहे. आमची टीम लवकरच आपल्याशी संपर्क साधेल."
            : "Your application has been received. Our team will contact you shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMsg ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {errorMsg}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          name="fullName"
          label={L === "mr" ? "पूर्ण नाव" : "Full Name"}
          required
          error={errors.fullName}
          autoComplete="name"
        />
        <FormField
          name="mobile"
          label={L === "mr" ? "मोबाईल क्रमांक" : "Mobile Number"}
          required
          type="tel"
          inputMode="numeric"
          maxLength={10}
          error={errors.mobile}
          autoComplete="tel"
        />
        <FormField
          name="email"
          label={L === "mr" ? "ईमेल (ऐच्छिक)" : "Email (optional)"}
          type="email"
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField name="district" label={L === "mr" ? "जिल्हा" : "District"} required error={errors.district}>
          <option value="">{L === "mr" ? "निवडा" : "Select"}</option>
          {[
            "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
            "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
            "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban",
            "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar",
            "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
            "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal",
          ].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </SelectField>
        <FormField name="taluka" label={L === "mr" ? "तालुका" : "Taluka"} />
        <FormField name="city" label={L === "mr" ? "शहर / गाव" : "City / Village"} />
      </div>

      <p className="flex items-start gap-2 rounded-md bg-paper p-3 text-xs text-ink-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
        {L === "mr"
          ? "आपली माहिती गोपनीय राहील व केवळ पक्षाच्या अधिकृत कार्यासाठी वापरली जाईल."
          : "Your information will remain confidential and be used only for official party work."}
      </p>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === "submitting"}>
        {state === "submitting"
          ? L === "mr" ? "पाठवत आहे…" : "Submitting…"
          : L === "mr" ? "अर्ज सादर करा" : "Submit Application"}
      </Button>
    </form>
  );
}
