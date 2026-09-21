import React from "react";
import Link from "next/link";
import { FileText, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — FixLink",
  description: "FixLink Terms of Service governing community platform usage, service provider standards, marketplace rules, and platform commissions.",
};

export default function TermsOfServicePage() {
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
            <FileText className="w-4 h-4" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Effective Date & Last Updated: {lastUpdated}
          </p>
        </div>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to <strong>FixLink</strong> (&quot;FixLink,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our hyperlocal platform, applications, services, and tools that connect local skilled service professionals and community marketplace participants.
          </p>
          <p>
            By creating an account, browsing listings, contacting providers, or posting marketplace items on FixLink, you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">1</span>
            Eligibility & User Accounts
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              You must be at least 18 years of age to register an account or offer commercial services on FixLink. You agree to provide accurate, current, and truthful information during registration.
            </p>
            <p>
              You are responsible for safeguarding your login credentials and for all activities conducted through your account. Notify FixLink immediately if you suspect unauthorized access.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">2</span>
            Platform Business Model & Service Commissions
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-8">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl text-emerald-950 font-medium">
              FixLink operates on a transparent platform commission model. A standard service fee of <strong>5% to 10%</strong> applies to completed service bookings and verified marketplace sales.
            </div>
            <p>
              <strong>Professional Service Bookings:</strong> When a service professional completes a contracted job booked or originated through FixLink, the standard platform commission covers verified review certification, platform maintenance, dispute moderation, and customer support.
            </p>
            <p>
              <strong>Marketplace Sales:</strong> Sellers listing pre-owned goods agree to the standard platform commission applied upon successful completion of transactions conducted via the platform.
            </p>
            <p>
              <strong>No Hidden Charges:</strong> All commission percentages and service fees are transparently displayed before finalizing any formal booking request or transaction agreement.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">3</span>
            Service Provider Standards & Warranties
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              Independent service professionals (electricians, plumbers, mechanics, carpenters, etc.) are independent contractors and not employees or agents of FixLink.
            </p>
            <p>
              Providers warrant that they possess the necessary skills, licenses, permits, and experience required by local law to perform the services they advertise.
            </p>
            <p>
              Providers agree to deliver agreed-upon services in a professional, timely, and safe manner in accordance with industry standards.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">4</span>
            Marketplace Rules & Prohibited Items
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              Sellers must accurately describe item condition (New, Like New, Good, Fair) and disclose any defects or damage.
            </p>
            <p>
              The following are strictly prohibited on FixLink: illegal substances, hazardous materials, weapons, stolen property, counterfeit goods, and regulated medical devices. Listings violating these rules are subject to immediate removal and account suspension.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">5</span>
            Ratings, Reviews, and Anti-Abuse
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-8">
            Reviews must reflect genuine, firsthand experiences. Self-reviews, paid reviews, and retaliatory or defamatory feedback are prohibited and automatically flagged by our anti-abuse filters.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">6</span>
            Limitation of Liability
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-8">
            To the fullest extent permissible by applicable law, FixLink shall not be liable for indirect, incidental, punitive, or consequential damages resulting from transactions, services performed by third-party professionals, or user conduct on or off the platform.
          </p>
        </section>

        <div className="border-t border-slate-100 pt-6 text-xs text-slate-400">
          Questions regarding these Terms? Contact us at: <strong className="text-slate-700">legal@fixlink.local</strong>
        </div>
      </div>
    </div>
  );
}
