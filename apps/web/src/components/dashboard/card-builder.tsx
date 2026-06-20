"use client";

// ─────────────────────────────────────────────
// KARD — Card Builder
// FIX: Removed duplicate useToast import
// PHASE 9: Added loading skeletons, error states,
//          form validation feedback, network error
//          handling, empty states
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCreateKard, useUpdateKard } from "@/hooks/use-kard";
import { useToast } from "@/components/ui"; // ✅ single import — was duplicated before
import { Input, Textarea, Button, Badge, Spinner } from "@/components/ui";
import { KardCard } from "@/components/kard/kard-card";
import { cn } from "@/lib/utils";

type CardMode = "minimal" | "professional" | "personal";
type Theme = "dark" | "light";
type PlatformType =
  | "linkedin"
  | "github"
  | "twitter"
  | "instagram"
  | "custom";

interface LinkInput {
  type: PlatformType;
  label: string;
  url: string;
}

interface FormState {
  username: string;
  mode: CardMode;
  theme: Theme;
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  links: LinkInput[];
}

interface CardBuilderProps {
  kard?: any;
  verification?: { level: number } | null;
  isNew?: boolean;
}

const PLATFORMS = [
  {
    type: "linkedin" as PlatformType,
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourname",
  },
  {
    type: "github" as PlatformType,
    label: "GitHub",
    placeholder: "https://github.com/yourname",
  },
  {
    type: "twitter" as PlatformType,
    label: "X / Twitter",
    placeholder: "https://x.com/yourname",
  },
  {
    type: "instagram" as PlatformType,
    label: "Instagram",
    placeholder: "https://instagram.com/yourname",
  },
  {
    type: "custom" as PlatformType,
    label: "Custom link",
    placeholder: "https://yourwebsite.com",
  },
];

const MODES = [
  {
    value: "minimal" as CardMode,
    label: "Minimal",
    desc: "Name + one link",
  },
  {
    value: "professional" as CardMode,
    label: "Professional",
    desc: "Work info + links",
  },
  {
    value: "personal" as CardMode,
    label: "Personal",
    desc: "Full identity",
  },
];

// ── Phase 9: Upload progress states ──────────
type UploadState = "idle" | "uploading" | "success" | "error";

