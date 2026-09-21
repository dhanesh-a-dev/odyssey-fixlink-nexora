import React from "react";
import Link from "next/link";
import { RotateCcw, Clock, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy — FixLink",
  description: "FixLink Cancellation & Refund Policy for local service bookings and marketplace transactions.",
};

export default function CancellationRefundPage() {
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
            <RotateCcw className="w-4 h-4" />
            Customer Protection Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Effective Date & Last Updated: {lastUpdated}
          </p>
        </div>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            At <strong>FixLink</strong>, we prioritize fair, transparent, and respectful relationships between community customers and local service providers. This Cancellation and Refund Policy sets forth the terms governing job cancellations, deposits, marketplace return procedures, and dispute resolution.
          </p>
        </section>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">1</span>
            Service Booking Cancellations
          </h2>
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed pl-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Standard Notice (&gt;24 Hours)
                </div>
                <p className="text-xs text-slate-600">
                  Cancellations requested 24 hours or more before the scheduled appointment are eligible for a <strong>100% full refund</strong> of any deposit or advance payment made through FixLink.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wider mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Short Notice (&lt;24 Hours)
                </div>
                <p className="text-xs text-slate-600">
                  Cancellations within 24 hours of scheduled arrival may be subject to a nominal dispatch cancellation fee (up to 20% of deposit) to reimburse the provider for reserved scheduling.
                </p>
              </div>
            </div>

            <p>
              <strong>Provider Cancellations & No-Shows:</strong> If a service professional fails to arrive at the agreed appointment without prior mutually agreed rescheduling, the customer receives an immediate 100% refund, and the provider receives an internal reliability deduction.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">2</span>
            Work Quality & Service Disputes
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              If completed service work does not meet agreed-upon specifications or workmanship standards, the customer must submit a dispute ticket through their dashboard or the FixLink support portal within <strong>48 hours</strong> of completion.
            </p>
            <p>
              FixLink moderation will review messages, photos of the work, and the original quote:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pt-1 text-slate-600">
              <li><strong>Rework:</strong> The provider may be given an opportunity to correct the defect at zero additional cost.</li>
              <li><strong>Partial Refund:</strong> An adjusted price reflecting the delivered scope.</li>
              <li><strong>Full Refund:</strong> If service was fundamentally incomplete or negligently executed.</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">3</span>
            Marketplace Returns & Goods Inspection
          </h2>
          <div className="space-y-2 text-sm text-slate-600 leading-relaxed pl-8">
            <p>
              Second-hand items traded through the FixLink Marketplace are sold <em>as-is</em>, unless otherwise agreed in writing by the seller.
            </p>
            <p>
              <strong>Inspection at Handover:</strong> Buyers must inspect the item in person before completing handover. If the item condition differs materially from the listing photos or description, the buyer has the right to decline purchase without penalty.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center">4</span>
            Refund Processing Timelines
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed pl-8">
            Approved refunds are initiated within <strong>24 to 48 business hours</strong> to the original payment method. Depending on your financial institution, funds typically reflect in your account within 3–7 business days.
          </p>
        </section>

        <div className="border-t border-slate-100 pt-6 text-xs text-slate-400">
          Need assistance with a booking or refund? Contact: <strong className="text-slate-700">support@fixlink.local</strong>
        </div>
      </div>
    </div>
  );
}
