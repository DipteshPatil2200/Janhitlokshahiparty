"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { volunteerCategories } from "@/data/donation";
import { getLocalizedText } from "@/lib/i18n";
import { submitVolunteerRequest } from "@/lib/api";
import { isValidMobile, isValidEmail } from "@/lib/forms";
import { cn } from "@/lib/utils";
import type { Locale, VolunteerCategoryId } from "@/types";

export function VolunteerForm({ locale }: { locale: Locale }) {
  const L = locale;
  const [state, setState] = React.useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<VolunteerCategoryId[]>([]);

  function toggleCategory(id: VolunteerCategoryId) {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!payload.fullName?.trim()) nextErrors.fullName = L === "mr" ? "नाव आवश्यक आहे." : "Name is required.";
    if (!payload.mobile?.trim()) nextErrors.mobile = L === "mr" ? "मोबाईल क्रमांक आवश्यक आहे." : "Mobile is required.";
    else if (!isValidMobile(payload.mobile)) nextErrors.mobile = L === "mr" ? "अवैध मोबाईल क्रमांक." : "Invalid mobile.";
    if (payload.email && !isValidEmail(payload.email)) nextErrors.email = L === "mr" ? "अवैध ईमेल." : "Invalid email.";
    if (!categories.length) nextErrors.categories = L === "mr" ? "किमान एक श्रेणी निवडा." : "Select at least one category.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setErrorMsg(null);
    setState("submitting");
    const result = await submitVolunteerRequest({
      fullName: payload.fullName,
      mobile: payload.mobile,
      email: payload.email || "",
      city: payload.city || "",
      message: payload.message || "",
      categories,
    });
    if (result.ok) setState("done");
    else {
      setState("idle");
      setErrorMsg(
        result.error ||
          (L === "mr" ? "नोंदणी पाठवता आली नाही. पुन्हा प्रयत्न करा." : "Unable to register. Please try again.")
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
            ? "आपली नोंदणी झाली आहे. आमची टीम लवकरच संपर्क साधेल."
            : "Your registration has been received. Our team will contact you soon."}
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
      <fieldset>
        <legend className="block text-sm font-medium text-ink">
          {L === "mr" ? "स्वयंसेवा श्रेणी" : "Volunteer Category"}
          <span className="text-red-500" aria-hidden="true"> *</span>
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {volunteerCategories.map((c) => {
            const active = categories.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border p-4 text-left transition-colors",
                  active
                    ? "border-brand-700 bg-brand-50"
                    : "border-border bg-white hover:bg-paper"
                )}
              >
                <span className="block font-semibold text-ink">
                  {getLocalizedText(c.name, locale)}
                </span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {getLocalizedText(c.description, locale)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.categories ? (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {errors.categories}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField name="fullName" label={L === "mr" ? "पूर्ण नाव" : "Full Name"} required error={errors.fullName} autoComplete="name" />
        <FormField name="mobile" label={L === "mr" ? "मोबाईल क्रमांक" : "Mobile Number"} required type="tel" inputMode="numeric" maxLength={10} error={errors.mobile} autoComplete="tel" />
        <FormField name="email" label={L === "mr" ? "ईमेल (ऐच्छिक)" : "Email (optional)"} type="email" error={errors.email} autoComplete="email" />
        <FormField name="city" label={L === "mr" ? "शहर / गाव" : "City / Village"} />
      </div>
      <FormField name="message" label={L === "mr" ? "संदेश (ऐच्छिक)" : "Message (optional)"} />

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === "submitting"}>
        {state === "submitting"
          ? L === "mr" ? "पाठवत आहे…" : "Submitting…"
          : L === "mr" ? "नोंदणी करा" : "Register"}
      </Button>
    </form>
  );
}
