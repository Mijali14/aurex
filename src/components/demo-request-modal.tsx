"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { DemoRequestValidationError, submitDemoRequest } from "@/lib/demo-request";
import { Icon } from "./icon";

export function DemoRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
    if (status === "error") errorMessage.current?.focus();
  }, [status]);

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const data = new FormData(event.currentTarget);
    setStatus("submitting");
    setError("");
    try {
      await submitDemoRequest({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        company: String(data.get("company") ?? ""),
        website: String(data.get("website") ?? ""),
        message: String(data.get("message") ?? ""),
      }, String(data.get("company_website") ?? ""));
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof DemoRequestValidationError ? cause.message : "We couldn’t send your request right now. Please try again.");
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  function keepFocusInDialog(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), a[href], [tabindex="0"]'));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog ref={dialog} className="request-dialog" aria-labelledby="request-title" onCancel={onClose} onKeyDown={keepFocusInDialog} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dialog-content">
        <button type="button" className="icon-button close-dialog" aria-label="Close demo request" onClick={onClose}><Icon name="close" /></button>
        {status === "success" ? (
          <div className="success-content" role="status">
            <span className="success-mark"><Icon name="check" /></span>
            <p className="eyebrow">LET’S START A CONVERSATION</p>
            <h2 id="request-title" ref={successHeading} tabIndex={-1}>You’re on the list.</h2>
            <p>Thanks — your AUREX demo request has been received. We’ll be in touch soon.</p>
            <button type="button" className="button button-primary" onClick={onClose}>Back to AUREX <Icon name="arrow" /></button>
          </div>
        ) : (
          <>
            <p className="eyebrow">MEET YOUR NEXT SALES AGENT</p>
            <h2 id="request-title">See what AUREX<br />can do for your business.</h2>
            <p className="dialog-description">Tell us a little about your team.</p>
            <form onSubmit={handleSubmit} aria-busy={status === "submitting"}>
              <div hidden aria-hidden="true" inert><input name="company_website" tabIndex={-1} autoComplete="off" /></div>
              <div className="form-grid">
                <label>Name<input name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={120} pattern=".*\S.*" /></label>
                <label>Work email<input name="email" type="email" autoComplete="email" placeholder="alex@company.com" required maxLength={254} /></label>
                <label className="full-width">Company name<input name="company" autoComplete="organization" placeholder="Your company" required maxLength={160} pattern=".*\S.*" /></label>
                <label className="full-width">Website URL <span>(optional)</span><input name="website" type="url" autoComplete="url" placeholder="https://yourcompany.com" maxLength={2048} /></label>
                <label className="full-width">What do you want AUREX to help with? <span>(optional)</span><textarea name="message" rows={3} placeholder="Tell us what a better sales conversation would look like." maxLength={1000} /></label>
              </div>
              {status === "error" && <p ref={errorMessage} tabIndex={-1} className="form-error" role="alert">{error}</p>}
              <p className="form-disclosure" id="demo-disclosure">AUREX will use the information you provide to respond to your demo request.</p>
              <span className="sr-only" role="status">{status === "submitting" ? "Sending your demo request." : ""}</span>
              <button className="button button-primary submit-button" type="submit" disabled={status === "submitting"} aria-describedby="demo-disclosure">{status === "submitting" ? "Sending…" : "Request Demo"}<Icon name="arrow" /></button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
