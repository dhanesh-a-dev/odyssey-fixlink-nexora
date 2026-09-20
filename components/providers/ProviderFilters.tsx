"use client";

import React from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

interface ProviderFiltersProps {
  profession: string;
  onProfessionChange: (val: string) => void;
  location: string;
  onLocationChange: (val: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  minRating: number;
  onMinRatingChange: (val: number) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
}

const PROFESSIONS = [
  "All",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Mechanic",
  "AC Technician",
  "Appliance Technician",
  "Cleaner",
];

export function ProviderFilters({
  profession,
  onProfessionChange,
  location,
  onLocationChange,
  search,
  onSearchChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
}: ProviderFiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm mb-8 space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PROFESSIONS.map((p) => {
          const isSelected =
            profession.toLowerCase() === p.toLowerCase() ||
            (p === "All" && (!profession || profession === "All"));
          return (
            <button
              key={p}
              type="button"
              onClick={() => onProfessionChange(p === "All" ? "" : p)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, skill, or service..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Location Input */}
        <div className="md:col-span-3 relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="City or locality..."
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Min Rating Filter */}
        <div className="md:col-span-2">
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value={0}>Any Rating</option>
            <option value={4.5}>4.5★ & Above</option>
            <option value={4.0}>4.0★ & Above</option>
            <option value={3.5}>3.5★ & Above</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="relevance">Sort: Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>
      </div>
    </div>
  );
}
