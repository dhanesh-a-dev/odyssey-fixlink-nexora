"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProviderProfileType, ReviewType } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReviewModal } from "@/components/providers/ReviewModal";
import { ContactSellerModal } from "@/components/marketplace/ContactSellerModal";
import { BookingRequestModal } from "@/components/providers/BookingRequestModal";
import { ReportModal } from "@/components/marketplace/ReportModal";
import {
  MapPin,
  Briefcase,
  Calendar,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  Star,
  Flag,
  CheckCircle,
  Clock,
  Images,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [provider, setProvider] = useState<ProviderProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState<any>(null);

  // Auto-open contact modal if directed from "Hire" action
  useEffect(() => {
    if (searchParams.get("action") === "contact") {
      setContactModalOpen(true);
    }
  }, [searchParams]);

  const fetchProvider = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/providers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProvider(data.provider);
        setSaved(data.provider?.isSaved || false);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!provider) return;

    setSaving(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "PROVIDER", id: provider.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="animate-pulse space-y-4">
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto" />
          <div className="h-6 w-48 bg-slate-200 rounded mx-auto" />
          <div className="h-4 w-32 bg-slate-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Provider Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The provider profile may have been removed or does not exist.</p>
        <Button className="mt-4" onClick={() => router.push("/providers")}>
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        {/* Cover Banner */}
        <div className="h-40 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={saving}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-sm ${
                saved
                  ? "bg-white text-emerald-600 font-bold"
                  : "bg-white/80 text-slate-700 hover:bg-white"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-600" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="p-2.5 rounded-2xl bg-white/80 text-slate-700 hover:bg-white backdrop-blur-md transition-all shadow-sm"
              title="Report Profile"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="relative inline-block">
                <img
                  src={
                    provider.user?.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop"
                  }
                  alt={provider.user?.name}
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
                />
                <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white" title="Verified Provider">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {provider.user?.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Pro
                  </span>
                </div>
                <p className="text-base font-bold text-emerald-600">
                  {provider.profession}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {provider.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {provider.experienceYears} Years Experience
                  </span>
                  <span className="flex items-center gap-1 font-medium text-emerald-600">
                    <Clock className="w-4 h-4" />
                    {provider.availability}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="md"
                onClick={() => setReviewModalOpen(true)}
                icon={<Star className="w-4 h-4 text-amber-500" />}
              >
                Review
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setBookingModalOpen(true)}
                icon={<Calendar className="w-4 h-4 text-emerald-600" />}
              >
                Book Service
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setContactModalOpen(true)}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Hire / Message
              </Button>
            </div>
          </div>

          {/* Rating Summary Banner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-slate-900">
                {provider.averageRating || "5.0"}
              </div>
              <div>
                <StarRating
                  rating={provider.averageRating || 5}
                  showNumber={false}
                  size="md"
                />
                <p className="text-xs text-slate-500 mt-0.5">
                  Based on <strong>{provider.reviewCount || 0}</strong> neighborhood reviews
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              100% Verified Community Feedback
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About & Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About & Craftsmanship</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {provider.bio || "No biography provided yet."}
            </p>
          </section>

          {/* Skills Badges */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Core Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills?.map((skill, index) => (
                <Badge key={index} variant="emerald" size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Portfolio Showcase Grid */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Images className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">Verified Work Portfolio</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {provider.portfolio?.length || 0} Projects Showcase
              </span>
            </div>

            {provider.portfolio && provider.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPortfolioImage(item)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No portfolio items uploaded yet.</p>
            )}
          </section>
        </div>

        {/* Right Column: Reviews & Credentials */}
        <div className="space-y-8">
          {/* Quick Contact Box */}
          <div className="bg-emerald-50 rounded-3xl border border-emerald-200/80 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Need work done?</h3>
            <p className="text-xs text-slate-600">
              Message {provider.user?.name} directly to request estimates, verify availability, or schedule a visit.
            </p>
            <Button
              className="w-full"
              onClick={() => setContactModalOpen(true)}
            >
              Start Conversation
            </Button>
          </div>

          {/* Customer Reviews Section */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Customer Reviews</h3>
                <span className="text-xs text-slate-500">
                  {provider.reviews?.length || 0} community ratings
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                + Review
              </button>
            </div>

            {provider.reviews && provider.reviews.length > 0 ? (
              <div className="space-y-5">
                {provider.reviews.map((rev) => (
                  <div key={rev.id} className="space-y-2 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.reviewer?.avatarUrl && (
                          <img
                            src={rev.reviewer.avatarUrl}
                            alt={rev.reviewer.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="text-xs font-bold text-slate-900">
                          {rev.reviewer?.name || "Verified Customer"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <StarRating rating={rev.rating} showNumber={false} size="sm" />

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-4">
                No reviews yet. Be the first neighbor to review {provider.user?.name}!
              </p>
            )}
          </section>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        providerId={provider.userId}
        providerName={provider.user?.name || provider.profession}
        onReviewSubmitted={fetchProvider}
      />

      {/* Contact Modal */}
      <ContactSellerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        sellerId={provider.userId}
        sellerName={provider.user?.name || provider.profession}
      />

      {/* Booking Request Modal */}
      <BookingRequestModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        providerId={provider.userId}
        providerName={provider.user?.name || provider.profession}
        defaultProfession={provider.profession}
        defaultLocation={provider.location}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="USER"
        targetId={provider.userId}
        targetTitle={`Provider: ${provider.user?.name} (${provider.profession})`}
      />
    </div>
  );
}
