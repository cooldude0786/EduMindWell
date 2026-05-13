"use client";

import { useEffect, useState, useRef } from "react";

type Campaign = {
    id: string;
    title?: string;
    subject: string;
    body: string;
    senderName?: string | null;
    senderEmail?: string | null;
    previewText?: string | null;
    scheduledAt?: string | null;
    isDraft?: boolean;
    status: string;
};

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [progressMap, setProgressMap] = useState<Record<string, any>>({});
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [previewText, setPreviewText] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [isDraft, setIsDraft] = useState(false);
    const [body, setBody] = useState("");
    const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const campaignsRef = useRef<Campaign[]>([]);

    // keep latest campaigns in ref (fix stale closure bug)
    useEffect(() => {
        campaignsRef.current = campaigns;
    }, [campaigns]);

    // -------------------------
    // LOAD CAMPAIGNS
    // -------------------------
    const loadCampaigns = async () => {
        const res = await fetch("/api/campaigns", {
            cache: "no-store",
        });

        const data = await res.json();
        setCampaigns(data);
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    // -------------------------
    // PROGRESS FETCH
    // -------------------------
    const fetchProgress = async (campaignId: string) => {
        const res = await fetch(
            `/api/campaigns/progress?campaignId=${campaignId}`
        );

        const data = await res.json();

        setProgressMap((prev) => ({
            ...prev,
            [campaignId]: data,
        }));
    };

    const resetForm = () => {
        setEditingCampaignId(null);
        setTitle("");
        setSubject("");
        setSenderName("");
        setSenderEmail("");
        setPreviewText("");
        setScheduledAt("");
        setIsDraft(false);
        setBody("");
    };

    const editCampaign = (campaign: Campaign) => {
        setEditingCampaignId(campaign.id);
        setTitle(campaign.title ?? "");
        setSubject(campaign.subject);
        setSenderName(campaign.senderName ?? "");
        setSenderEmail(campaign.senderEmail ?? "");
        setPreviewText(campaign.previewText ?? "");
        setScheduledAt(campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : "");
        setIsDraft(Boolean(campaign.isDraft));
        setBody(campaign.body);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // -------------------------
    // POLLING (SAFE)
    // -------------------------
    useEffect(() => {
        const interval = setInterval(() => {
            const current = campaignsRef.current;

            current.forEach((c) => {
                if (c.status === "PROCESSING") {
                    fetchProgress(c.id);
                }
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // -------------------------
    // CREATE CAMPAIGN
    // -------------------------
    const createCampaign = async () => {
        if (!subject || !body) {
            alert("Subject and body are required");
            return;
        }

        if (title && title.trim().length > 200) {
            alert("Title must be 200 characters or less");
            return;
        }

        if (subject.trim().length > 200) {
            alert("Subject must be 200 characters or less");
            return;
        }

        if (previewText && previewText.trim().length > 160) {
            alert("Preview text must be 160 characters or less");
            return;
        }

        if (body.trim().length > 10000) {
            alert("Body must be 10000 characters or less");
            return;
        }

        setLoading(true);

        const payload: Record<string, unknown> = {
            title: title.trim() || undefined,
            subject: subject.trim(),
            body: body.trim(),
            senderName: senderName.trim() || undefined,
            senderEmail: senderEmail.trim() || undefined,
            previewText: previewText.trim() || undefined,
            scheduledAt: scheduledAt || undefined,
            isDraft,
        };

        const method = editingCampaignId ? "PUT" : "POST";
        if (editingCampaignId) {
            payload.campaignId = editingCampaignId;
        }

        const res = await fetch("/api/campaigns", {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Failed to ${editingCampaignId ? "update" : "create"} campaign: ${data.error}`);
            setLoading(false);
            return;
        }

        resetForm();
        setLoading(false);
        await loadCampaigns();
    };

    // -------------------------
    // SEND CAMPAIGN
    // -------------------------
    const sendCampaign = async (id: string) => {
        const res = await fetch("/api/campaigns/queue", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ campaignId: id }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Failed to queue campaign: ${data.error || "Unknown error"}`);
            return;
        }

        alert("Campaign queued successfully!");

        // refresh UI
        await loadCampaigns();
    };

    const resetCampaignQueue = async (id: string) => {
        const confirmed = window.confirm(
            "Reset this campaign queue? This only clears stuck pending or processing jobs that have not been sent."
        );

        if (!confirmed) {
            return;
        }

        const res = await fetch("/api/campaigns/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ campaignId: id }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Failed to reset queue: ${data.error || "Unknown error"}`);
            return;
        }

        setProgressMap((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });

        alert(`Queue reset successfully. Removed ${data.deleted ?? 0} job(s).`);
        await loadCampaigns();
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">Campaigns</h1>
                <p className="text-sm text-gray-500">
                    Create and send email campaigns
                </p>
            </div>

            {/* CREATE FORM */}
            <div className="border p-4 space-y-3">
                <input
                    className="border p-2 w-full"
                    placeholder="Campaign title (optional, max 200 characters)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                />
                <div className="text-xs text-gray-500">
                    {title.length} / 200
                </div>

                <input
                    className="border p-2 w-full"
                    placeholder="Subject (max 200 characters)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={200}
                />
                <div className="text-xs text-gray-500">
                    {subject.length} / 200
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        className="border p-2 w-full"
                        placeholder="Sender name (optional)"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                    />
                    <input
                        className="border p-2 w-full"
                        placeholder="Sender email (optional)"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        type="email"
                    />
                </div>

                <input
                    className="border p-2 w-full"
                    placeholder="Preview text (optional, max 160 characters)"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    maxLength={160}
                />
                <div className="text-xs text-gray-500">
                    {previewText.length} / 160
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={isDraft}
                            onChange={(e) => setIsDraft(e.target.checked)}
                            className="rounded"
                        />
                        Save as draft
                    </label>
                    <input
                        className="border p-2 w-full"
                        type="datetime-local"
                        placeholder="Schedule at"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                    />
                </div>

                <textarea
                    className="border p-2 w-full"
                    placeholder="Email body (max 10000 characters)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={10000}
                    rows={6}
                />
                <div className="text-xs text-gray-500">
                    {body.length} / 10000
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={createCampaign}
                        disabled={loading || !subject.trim() || !body.trim()}
                        className="bg-black text-white px-4 py-2 disabled:bg-gray-400"
                    >
                        {loading
                            ? editingCampaignId
                                ? "Updating..."
                                : "Creating..."
                            : editingCampaignId
                                ? isDraft
                                    ? "Update Draft"
                                    : "Update Campaign"
                                : isDraft
                                    ? "Create Draft"
                                    : "Create Campaign"}
                    </button>

                    {editingCampaignId ? (
                        <button
                            onClick={resetForm}
                            type="button"
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    ) : null}
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-3">
                {campaigns.length === 0 ? (
                    <p className="text-gray-500">No campaigns yet</p>
                ) : (
                    campaigns.map((c) => {
                        const progress = progressMap[c.id];
                        const canSend = c.status === "PENDING" && !c.isDraft;
                        const canReset = c.status === "PENDING" || c.status === "PROCESSING";
                        const canEdit = c.status === "PENDING";

                        return (
                            <div key={c.id} className="border p-4 rounded">
                                {/* TOP ROW */}
                                <div className="flex justify-between items-center gap-4">
                                    <div>
                                        <h2 className="font-bold">{c.title || c.subject}</h2>

                                        <p className="text-sm text-gray-500">
                                            Subject: {c.subject}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Status:{" "}
                                            <span
                                                className={
                                                    c.status === "SENT"
                                                        ? "text-green-600"
                                                        : c.status === "PROCESSING"
                                                            ? "text-blue-600"
                                                            : "text-yellow-600"
                                                }
                                            >
                                                {c.status}
                                            </span>
                                        </p>

                                        {c.senderName || c.senderEmail ? (
                                            <p className="text-sm text-gray-500">
                                                From:{" "}
                                                {c.senderName ? `${c.senderName} ` : ""}
                                                {c.senderEmail ? `<${c.senderEmail}>` : ""}
                                            </p>
                                        ) : null}

                                        {c.previewText ? (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Preview: {c.previewText}
                                            </p>
                                        ) : null}

                                        {c.scheduledAt ? (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Scheduled: {new Date(c.scheduledAt).toLocaleString()}
                                            </p>
                                        ) : null}

                                        {c.isDraft ? (
                                            <p className="text-sm text-amber-600 mt-1">
                                                Draft mode - not ready to send
                                            </p>
                                        ) : null}

                                        {/* PROGRESS */}
                                        {progress && (
                                            <div className="text-xs text-gray-600 mt-1">
                                                {progress.sent} / {progress.total} (
                                                {progress.progress}%)
                                            </div>
                                        )}
                                    </div>

                                    {/* SEND BUTTON */}
                                    <div className="flex items-center gap-2">
                                        {canEdit ? (
                                            <button
                                                onClick={() => editCampaign(c)}
                                                className="px-4 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>
                                        ) : null}

                                        <button
                                            onClick={() => resetCampaignQueue(c.id)}
                                            disabled={!canReset}
                                            title={
                                                canReset
                                                    ? "Clear stuck pending jobs for this campaign"
                                                    : `Campaign is ${c.status}. Reset not available.`
                                            }
                                            className={`px-4 py-1 rounded border ${
                                                canReset
                                                    ? "border-amber-500 text-amber-700 hover:bg-amber-50"
                                                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            Reset Queue
                                        </button>

                                        <button
                                            onClick={() => sendCampaign(c.id)}
                                            disabled={!canSend}
                                            title={
                                                canSend
                                                    ? "Click to queue this campaign"
                                                    : `Campaign is ${c.status}. Cannot send.`
                                            }
                                            className={`px-4 py-1 text-white rounded ${
                                                canSend
                                                    ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            {c.status === "SENT"
                                                ? "Sent"
                                                : c.status === "PROCESSING"
                                                    ? "Sending..."
                                                    : "Send Now"}
                                        </button>
                                    </div>
                                </div>

                                {/* BODY */}
                                <p className="text-sm text-gray-600 mt-2">
                                    {c.body.slice(0, 120)}...
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
