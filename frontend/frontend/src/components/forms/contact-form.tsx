"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/lib/api";
import { isValidEmail, isValidMobile } from "@/lib/forms";
import type { Locale } from "@/types";

export function ContactForm({ locale }: { locale: Locale }) {
  const L = locale;
  const [state, setState] = React.useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!payload.name?.trim()) nextErrors.name = L === "mr" ? "नाव आवश्यक आहे." : "Name is required.";
    if (!payload.email?.trim()) {
      nextErrors.email = L === "mr" ? "ईमेल आवश्यक आहे." : "Email is required.";
    } else if (!isValidEmail(payload.email)) {
      nextErrors.email = L === "mr" ? "अवैध ईमेल." : "Invalid email.";
    }
    if (payload.mobile && !isValidMobile(payload.mobile)) {
      nextErrors.mobile = L === "mr" ? "अवैध मोबाईल क्रमांक." : "Invalid mobile.";
    }
    if (!payload.subject?.trim()) nextErrors.subject = L === "mr" ? "विषय आवश्यक आहे." : "Subject is required.";
    if (!payload.message?.trim()) nextErrors.message = L === "mr" ? "संदेश आवश्यक आहे." : "Message is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setErrorMsg(null);
    setState("submitting");
    const result = await submitContactMessage({
      name: payload.name,
      email: payload.email,
      mobile: payload.mobile || "",
      subject: payload.subject,
      message: payload.message,
    });
    if (result.ok) setState("done");
    else {
      setState("idle");
      setErrorMsg(
        result.error ||
          (L === "mr" ? "संदेश पाठवता आला नाही. पुन्हा प्रयत्न करा." : "Unable to send. Please try again.")
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
            ? "आपला संदेश प्राप्त झाला आहे. आम्ही लवकरच उत्तर देऊ."
            : "Your message has been received. We will respond shortly."}
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
        <FormField name="name" label={L === "mr" ? "नाव" : "Name"} required error={errors.name} autoComplete="name" />
        <FormField name="email" label={L === "mr" ? "ईमेल" : "Email"} required type="email" error={errors.email} autoComplete="email" />
        <FormField name="mobile" label={L === "mr" ? "मोबाईल क्रमांक (ऐच्छिक)" : "Mobile (optional)"} type="tel" inputMode="numeric" maxLength={10} error={errors.mobile} autoComplete="tel" />
        <FormField name="subject" label={L === "mr" ? "विषय" : "Subject"} required error={errors.subject} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-medium text-ink">
          {L === "mr" ? "संदेश" : "Message"}
          <span className="text-red-500" aria-hidden="true"> *</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
          placeholder={L === "mr" ? "आपला संदेश येथे लिहा" : "Write your message here"}
        />
        {errors.message ? (
          <p className="text-xs text-red-600" role="alert">{errors.message}</p>
        ) : null}
      </div>
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === "submitting"}>
        {state === "submitting"
          ? L === "mr" ? "पाठवत आहे…" : "Submitting…"
          : L === "mr" ? "संदेश पाठवा" : "Send Message"}
      </Button>
    </form>
  );
}
