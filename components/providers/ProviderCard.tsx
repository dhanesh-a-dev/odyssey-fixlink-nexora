"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProviderProfileType } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MapPin, Briefcase, Bookmark, MessageSquare, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProviderCardProps {
  provider: ProviderProfileType;
  onMessageClick?: (targetUserId: string) => void;
}

export function ProviderCard({ provider, onMessageClick }: ProviderCardProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(provider.isSaved || false);
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

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Photo + Info + Bookmark */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={
                  provider.user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
                }
                alt={provider.user?.name || provider.profession}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <Link
                href={`/providers/${provider.id}`}
                className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors block line-clamp-1"
              >
                {provider.user?.name}
              </Link>
              <p className="text-xs font-semibold text-emerald-600 tracking-wide uppercase">
                {provider.profession}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating
                  rating={provider.averageRating || 0}
                  totalReviews={provider.reviewCount}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-xl border transition-all ${
              saved
                ? "bg-emerald-50 border-emerald-300 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            }`}
            title={saved ? "Saved" : "Save provider"}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-600" : ""}`} />
          </button>
        </div>

        {/* Badges: Experience & Location */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {provider.experienceYears}y exp
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {provider.location}
          </span>
        </div>

        {/* Short Bio */}
        {provider.bio && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {provider.bio}
          </p>
        )}

        {/* Skills Chips */}
        {provider.skills && provider.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {provider.skills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="slate" size="sm">
                {skill}
              </Badge>
            ))}
            {provider.skills.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center font-medium">
                +{provider.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center gap-2">
        <Link href={`/providers/${provider.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full justify-between">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </Link>
        {onMessageClick ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onMessageClick(provider.userId)}
            icon={<MessageSquare className="w-3.5 h-3.5" />}
          >
            Hire
          </Button>
        ) : (
          <Link href={`/providers/${provider.id}?action=contact`}>
            <Button
              variant="primary"
              size="sm"
              icon={<MessageSquare className="w-3.5 h-3.5" />}
            >
              Hire
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
