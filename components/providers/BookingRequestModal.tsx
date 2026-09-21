"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { Calendar, DollarSign, MapPin, Wrench, Clock, ShieldCheck } from "lucide-react";

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  defaultProfession?: string;
  defaultLocation?: string;
}

export function BookingRequestModal({
  isOpen,
  onClose,
  providerId,
  providerName,
  defaultProfession = "General Service",
  defaultLocation = "",
}: BookingRequestModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [serviceType, setServiceType] = useState(defaultProfession);
  const [preferredDate, setPreferredDate] = useState("");
  const [location, setLocation] = useState(defaultLocation || user?.location || "");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    if (!preferredDate || !notes.trim()) {
      setError("Please select a preferred date and describe the job needed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          serviceType,
          preferredDate,
          location,
          estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
          notes: notes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit booking request.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        router.push("/messages");
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book Service with ${providerName}`}>
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Booking Request Sent!</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {providerName} has been notified via live messaging. Redirecting to your conversation...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Service & Pro Notice */}
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 font-medium flex items-center justify-between">
            <span>
              Professional: <strong>{providerName}</strong>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-white text-emerald-700 font-bold border border-emerald-200">
              {serviceType}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                required
              />
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Estimated Budget ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 150"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Job Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Service Address / Neighborhood
            </label>
            <input
              type="text"
              placeholder="e.g. 123 Maple St, Sunset District"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              required
            />
          </div>

          {/* Job Notes / Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-slate-400" />
              Description of Work Needed
            </label>
            <textarea
              rows={3}
              placeholder="Describe the problem, number of fixtures, measurements, or special requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="md" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              Send Booking Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
