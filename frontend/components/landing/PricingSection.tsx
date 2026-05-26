"use client";

import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: 99,
    period: "month",
    description: "Perfect for trying out",
    features: [
      "3 AI interview reports",
      "Match score analysis",
      "7-day prep plan",
      "Technical + behavioral Qs",
      "Skill gap identification",
    ],
    Cta: "Start for Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: 299,
    period: "month",
    description: "Best for serious job seekers",
    features: [
      "15 AI interview reports",
      "Match score analysis",
      "7-day prep plan",
      "Technical + behavioral Qs",
      "Skill gap identification",
      "PDF resume download",
      "Priority support",
    ],
    Cta: "Start for Free",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 799,
    period: "month",
    description: "For teams and companies",
    features: [
      "Unlimited reports",
      "Match score analysis",
      "7-day prep plan",
      "Technical + behavioral Qs",
      "Skill gap identification",
      "PDF resume download",
      "Dedicated support",
      "Custom branding",
    ],
    Cta: "Contact Sales",
    highlight: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-28 bg-gray-950 border-t border-white/10" id="pricing">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4 block">
            ✦ Simple Pricing
          </span>
          <h2
            className="text-4xl sm:text-5xl font-normal text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Choose your plan
          </h2>
          <p className="text-base text-gray-400 max-w-md mx-auto">
            Start free. No credit card required. Upgrade anytime.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-medium ${!annual ? "text-white" : "text-gray-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative flex h-6 w-12 items-center rounded-full transition-colors ${
              annual ? "bg-indigo-600" : "bg-gray-700"
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                annual ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-white" : "text-gray-500"}`}>
            Annual
            <span className="ml-2 text-xs text-emerald-400 font-semibold">Save 20%</span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 border transition-all ${
                plan.highlight
                  ? "bg-indigo-950/60 border-indigo-500/50 shadow-xl shadow-indigo-900/30"
                  : "bg-gray-900/60 border-gray-800/80 hover:border-gray-700"
              }`}
            >
              {/* Popular badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm">
                    ✦ Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-white mb-1">{plan.name}</p>
                <p className="text-xs text-gray-500">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-fraunces)" }}>
                    ₹{annual ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-sm text-gray-500 mb-1">/{plan.period}</span>
                </div>
                {annual && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Billed ₹{Math.round(plan.price * 0.8 * 12)} yearly
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg
                      className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-indigo-400" : "text-gray-500"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/signup"
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                }`}
              >
                {plan.Cta}
              </a>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-600 mt-10">
          All plans include a free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