export function CardBuilder({
  kard,
  verification,
  isNew = false,
}: CardBuilderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(
    kard
      ? {
          username: kard.username ?? "",
          mode: (kard.mode?.toLowerCase() ?? "professional") as CardMode,
          theme: (kard.theme?.toLowerCase() ?? "dark") as Theme,
          firstName: kard.firstName ?? "",
          lastName: kard.lastName ?? "",
          headline: kard.headline ?? "",
          bio: kard.bio ?? "",
          company: kard.company ?? "",
          email: kard.email ?? "",
          phone: kard.phone ?? "",
          location: kard.location ?? "",
          links: (kard.links ?? []).map((l: any) => ({
            type: l.type.toLowerCase() as PlatformType,
            label: l.label,
            url: l.url,
          })),
        }
      : {
          username: "",
          mode: "professional",
          theme: "dark",
          firstName: "",
          lastName: "",
          headline: "",
          bio: "",
          company: "",
          email: "",
          phone: "",
          location: "",
          links: [],
        }
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState | "submit", string>>
  >({});
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    kard?.avatarUrl ?? null
  );
  const [tab, setTab] = useState("identity");

  const createMutation = useCreateKard({
    onSuccess: (data: any) => {
      toast("Kard created! 🎉", "success");
      router.push(`/dashboard`);
    },
    onError: (err: any) => {
      // Phase 9: surface tRPC / network errors properly
      const message =
        err?.data?.zodError
          ? "Please fix the highlighted fields"
          : err?.message === "Username already taken"
          ? "That username is taken — try another"
          : err?.message?.includes("Free plan")
          ? "Free plan allows 2 cards max. Upgrade to Pro."
          : "Something went wrong. Please try again.";
      setErrors((e) => ({ ...e, submit: message }));
      toast(message, "error");
    },
  });

  const updateMutation = useUpdateKard({
    onSuccess: () => {
      toast("Changes saved", "success");
    },
    onError: (err: any) => {
      const message = err?.message ?? "Failed to save. Please try again.";
      setErrors((e) => ({ ...e, submit: message }));
      toast(message, "error");
    },
  });

  const set = useCallback(
    <K extends keyof FormState>(key: K, val: FormState[K]) => {
      setForm((f) => ({ ...f, [key]: val }));
      setErrors((e) => ({ ...e, [key]: undefined, submit: undefined }));
    },
    []
  );

  const addLink = () =>
    form.links.length < 10 &&
    setForm((f) => ({
      ...f,
      links: [...f.links, { type: "custom", label: "Link", url: "" }],
    }));

  const updateLink = (i: number, field: keyof LinkInput, value: string) =>
    setForm((f) => {
      const links = [...f.links];
      links[i] = { ...links[i]!, [field]: value };
      if (field === "type") {
        const p = PLATFORMS.find((p) => p.type === value);
        if (p) links[i]!.label = p.label;
      }
      return { ...f, links };
    });

  const removeLink = (i: number) =>
    setForm((f) => ({ ...f, links: f.links.filter((_, idx) => idx !== i) }));

  // ── Phase 9: Better Cloudinary error handling ──
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Photo must be under 5MB", "error");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      toast(
        "Photo upload not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to .env.local",
        "error"
      );
      return;
    }

    setUploadState("uploading");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "kard_avatars");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? "Upload failed");
      }

      const data = await res.json();
      setAvatarUrl(data.secure_url);
      setUploadState("success");
      toast("Photo uploaded", "success");
    } catch (err: any) {
      setUploadState("error");
      toast(err?.message ?? "Photo upload failed. Try again.", "error");
    }
  };

  // ── Phase 9: Validation with clear field errors ──
  const validate = () => {
    const e: typeof errors = {};

    if (!form.username.trim()) {
      e.username = "Username is required";
    } else if (!/^[a-z0-9_-]{3,30}$/.test(form.username)) {
      e.username = "3–30 chars: lowercase letters, numbers, _ and - only";
    }

    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.headline.trim()) e.headline = "Headline is required";

    for (const link of form.links) {
      if (link.url && !/^https?:\/\/.+/.test(link.url)) {
        e.links = "All URLs must start with https://";
        break;
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    setErrors({});
    if (!validate()) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    const payload = { ...form, links: form.links.filter((l) => l.url.trim()) };
    if (isNew || !kard) createMutation.mutate(payload as any);
    else updateMutation.mutate({ kardId: kard.id, ...(payload as any) });
  };

  const previewKard = {
    id: kard?.id ?? "preview",
    username: form.username || "yourname",
    shortCode: kard?.shortCode ?? "KRD-0000",
    theme: form.theme.toUpperCase(),
    firstName: form.firstName || "Your",
    lastName: form.lastName || "Name",
    headline: form.headline || "Your headline",
    bio: form.bio || null,
    avatarUrl,
    company: form.company || null,
    email: form.email || null,
    phone: form.phone || null,
    links: form.links
      .filter((l) => l.url)
      .map((l, i) => ({
        id: `p${i}`,
        type: l.type.toUpperCase(),
        label: l.label,
        url: l.url,
        verified: false,
      })),
  };

  const isSaving = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#0d0d0d] flex-shrink-0">
        <div>
          <h1 className="text-sm font-medium text-white">
            {isNew ? "Create your Kard" : "Edit Kard"}
          </h1>
          {form.username && (
            <p className="text-[11px] text-[#333] mt-0.5">
              kard.io/{form.username}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {kard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/${kard.username}`, "_blank")}
            >
              Preview ↗
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <Spinner size="xs" /> {isNew ? "Creating…" : "Saving…"}
              </span>
            ) : isNew ? (
              "Create Kard"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </div>

      {/* Phase 9: Submit-level error banner */}
      {errors.submit && (
        <div className="mx-6 mt-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
          {errors.submit}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-[#1a1a1a] px-6 bg-[#0d0d0d]">
            {["identity", "links", "mode"].map((s) => (
              <button
                key={s}
                onClick={() => setTab(s)}
                className={cn(
                  "py-3 px-1 mr-5 text-xs font-medium capitalize border-b-2 transition-colors",
                  tab === s
                    ? "border-[#E07020] text-white"
                    : "border-transparent text-[#555] hover:text-[#888]"
                )}
              >
                {s}
                {/* Phase 9: tab error dot */}
                {s === "identity" &&
                  (errors.username ||
                    errors.firstName ||
                    errors.lastName ||
                    errors.headline) && (
                    <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-red-500 inline-block align-middle" />
                  )}
                {s === "links" && errors.links && (
                  <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-red-500 inline-block align-middle" />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {tab === "identity" && (
              <div className="space-y-4">
                {/* Username */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-3">
                  <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium">
                    Username
                  </p>
                  <Input
                    label="Kard URL"
                    value={form.username}
                    onChange={(e) =>
                      set("username", e.target.value.toLowerCase())
                    }
                    placeholder="yourname"
                    prefix="kard.io/"
                    error={errors.username}
                    hint="Lowercase letters, numbers, _ and - only"
                    disabled={!isNew} // can't change username after creation
                  />
                  {!isNew && (
                    <p className="text-[10px] text-[#444]">
                      Username can't be changed after creation
                    </p>
                  )}
                </div>

                {/* Photo upload */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                  <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium mb-3">
                    Photo
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#111] border border-[#1e1e1e] overflow-hidden flex items-center justify-center flex-shrink-0">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#333] text-xl">
                          {form.firstName?.[0] ?? "?"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer">
                        <div
                          className={cn(
                            "text-xs px-3 py-2 rounded-lg border transition-colors inline-flex items-center gap-2",
                            uploadState === "uploading"
                              ? "border-[#2a2a2a] text-[#555] cursor-not-allowed"
                              : "border-[#1e1e1e] text-[#888] hover:border-[#333] hover:text-white"
                          )}
                        >
                          {uploadState === "uploading" ? (
                            <>
                              <Spinner size="xs" /> Uploading…
                            </>
                          ) : uploadState === "success" ? (
                            "✓ Change photo"
                          ) : uploadState === "error" ? (
                            "↺ Retry upload"
                          ) : (
                            "Upload photo"
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={uploadState === "uploading"}
                        />
                      </label>
                      <p className="text-[10px] text-[#444] mt-1">
                        Max 5MB · JPG, PNG, WebP
                      </p>
                      {uploadState === "error" && (
                        <p className="text-[10px] text-red-400 mt-1">
                          Upload failed — check your Cloudinary config
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Identity */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-4">
                  <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium">
                    Identity
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="First name"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      placeholder="Alex"
                      error={errors.firstName}
                    />
                    <Input
                      label="Last name"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      placeholder="Johnson"
                      error={errors.lastName}
                    />
                  </div>
                  <Input
                    label="Headline"
                    value={form.headline}
                    onChange={(e) => set("headline", e.target.value)}
                    placeholder="Product Designer · Freelance"
                    error={errors.headline}
                    hint="Shown below your name"
                  />
                  <Textarea
                    label="Bio (optional)"
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="A short sentence about yourself..."
                    rows={2}
                    maxLength={300}
                  />
                  <Input
                    label="Company (optional)"
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>

                {/* Contact */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium">
                      Contact
                    </p>
                    <Badge variant="warning">Personal mode only</Badge>
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                  <Input
                    label="Phone (optional)"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <Input
                    label="Location (optional)"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Mumbai, India"
                  />
                </div>
              </div>
            )}

            {tab === "links" && (
              <div className="space-y-3">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium">
                      Links ({form.links.length}/10)
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addLink}
                      disabled={form.links.length >= 10}
                    >
                      + Add link
                    </Button>
                  </div>

                  {/* Phase 9: links URL error */}
                  {errors.links && (
                    <p className="text-xs text-red-400 mb-3">{errors.links}</p>
                  )}

                  {/* Phase 9: Empty state for links tab */}
                  {form.links.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-3 text-lg">
                        🔗
                      </div>
                      <p className="text-sm text-[#555] mb-1">No links yet</p>
                      <p className="text-xs text-[#333] mb-4">
                        Add your LinkedIn, GitHub, or any custom URL
                      </p>
                      <Button variant="secondary" size="sm" onClick={addLink}>
                        Add your first link
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {form.links.map((link, i) => (
                        <div
                          key={i}
                          className="bg-[#111] border border-[#1e1e1e] rounded-xl p-3 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <select
                              value={link.type}
                              onChange={(e) =>
                                updateLink(i, "type", e.target.value)
                              }
                              className="flex-1 bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg px-2.5 py-2 text-xs text-[#888] outline-none"
                            >
                              {PLATFORMS.map((p) => (
                                <option key={p.type} value={p.type}>
                                  {p.label}
                                </option>
                              ))}
                            </select>
                            <input
                              value={link.label}
                              onChange={(e) =>
                                updateLink(i, "label", e.target.value)
                              }
                              placeholder="Label"
                              className="flex-1 bg-[#0f0f0f] border border-[#1e1e1e] rounded-lg px-2.5 py-2 text-xs text-white outline-none"
                            />
                            <button
                              onClick={() => removeLink(i)}
                              className="text-[#333] hover:text-red-400 transition-colors px-1"
                            >
                              ✕
                            </button>
                          </div>
                          <input
                            value={link.url}
                            onChange={(e) =>
                              updateLink(i, "url", e.target.value)
                            }
                            placeholder={
                              PLATFORMS.find((p) => p.type === link.type)
                                ?.placeholder ?? "https://"
                            }
                            className={cn(
                              "w-full bg-[#0f0f0f] border rounded-lg px-2.5 py-2 text-xs text-white outline-none",
                              link.url && !/^https?:\/\/.+/.test(link.url)
                                ? "border-red-500/50"
                                : "border-[#1e1e1e]"
                            )}
                          />
                          {link.url && !/^https?:\/\/.+/.test(link.url) && (
                            <p className="text-[10px] text-red-400">
                              Must start with https://
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "mode" && (
              <div className="space-y-4">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                  <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium mb-4">
                    Card mode
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {MODES.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => set("mode", m.value)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all",
                          form.mode === m.value
                            ? "border-[#E07020] bg-[#E07020]/5"
                            : "border-[#1e1e1e] hover:border-[#2a2a2a]"
                        )}
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mb-2",
                            form.mode === m.value
                              ? "bg-[#E07020]"
                              : "bg-[#333]"
                          )}
                        />
                        <p className="text-xs font-medium text-white">
                          {m.label}
                        </p>
                        <p className="text-[10px] text-[#444] mt-0.5">
                          {m.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                  <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium mb-4">
                    Theme
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["dark", "light"] as Theme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => set("theme", t)}
                        className={cn(
                          "p-4 rounded-xl border transition-all flex items-center gap-3",
                          form.theme === t
                            ? "border-[#E07020]"
                            : "border-[#1e1e1e] hover:border-[#2a2a2a]"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg border",
                            t === "dark"
                              ? "bg-[#141414] border-[#333]"
                              : "bg-[#FAF6EF] border-[#ddd]"
                          )}
                        />
                        <div>
                          <p className="text-xs font-medium text-white capitalize">
                            {t}
                          </p>
                          <p className="text-[10px] text-[#444]">
                            {t === "dark" ? "Dark bg" : "Warm off-white"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {kard && (
                  <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
                    <p className="text-[11px] text-[#444] uppercase tracking-widest font-medium mb-3">
                      Share
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-2.5">
                        <span className="text-[11px] text-[#555] font-mono flex-1 truncate">
                          kard.io/{kard.username}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/${kard.username}`
                            );
                            toast("Copied!", "success");
                          }}
                          className="text-[11px] text-[#E07020] font-medium"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="flex items-center gap-2 bg-[#111] border border-[#1e1e1e] rounded-xl px-3 py-2.5">
                        <span className="text-[11px] text-[#555] font-mono flex-1">
                          {kard.shortCode}
                        </span>
                        <a
                          href={`/api/qr/${kard.username}`}
                          download
                          className="text-[11px] text-[#E07020] font-medium"
                        >
                          QR ↓
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className="w-[240px] flex-shrink-0 border-l border-[#1a1a1a] bg-[#0d0d0d] flex flex-col items-center py-6 px-4 gap-4 overflow-y-auto">
          <p className="text-[10px] text-[#333] uppercase tracking-widest font-medium self-start">
            Live preview
          </p>
          <KardCard
            kard={previewKard}
            verification={verification}
            variant="preview"
          />
          {kard && (
            <div className="w-full mt-1">
              <img
                src={`/api/qr/${kard.username}`}
                alt="QR code"
                className="w-full rounded-xl border border-[#1e1e1e]"
                onError={(e) => {
                  // Phase 9: QR load error state
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const placeholder = document.createElement("div");
                    placeholder.className =
                      "w-full aspect-square rounded-xl border border-[#1e1e1e] bg-[#111] flex items-center justify-center";
                    placeholder.innerHTML =
                      '<p class="text-[10px] text-[#444] text-center px-2">QR will appear after saving</p>';
                    parent.appendChild(placeholder);
                  }
                }}
              />
              <p className="text-[10px] text-[#333] text-center mt-2 font-mono">
                {kard.shortCode}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
