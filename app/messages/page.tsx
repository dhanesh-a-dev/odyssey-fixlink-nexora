"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConversationType, MessageType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Clock,
  User,
} from "lucide-react";

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(
    searchParams.get("id") || null
  );
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);

        // Default to first conversation if none selected
        if (!activeConvId && data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch {
      // silent
    } finally {
      setLoadingConvs(false);
    }
  }, [user, activeConvId]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(
    async (isBackground = false) => {
      if (!activeConvId || !user) return;
      if (!isBackground) setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${activeConvId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          if (!isBackground) {
            setTimeout(scrollToBottom, 50);
          }
        }
      } catch {
        // silent
      } finally {
        if (!isBackground) setLoadingMessages(false);
      }
    },
    [activeConvId, user]
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(false);
    }
  }, [activeConvId, fetchMessages]);

  // Polling interval for real-time feel (every 3.5 seconds)
  useEffect(() => {
    if (!activeConvId) return;
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeConvId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || sending) return;

    const content = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await fetch(`/api/messages/${activeConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setTimeout(scrollToBottom, 50);
        fetchConversations();
      }
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherParticipant = activeConv?.participants.find(
    (p) => p.userId !== user?.id
  )?.user;

  if (authLoading || (loadingConvs && !conversations.length)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden flex h-[78vh] min-h-[550px]">
        {/* Left: Conversations Sidebar */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col bg-slate-50/50 ${
            activeConvId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h2 className="text-lg font-bold text-slate-900">Direct Messages</h2>
            <p className="text-xs text-slate-400">Database-backed neighborhood conversations</p>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active conversations yet. Visit a provider profile or marketplace listing to start a chat!
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.participants.find(
                  (p) => p.userId !== user?.id
                )?.user;
                const isSelected = conv.id === activeConvId;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-50/80 border-l-4 border-emerald-600"
                        : "hover:bg-slate-100/70"
                    }`}
                  >
                    <img
                      src={
                        other?.avatarUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                      }
                      alt={other?.name || "User"}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {other?.name || "Neighbor"}
                        </h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>

                    {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            !activeConvId ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConvId && otherParticipant ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={
                      otherParticipant.avatarUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                    }
                    alt={otherParticipant.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {otherParticipant.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {otherParticipant.location || "Local community"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                {loadingMessages ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Loading conversation history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Say hello! Send your first message below.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isMine ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? "bg-emerald-600 text-white rounded-tr-none shadow-xs"
                              : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMine && (
                            <span>
                              {msg.readAt ? (
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-slate-200/80 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
                <Button
                  type="submit"
                  size="md"
                  disabled={!inputText.trim()}
                  loading={sending}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-3">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700">Select a Conversation</h3>
              <p className="text-xs max-w-xs text-slate-400 mt-1">
                Choose a chat from the left or contact a professional or seller directly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading messaging center...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
