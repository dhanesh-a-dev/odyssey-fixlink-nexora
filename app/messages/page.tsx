"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConversationType, MessageType } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  User,
  Plus,
  Search,
  MapPin,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface ContactUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  location: string;
  role: string;
  profession: string;
  rating: number;
  isProvider: boolean;
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const initialConvId = searchParams.get("id");
  const recipientIdParam = searchParams.get("recipientId");
  const itemParam = searchParams.get("item");
  const serviceParam = searchParams.get("service");

  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId || null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // New Chat Modal & Contacts
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Prefill inquiry template if coming from product or service page
  useEffect(() => {
    if (itemParam && !inputText) {
      setInputText(`Hi! I am inquiring about your listing for "${itemParam}". Is it still available?`);
    } else if (serviceParam && !inputText) {
      setInputText(`Hi! I would like to inquire about your ${serviceParam} services. Could you provide an estimate?`);
    }
  }, [itemParam, serviceParam]);

  // Fetch conversations list
  const fetchConversations = useCallback(async (selectFirstIfNone = false) => {
    if (!user) return;
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        const convList: ConversationType[] = data.conversations || [];
        setConversations(convList);

        if (selectFirstIfNone && convList.length > 0 && !activeConvId) {
          setActiveConvId(convList[0].id);
        }
      }
    } catch {
      // silent
    } finally {
      setLoadingConvs(false);
    }
  }, [user, activeConvId]);

  // Handle direct recipientId param from URL (e.g. clicking "Message" on any profile or card)
  useEffect(() => {
    if (!user || !recipientIdParam) return;

    const startDirectConversation = async () => {
      try {
        const res = await fetch("/api/messages/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId: recipientIdParam }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.conversationId) {
            setActiveConvId(data.conversationId);
            await fetchConversations(false);
          }
        }
      } catch {
        // silent
      }
    };

    startDirectConversation();
  }, [user, recipientIdParam, fetchConversations]);

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
    fetchConversations(true);
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(false);
    }
  }, [activeConvId, fetchMessages]);

  // Real-time polling interval (every 2.5 seconds)
  useEffect(() => {
    if (!activeConvId) return;
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeConvId, fetchMessages]);

  // Load contacts for New Chat modal
  const fetchContacts = async () => {
    setContactsLoading(true);
    try {
      const res = await fetch("/api/messages/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch {
      // silent
    } finally {
      setContactsLoading(false);
    }
  };

  const handleOpenNewChatModal = () => {
    setNewChatModalOpen(true);
    fetchContacts();
  };

  const handleSelectContact = async (contactUserId: string) => {
    setNewChatModalOpen(false);
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: contactUserId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveConvId(data.conversationId);
        await fetchConversations(false);
        fetchMessages(false);
      }
    } catch {
      // silent
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const content = (presetText || inputText).trim();
    if (!content || !activeConvId || sending) return;

    if (!presetText) setInputText("");
    setSending(true);

    // Optimistic UI message
    const tempMessage: MessageType = {
      id: `temp-${Date.now()}`,
      conversationId: activeConvId,
      senderId: user?.id || "",
      content,
      createdAt: new Date(),
      readAt: null,
    };
    setMessages((prev) => [...prev, tempMessage]);
    setTimeout(scrollToBottom, 30);

    try {
      const res = await fetch(`/api/messages/${activeConvId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMessage.id ? data.message : m))
        );
        fetchConversations(false);
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

  const filteredContacts = contacts.filter((c) => {
    if (!contactSearch.trim()) return true;
    const q = contactSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.profession.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  const quickReplies = [
    "Hi, is this still available?",
    "Can you provide a service estimate?",
    "Are you available for a booking this week?",
    "What is the best neighborhood pickup location?",
  ];

  if (authLoading || (loadingConvs && !conversations.length)) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-slate-500 font-medium">
        Connecting to FixLink live messaging...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex h-[80vh] min-h-[580px]">
        {/* Left: Conversations Sidebar */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white ${
            activeConvId ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Messages
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-500">Real-time neighbor conversations</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenNewChatModal}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              New Chat
            </Button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            {conversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No conversations yet</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                  Start a chat with a verified service pro or marketplace seller.
                </p>
                <Button size="sm" onClick={handleOpenNewChatModal} icon={<Plus className="w-3.5 h-3.5" />}>
                  Find Neighbors to Chat
                </Button>
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
                    className={`w-full p-4 flex items-start gap-3.5 text-left transition-all ${
                      isSelected
                        ? "bg-emerald-50/70 border-l-4 border-emerald-600"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          other?.avatarUrl ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                        }
                        alt={other?.name || "User"}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {other?.name || "Neighbor"}
                        </h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate font-normal">
                        {conv.lastMessage?.content || "Tap to start conversation"}
                      </p>
                    </div>

                    {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1 shadow-xs">
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
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-600"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <img
                      src={
                        otherParticipant.avatarUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                      }
                      alt={otherParticipant.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {otherParticipant.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{otherParticipant.location || "Local Community"}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">Active Now</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchMessages(false)}
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    title="Refresh chat messages"
                  >
                    <span className="hidden sm:inline">Sync</span>
                  </Button>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-white">
                {loadingMessages ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    Loading conversation history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    Say hello to {otherParticipant.name}! Send your first message below.
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
                          className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                              ? "bg-emerald-600 text-white rounded-tr-none shadow-xs font-medium"
                              : "bg-slate-100 text-slate-900 rounded-tl-none font-normal"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1 font-medium">
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

              {/* Quick Reply Pills */}
              <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Quick:
                </span>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(undefined, qr)}
                    className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 text-xs font-medium transition-colors shadow-2xs"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2.5"
              >
                <input
                  type="text"
                  placeholder={`Message ${otherParticipant.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
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
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Select a Conversation</h3>
              <p className="text-xs max-w-xs text-slate-500 mt-1 leading-relaxed">
                Choose a chat from the sidebar or click &ldquo;New Chat&rdquo; to connect with local service pros and sellers.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenNewChatModal}
                icon={<Plus className="w-3.5 h-3.5" />}
                className="mt-4"
              >
                Start New Chat
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Contacts Modal */}
      <Modal
        isOpen={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        title="Start a New Conversation"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by neighbor name, profession, or city..."
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
            {contactsLoading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading directory...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching professionals or members found.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact.id)}
                  className="p-3 flex items-center justify-between rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        contact.avatarUrl ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                      }
                      alt={contact.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{contact.name}</h4>
                      <p className="text-xs text-emerald-700 font-medium">{contact.profession}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {contact.location}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    Chat
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500 font-medium">Loading messaging center...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
