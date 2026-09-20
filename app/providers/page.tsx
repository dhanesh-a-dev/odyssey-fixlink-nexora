"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProviderProfileType } from "@/types";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ProviderFilters } from "@/components/providers/ProviderFilters";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wrench } from "lucide-react";

function ProvidersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [profession, setProfession] = useState(searchParams.get("profession") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minRating, setMinRating] = useState(Number(searchParams.get("minRating")) || 0);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "relevance");

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
          Local Skilled Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Discover Local Professionals
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse vetted electricians, plumbers, carpenters, painters, and tradespeople in your neighborhood.
        </p>
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

      {/* Grid or Empty State */}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
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
