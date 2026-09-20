"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  itemTitle?: string;
}

export function ContactSellerModal({
  isOpen,
  onClose,
  sellerId,
  sellerName,
  itemTitle,
}: ContactSellerModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState(
    itemTitle
      ? `Hi ${sellerName}, is "${itemTitle}" still available? I am interested in checking it out.`
      : `Hi ${sellerName}, I would like to inquire about your services.`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    if (!content.trim()) {
      setError("Message content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Get or create conversation
      const convRes = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: sellerId }),
      });

      const convData = await convRes.json();
      if (!convRes.ok) {
        setError(convData.error || "Failed to initiate conversation");
        return;
      }

      const conversationId = convData.conversationId;

      // 2. Send message
      const msgRes = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!msgRes.ok) {
        const msgData = await msgRes.json();
        setError(msgData.error || "Failed to deliver message");
        return;
      }

      onClose();
      router.push(`/messages?id=${conversationId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Message ${sellerName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {itemTitle && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            Inquiring about: <strong className="text-slate-900">{itemTitle}</strong>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Your Message
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            loading={loading}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
}
