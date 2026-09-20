"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProviderProfileType, ProductType } from "@/types";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bookmark, Wrench, ShoppingBag } from "lucide-react";

export default function SavedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"providers" | "products">("providers");
  const [providers, setProviders] = useState<ProviderProfileType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
        setProducts(data.products || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchSaved();
    }
  }, [user]);

  if (authLoading || (loading && !providers.length && !products.length)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading saved items...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
          Bookmarks & Favorites
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Saved Items
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quickly access saved service providers and bookmarked marketplace items.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("providers")}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "providers"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Saved Providers ({providers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Saved Listings ({products.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "providers" ? (
        providers.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No saved providers yet"
            description="When you find a reliable electrician, plumber, or artisan you like, bookmark them for fast access."
            actionLabel="Discover Professionals"
            actionHref="/providers"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        )
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No saved marketplace listings"
          description="Bookmark items you are interested in buying to easily compare or message sellers later."
          actionLabel="Explore Marketplace"
          actionHref="/marketplace"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
