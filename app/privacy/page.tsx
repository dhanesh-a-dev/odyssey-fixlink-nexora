import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — FixLink",
  description: "FixLink Privacy Policy covering data collection, cookies, account protection, and user rights.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 21, 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Legal Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Effective Date & Last Updated: {lastUpdated}
          </p>
        </div>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            At <strong>FixLink</strong> (&quot;FixLink,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we are committed to safeguarding the privacy and security of our neighborhood platform members. This Privacy Policy describes how we collect, use, disclose, and protect personal information when you use our website, mobile interface, API services, and associated community features.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">1</span>
            Information We Collect
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              <strong>Account & Profile Data:</strong> When you register, we collect your name, email address, phone number (optional), geographic locality, and encrypted password credentials.
            </p>
            <p>
              <strong>Service Provider Details:</strong> Professionals submit professional skill designations, years of experience, service portfolio imagery, licensing declarations, and availability schedules.
            </p>
            <p>
              <strong>Marketplace Listings:</strong> Information, photographs, pricing, condition details, and geographic pickup locations submitted when posting items for sale.
            </p>
            <p>
              <strong>Communications & Messages:</strong> Message content, inquiry timestamps, and read states exchanged between customers and local service providers.
            </p>
            <p>
              <strong>Location Data:</strong> Neighborhood/locality information and voluntary geographic coordinates used to compute approximate proximity distances between service seekers, providers, and sellers.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">2</span>
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <li>To match neighbors with skilled service providers and local second-hand products.</li>
            <li>To deliver real-time 1-to-1 messaging and inquiry notifications between parties.</li>
            <li>To compute fair platform commissions, process booking verification, and resolve disputes.</li>
            <li>To prevent fraud, fake reviews, duplicate accounts, and spam listings.</li>
            <li>To maintain security, monitor server performance, and optimize user experience.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">3</span>
            Cookies & Session Security
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-8">
            FixLink uses secure, stateless, cryptographically signed JSON Web Tokens (JWT) stored in HTTP-Only, SameSite=Lax cookies. We do not sell your personal data or deploy third-party advertising tracking trackers across your browsing activities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">4</span>
            Data Sharing & Disclosure
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              <strong>Public Profile Visibility:</strong> Your public provider profile, portfolio photos, ratings, and active marketplace listings are publicly discoverable by community members. Your password hash and email address are never exposed publicly.
            </p>
            <p>
              <strong>Legal Compliance:</strong> We may disclose information if required by court order, statutory regulation, or when necessary to protect personal physical safety or investigate platform abuse.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">5</span>
            Your Rights & Account Control
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-8">
            You have the right to access, edit, or delete your account information at any time via your user dashboard. You may request full removal of your profile, listings, and messages by contacting our support team or submitting an account closure request.
          </p>
        </section>

        <div className="border-t border-slate-100 pt-6 text-xs text-slate-400">
          For privacy inquiries or data rights requests, please contact: <strong className="text-slate-700">privacy@fixlink.local</strong>
        </div>
      </div>
    </div>
  );
}
