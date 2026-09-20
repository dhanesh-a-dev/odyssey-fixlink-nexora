import React from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Car,
  Fan,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  MessagesSquare,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { getProviders } from "@/lib/services/providerService";
import { getProducts } from "@/lib/services/productService";

export const revalidate = 0; // Fresh on each request

export default async function HomePage() {
  const [providersData, productsData] = await Promise.all([
    getProviders({ limit: 4, sortBy: "rating" }),
    getProducts({ limit: 4, sortBy: "newest" }),
  ]);

  const categories = [
    {
      name: "Electrician",
      icon: Zap,
      desc: "Wiring, EV chargers, panels & lighting",
      color: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    },
    {
      name: "Plumber",
      icon: Droplets,
      desc: "Leaks, repiping, heaters & drainage",
      color: "bg-sky-500/10 text-sky-600 ring-sky-500/20",
    },
    {
      name: "Carpenter",
      icon: Hammer,
      desc: "Custom built-ins, cabinetry & decks",
      color: "bg-orange-500/10 text-orange-600 ring-orange-500/20",
    },
    {
      name: "Painter",
      icon: Paintbrush,
      desc: "Interior, exterior & wood finishings",
      color: "bg-purple-500/10 text-purple-600 ring-purple-500/20",
    },
    {
      name: "Mechanic",
      icon: Car,
      desc: "Driveway brakes, tune-ups & diagnostics",
      color: "bg-red-500/10 text-red-600 ring-red-500/20",
    },
    {
      name: "AC Technician",
      icon: Fan,
      desc: "Cooling diagnostics, heat pumps & filters",
      color: "bg-teal-500/10 text-teal-600 ring-teal-500/20",
    },
    {
      name: "Cleaner",
      icon: Sparkles,
      desc: "Deep cleaning, carpet steam & turnovers",
      color: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    },
    {
      name: "All Services",
      icon: Wrench,
      desc: "Explore all skilled local tradespeople",
      color: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/20",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6 ring-1 ring-emerald-600/20 shadow-xs">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            Hyperlocal Community Network
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.12]">
            Find trusted people. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
              Hire locally.
            </span>{" "}
            Trade nearby.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover skilled professionals, connect with people around you, and buy or sell things locally. Free direct messaging and zero middleman markups.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/providers">
              <Button size="lg" className="w-full sm:w-auto shadow-md shadow-emerald-600/20">
                Find a Professional
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/80 backdrop-blur-sm">
                Explore Marketplace
              </Button>
            </Link>
          </div>

          {/* Direct Search Card */}
          <div className="mt-12 max-w-2xl mx-auto bg-white rounded-3xl p-3 shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <form action="/providers" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Need an electrician, plumber, furniture, tools...?"
                  className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
              <Button type="submit" size="md" className="w-full sm:w-auto px-6">
                Search
              </Button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Portfolios</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Neighborhood Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No Middleman Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
              Skilled Trades
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Service Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Connect with vetted local specialists ready to tackle your home projects.
            </p>
          </div>
          <Link href="/providers">
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const targetHref =
              cat.name === "All Services"
                ? "/providers"
                : `/providers?profession=${encodeURIComponent(cat.name)}`;
            return (
              <Link
                key={cat.name}
                href={targetHref}
                className="group bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ring-1 ${cat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Browse specialists</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Professionals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
              Top Rated
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Local Professionals
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-reviewed tradespeople with demonstrated portfolios in your area.
            </p>
          </div>
          <Link href="/providers">
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>Explore All Providers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providersData.providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      {/* Marketplace Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
              Second-Hand Market
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Recently Listed Nearby
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Quality pre-owned phones, electronics, tools, and furniture from neighbors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sell">
              <Button variant="secondary" size="sm">
                + Sell Something
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Browse All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How FixLink Works */}
      <section className="bg-slate-900 text-white py-20 rounded-[40px] max-w-7xl mx-auto px-6 sm:px-12 my-12 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2 block">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How FixLink Works
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
            Eliminating middleman gatekeepers so neighbors can connect, hire, and trade directly with full peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/70 space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Find</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover verified people and pre-owned products around you. Filter by profession, distance, rating, or condition with zero paywalls.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/70 space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-extrabold text-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-white">Connect</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Talk directly with service providers and sellers through database-backed instant messaging. Discuss timelines, quotes, and inspect photos.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/60 p-8 rounded-3xl border border-slate-700/70 space-y-4 hover:border-emerald-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-extrabold text-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Get it done</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hire professionals or complete your local purchase safely. Leave an honest verified review to foster genuine community trust.
            </p>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-14 pt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Create Free Account
            </Button>
          </Link>
          <Link href="/become-provider">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-slate-800">
              List Your Services
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
