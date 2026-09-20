"use client";

import React from "react";
import { Search, MapPin, DollarSign } from "lucide-react";

interface MarketplaceFiltersProps {
  category: string;
  onCategoryChange: (val: string) => void;
  condition: string;
  onConditionChange: (val: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  location: string;
  onLocationChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
}

const CATEGORIES = [
  "All",
  "Phones",
  "Computers",
  "Electronics",
  "Furniture",
  "Appliances",
  "Vehicles",
  "Tools",
  "Books",
  "Gaming",
  "Other",
];

const CONDITIONS = [
  { id: "ALL", label: "Any Condition" },
  { id: "NEW", label: "Brand New" },
  { id: "LIKE_NEW", label: "Like New" },
  { id: "GOOD", label: "Good" },
  { id: "FAIR", label: "Fair" },
];

export function MarketplaceFilters({
  category,
  onCategoryChange,
  condition,
  onConditionChange,
  search,
  onSearchChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  location,
  onLocationChange,
  sortBy,
  onSortByChange,
}: MarketplaceFiltersProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm mb-8 space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((c) => {
          const isSelected =
            category.toLowerCase() === c.toLowerCase() ||
            (c === "All" && (!category || category === "All"));
          return (
            <button
              key={c}
              type="button"
              onClick={() => onCategoryChange(c === "All" ? "" : c)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Main Search and Price / Condition Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items by title or keywords..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Location */}
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

        {/* Condition */}
        <div className="md:col-span-2">
          <select
            value={condition}
            onChange={(e) => onConditionChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            {CONDITIONS.map((cond) => (
              <option key={cond.id} value={cond.id}>
                {cond.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Min/Max */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full pl-6 pr-2 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
          <span className="text-slate-300">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full pl-6 pr-2 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
