"use client";

import React from "react";
import Link from "next/link";
import { Wrench, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="FixLink Logo"
                  className="w-10 h-10 object-contain rounded-xl drop-shadow-xs group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".footer-logo-fallback") as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="footer-logo-fallback w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center text-white font-extrabold text-xl shadow-md"
                >
                  F
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Fix<span className="text-blue-400">Link</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The digital bridge connecting you to trusted local experts instantly.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wide uppercase">
              <MapPin className="w-4 h-4" />
              Hyperlocal • Transparent Pricing • Neighbor-Powered
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              FixLink charges a standard, transparent service & marketplace commission on completed bookings and sales to support neighborhood verification and platform operations.
            </p>
          </div>

          {/* Skilled Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Local Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/providers?profession=Electrician" className="hover:text-emerald-400 transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link href="/providers?profession=Plumber" className="hover:text-emerald-400 transition-colors">
                  Plumbers
                </Link>
              </li>
              <li>
                <Link href="/providers?profession=Carpenter" className="hover:text-emerald-400 transition-colors">
                  Carpenters
                </Link>
              </li>
              <li>
                <Link href="/providers?profession=Painter" className="hover:text-emerald-400 transition-colors">
                  Painters
                </Link>
              </li>
              <li>
                <Link href="/providers?profession=Mechanic" className="hover:text-emerald-400 transition-colors">
                  Mobile Mechanics
                </Link>
              </li>
              <li>
                <Link href="/providers?profession=Cleaner" className="hover:text-emerald-400 transition-colors">
                  Home Cleaners
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/marketplace?category=Phones" className="hover:text-emerald-400 transition-colors">
                  Phones & Smart Devices
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Computers" className="hover:text-emerald-400 transition-colors">
                  Laptops & Computers
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Furniture" className="hover:text-emerald-400 transition-colors">
                  Furniture & Decor
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Tools" className="hover:text-emerald-400 transition-colors">
                  Tools & Hardware
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Appliances" className="hover:text-emerald-400 transition-colors">
                  Home Appliances
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-emerald-400 font-semibold hover:underline">
                  + Sell Your Product
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Portfolios</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>Standard Fair Fees</span>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-emerald-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FixLink. Connect. Hire. Trade. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund" className="hover:text-slate-400 transition-colors">
              Cancellation & Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
