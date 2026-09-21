"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductType } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Bookmark, Tag, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(product.isSaved || false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/login";
      return;
    }
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

  const conditionVariants: Record<string, "emerald" | "indigo" | "amber" | "slate"> = {
    NEW: "emerald",
    LIKE_NEW: "indigo",
    GOOD: "slate",
    FAIR: "amber",
  };

  const conditionLabels: Record<string, string> = {
    NEW: "Brand New",
    LIKE_NEW: "Like New",
    GOOD: "Good Condition",
    FAIR: "Fair / Functional",
  };

  const mainImage =
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=450&fit=crop";

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Condition Tag */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={conditionVariants[product.condition] || "slate"}
              size="sm"
              className="backdrop-blur-md bg-white/90 shadow-sm"
            >
              {conditionLabels[product.condition] || product.condition}
            </Badge>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saving}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
              saved
                ? "bg-white text-emerald-600"
                : "bg-white/80 text-slate-500 hover:text-slate-900 hover:bg-white"
            }`}
            title={saved ? "Saved" : "Save item"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-600" : ""}`} />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-base font-extrabold shadow-md">
            ${product.price.toLocaleString()}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{product.category}</span>
          </div>

          <Link href={`/marketplace/${product.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1.5">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>
      </div>

      {/* Seller & Location Footer */}
      <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2 min-w-0">
          {product.seller?.avatarUrl && (
            <img
              src={product.seller.avatarUrl}
              alt={product.seller.name}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
          )}
          <span className="font-medium text-slate-700 truncate max-w-[100px]">
            {product.seller?.name || "Local Seller"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[90px]">{product.location}</span>
          </div>

          <Link
            href={`/messages?recipientId=${product.sellerId}&item=${encodeURIComponent(product.title)}`}
            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
            title={`Message ${product.seller?.name || "Seller"}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
