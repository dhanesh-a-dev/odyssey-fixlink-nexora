"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProviderProfileType } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Navigation,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Car,
  Fan,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface ProviderMapViewProps {
  providers: ProviderProfileType[];
}

function getProfessionIcon(profession: string) {
  const p = profession.toLowerCase();
  if (p.includes("elec")) return <Zap className="w-3.5 h-3.5" />;
  if (p.includes("plumb")) return <Droplets className="w-3.5 h-3.5" />;
  if (p.includes("carp")) return <Hammer className="w-3.5 h-3.5" />;
  if (p.includes("paint")) return <Paintbrush className="w-3.5 h-3.5" />;
  if (p.includes("mech")) return <Car className="w-3.5 h-3.5" />;
  if (p.includes("ac") || p.includes("air")) return <Fan className="w-3.5 h-3.5" />;
  return <Sparkles className="w-3.5 h-3.5" />;
}

export function ProviderMapView({ providers }: ProviderMapViewProps) {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfileType | null>(
    providers.length > 0 ? providers[0] : null
  );

  // Normalize lat/lng offsets for visual distribution on map canvas
  const minLat = Math.min(...providers.map((p) => p.latitude || 37.75));
  const maxLat = Math.max(...providers.map((p) => p.latitude || 37.79));
  const minLng = Math.min(...providers.map((p) => p.longitude || -122.45));
  const maxLng = Math.max(...providers.map((p) => p.longitude || -122.39));

  const latRange = maxLat - minLat || 0.05;
  const lngRange = maxLng - minLng || 0.05;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm overflow-hidden">
      {/* Map Interactive Canvas */}
      <div className="lg:col-span-8 relative min-h-[440px] sm:min-h-[520px] rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/20 border border-slate-200 overflow-hidden shadow-inner">
        {/* Subtle Map Grid Lines */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "28px 28px, 56px 56px, 56px 56px",
          }}
        />

        {/* Neighborhood Overlay Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            Live Neighborhood Service Area
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-600/10 text-emerald-700 text-[11px] font-semibold border border-emerald-600/20">
            {providers.length} Verified Pros Nearby
          </span>
        </div>

        {/* Map Center Marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center opacity-30">
          <div className="w-28 h-28 rounded-full border-2 border-dashed border-emerald-500/60 animate-spin-slow" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
            Community Center
          </span>
        </div>

        {/* Provider Interactive Pins */}
        <div className="absolute inset-10 sm:inset-14">
          {providers.map((p, index) => {
            const isSelected = selectedProvider?.id === p.id;
            // Deterministic pseudo position within container
            const lat = p.latitude || 37.75 + (index % 5) * 0.01;
            const lng = p.longitude || -122.45 + ((index * 3) % 5) * 0.01;

            const topPercent = Math.max(
              8,
              Math.min(88, 85 - ((lat - minLat) / latRange) * 75)
            );
            const leftPercent = Math.max(
              8,
              Math.min(88, 12 + ((lng - minLng) / lngRange) * 75)
            );

            return (
              <div
                key={p.id}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProvider(p)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-all transform hover:scale-110 active:scale-95 ${
                    isSelected
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-400/40 z-30 scale-105"
                      : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-white text-emerald-600" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {getProfessionIcon(p.profession)}
                  </span>
                  <span className="hidden sm:inline line-clamp-1 max-w-[110px]">
                    {p.user?.name ? p.user.name.split(" ")[0] : p.profession}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    ★{p.averageRating || "5.0"}
                  </span>
                </button>

                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl bg-slate-900 text-white text-[11px] shadow-xl z-40">
                  <p className="font-bold text-white line-clamp-1">{p.user?.name}</p>
                  <p className="text-emerald-400 text-[10px]">{p.profession}</p>
                  <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {p.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Selected Pro
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Active Nearby
            </span>
          </div>
          <span>Click any pin to inspect professional & chat</span>
        </div>
      </div>

      {/* Selected Provider Card / Sidebar */}
      <div className="lg:col-span-4 flex flex-col justify-between">
        {selectedProvider ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={
                    selectedProvider.user?.avatarUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
                  }
                  alt={selectedProvider.user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {selectedProvider.user?.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                    {selectedProvider.profession}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <StarRating
                      rating={selectedProvider.averageRating || 0}
                      totalReviews={selectedProvider.reviewCount}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-xs mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedProvider.location}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {selectedProvider.experienceYears}y experience
                </span>
              </div>

              {/* Bio */}
              {selectedProvider.bio && (
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {selectedProvider.bio}
                </p>
              )}

              {/* Skills */}
              {selectedProvider.skills && selectedProvider.skills.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Verified Skills
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProvider.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-600/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => router.push(`/messages?recipientId=${selectedProvider.userId}`)}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Message & Hire Now
              </Button>

              <Link href={`/providers/${selectedProvider.id}`} className="block">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  <span>View Full Profile & Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            Select a pin on the map to inspect provider profile.
          </div>
        )}
      </div>
    </div>
  );
}
