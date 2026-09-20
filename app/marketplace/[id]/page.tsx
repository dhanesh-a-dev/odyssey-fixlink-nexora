"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ContactSellerModal } from "@/components/marketplace/ContactSellerModal";
import { ReportModal } from "@/components/marketplace/ReportModal";
import {
  MapPin,
  Calendar,
  Bookmark,
  MessageSquare,
  Flag,
  Share2,
  Tag,
  ShieldCheck,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketplace/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setSaved(data.product?.isSaved || false);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!product) return;

    setSaving(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "PRODUCT", id: product.id }),
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
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="animate-pulse space-y-4">
          <div className="h-80 w-full max-w-xl bg-slate-200 rounded-3xl mx-auto" />
          <div className="h-6 w-64 bg-slate-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">This listing may have been marked as sold or removed.</p>
        <Button className="mt-4" onClick={() => router.push("/marketplace")}>
          Back to Marketplace
        </Button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImageIndex]?.imageUrl || "/placeholder.jpg";

  const conditionVariants: Record<string, "emerald" | "indigo" | "amber" | "slate"> = {
    NEW: "emerald",
    LIKE_NEW: "indigo",
    GOOD: "slate",
    FAIR: "amber",
  };

  const isOwner = user?.id === product.sellerId;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb back */}
      <div className="mb-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Marketplace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] rounded-3xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-xs">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {product.status === "SOLD" && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-600 text-white font-black text-2xl tracking-widest uppercase px-6 py-2 rounded-2xl shadow-xl">
                  SOLD
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-emerald-600 ring-2 ring-emerald-500/20"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Item Description */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Listed on {new Date(product.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Pickup in {product.location}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Seller Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={conditionVariants[product.condition] || "slate"} size="md">
                  {product.condition}
                </Badge>
                <Badge variant="slate" size="md">
                  {product.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleSave}
                  disabled={saving}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    saved
                      ? "bg-emerald-50 border-emerald-300 text-emerald-600"
                      : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600"
                  }`}
                  title={saved ? "Saved" : "Save item"}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-600" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="p-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 transition-all"
                  title="Report Listing"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>
              <div className="mt-3 text-3xl sm:text-4xl font-black text-slate-900">
                ${product.price.toLocaleString()}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {isOwner ? (
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Manage Listing in Dashboard
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={product.status === "SOLD"}
                  onClick={() => setContactModalOpen(true)}
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  {product.status === "SOLD" ? "Item Sold" : "Message Seller"}
                </Button>
              )}
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seller Information
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Neighbor
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={
                  product.seller?.avatarUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                }
                alt={product.seller?.name || "Seller"}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {product.seller?.name || "Neighbor Seller"}
                </h4>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-500 leading-relaxed">
              No online payments or shipping required. FixLink facilitates local in-person pickup with zero platform commissions.
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {product.seller && (
        <ContactSellerModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          sellerId={product.sellerId}
          sellerName={product.seller.name}
          itemTitle={product.title}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="PRODUCT"
        targetId={product.id}
        targetTitle={`Listing: ${product.title}`}
      />
    </div>
  );
}
