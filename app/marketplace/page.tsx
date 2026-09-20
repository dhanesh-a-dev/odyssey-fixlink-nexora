"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductType } from "@/types";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, PlusCircle } from "lucide-react";

function MarketplaceContent() {
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "ALL");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  const [products, setProducts] = useState<ProductType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (condition && condition !== "ALL") params.set("condition", condition);
      if (search) params.set("search", search);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (location) params.set("location", location);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/marketplace?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [category, condition, search, minPrice, maxPrice, location, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleClearFilters = () => {
    setCategory("");
    setCondition("ALL");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setSortBy("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Hyperlocal Trading
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Second-Hand Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Buy and sell phones, laptops, tools, furniture, and appliances with neighbors nearby.
          </p>
        </div>

        <Link href="/sell">
          <Button size="md" icon={<PlusCircle className="w-4 h-4" />}>
            List an Item for Sale
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <MarketplaceFilters
        category={category}
        onCategoryChange={setCategory}
        condition={condition}
        onConditionChange={setCondition}
        search={search}
        onSearchChange={setSearch}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        location={location}
        onLocationChange={setLocation}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-medium">
        <span>
          Showing <strong>{products.length}</strong> of <strong>{total}</strong> available items
        </span>
        {(category || condition !== "ALL" || search || minPrice || maxPrice || location) && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description="We couldn't find any products matching your current search criteria. Try removing some filters or list the first item in your neighborhood!"
          actionLabel="Post an Item for Sale"
          actionHref="/sell"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
