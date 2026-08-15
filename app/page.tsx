"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { Anton, JetBrains_Mono } from "next/font/google";

const headlineFont = Anton({ subsets: ["latin"], weight: "400" });
const monoFont = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"] });

// Brand tokens — sampled directly from the actual logo asset pixels
const COLORS = {
  bg: "#0A0A0A",
  green: "#C1FE72",
  cream: "#FFFFFF",
  muted: "#8A8A85",
  border: "#2A2A2A",
};

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setCount((c) => (c !== null ? c + 1 : c));
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <main
      className={monoFont.className}
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.bg,
        backgroundImage:
          "linear-gradient(#161616 1px, transparent 1px), linear-gradient(90deg, #161616 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        color: COLORS.cream,
      }}
    >
      {/* Header */}
      <header className="flex items-center px-6 sm:px-10 py-6 w-full">
        <div className="flex items-center gap-2">
          <Image src="/conduit-icon.png" alt="Conduit" width={55} height={55} unoptimized />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 sm:px-10 pt-16 pb-20 text-center">
        <h1
          className={headlineFont.className}
          style={{
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: COLORS.green }}>Be first</span>{" "}
          <span style={{ color: COLORS.cream }}>through</span>
          <br />
          <span style={{ color: COLORS.cream }}>the</span>{" "}
          <span style={{ color: COLORS.green }}>conduit.</span>
        </h1>

        <p
          className="mt-8 mx-auto max-w-xl text-sm sm:text-base leading-relaxed"
          style={{ color: COLORS.muted }}
        >
          Settlement infrastructure for businesses. Invoice in the currency
          you keep your books in, and let customers and suppliers pay in
          whatever stablecoin they hold. We&apos;re opening early access soon
          — get on the list.
        </p>

        {/* Waitlist form */}
        <div id="waitlist-form" className="mt-12 max-w-md mx-auto">
          {count !== null && count > 0 && (
            <p
              className="mb-4 flex items-center justify-center gap-2 text-xs"
              style={{ color: COLORS.muted }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: 6, height: 6, backgroundColor: COLORS.green }}
              />
              Join {count.toLocaleString()} people on the waitlist
            </p>
          )}
          {status === "success" ? (
            <div
              className="rounded px-6 py-5 text-sm"
              style={{
                border: `1px solid ${COLORS.green}`,
                backgroundColor: "#101A08",
                color: COLORS.green,
              }}
            >
              You&apos;re on the list. We&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded px-4 py-3 text-sm focus:outline-none"
                style={{
                  backgroundColor: "#141414",
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.cream,
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: COLORS.green, color: COLORS.bg }}
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-xs mt-3" style={{ color: "#F5716E" }}>
              {errorMsg}
            </p>
          )}
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 text-left">
          <Feature title="~1 second" desc="Direct payments settle on Arc almost instantly." />
          <Feature title="Circle StableFX" desc="Cross-currency payments route through Circle's conversion layer." />
          <Feature title="Your currency" desc="Invoice and keep your books in the currency you already use." />
        </div>
      </section>

      <footer
        className="text-center text-xs py-8 px-6"
        style={{ color: COLORS.muted, borderTop: `1px solid ${COLORS.border}` }}
      >
        Conduit — B2B stablecoin settlement.
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      className="rounded p-4"
      style={{ border: `1px solid ${COLORS.border}`, backgroundColor: "#0D0D0D" }}
    >
      <h3
        className="text-sm font-medium mb-1"
        style={{ color: COLORS.green }}
      >
        {title}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: COLORS.muted }}>
        {desc}
      </p>
    </div>
  );
}
