"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProviderProfileType } from "@/types";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ProviderFilters } from "@/components/providers/ProviderFilters";
import { ProviderMapView } from "@/components/providers/ProviderMapView";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wrench, LayoutGrid, Map } from "lucide-react";

function ProvidersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [profession, setProfession] = useState(searchParams.get("profession") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "relevance");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const [providers, setProviders] = useState<ProviderProfileType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (profession && profession !== "All") params.set("profession", profession);
      if (location) params.set("location", location);
      if (search) params.set("search", search);
      if (minRating > 0) params.set("minRating", minRating.toString());
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/providers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setTotal(data.total || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [profession, location, search, minRating, sortBy]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleClearFilters = () => {
    setProfession("");
    setLocation("");
    setSearch("");
    setMinRating(0);
    setSortBy("relevance");
  };

  const handleMessageClick = (targetUserId: string) => {
    router.push(`/messages?recipientId=${targetUserId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Local Skilled Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Discover Local Professionals
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified electricians, plumbers, carpenters, painters, and tradespeople in your neighborhood.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "map"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Neighborhood Map</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <ProviderFilters
        profession={profession}
        onProfessionChange={setProfession}
        location={location}
        onLocationChange={setLocation}
        search={search}
        onSearchChange={setSearch}
        minRating={minRating}
        onMinRatingChange={setMinRating}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{providers.length}</strong> of <strong>{total}</strong> verified professionals
        </span>
        {(profession || location || search || minRating > 0) && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-emerald-600 hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid or Map View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No professionals found near you"
          description="Try broadening your search term, clearing category filters, or removing the minimum rating threshold."
          actionLabel="Reset Search Filters"
          onAction={handleClearFilters}
        />
      ) : viewMode === "map" ? (
        <ProviderMapView providers={providers} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onMessageClick={handleMessageClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading directory...</div>}>
      <ProvidersContent />
    </Suspense>
  );
}
