"use client";

import { FormEvent, useState } from "react";

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to submit the form.");
      setSent(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit the form.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="form-success">
        <span>✓</span><h3>Thanks — your enquiry has been received.</h3>
        <p>The Solar People will be in touch to discuss your property and energy needs.</p>
        <button onClick={() => setSent(false)}>Return to form</button>
      </div>
    );
  }

  return (
    <form className={`quote-form ${compact ? "compact" : ""}`} onSubmit={submit}>
      <div className="field-grid">
        <label>First name<input required name="firstName" placeholder="First name" /></label>
        <label>Last name<input required name="lastName" placeholder="Last name" /></label>
      </div>
      <div className="field-grid">
        <label>Email<input required type="email" name="email" placeholder="you@email.com" /></label>
        <label>Phone<input required type="tel" name="phone" placeholder="04xx xxx xxx" /></label>
      </div>
      <div className="field-grid">
        <label>Postcode<input required name="postcode" inputMode="numeric" placeholder="3000" /></label>
        <label>I’m interested in
          <select name="interest" defaultValue="">
            <option value="" disabled>Select a service</option>
            <option>Residential solar</option><option>Commercial solar</option>
            <option>Solar + battery</option><option>Battery upgrade</option>
          </select>
        </label>
      </div>
      {!compact && <label>Anything else?<textarea name="message" rows={4} placeholder="Tell us about your property or current energy use." /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary form-submit" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Request my free quote"} <span>↗</span>
      </button>
      <small>Your details will only be used to respond to this enquiry.</small>
    </form>
  );
}
