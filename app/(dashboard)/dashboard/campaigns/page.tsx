"use client";

import { useEffect, useState, useRef } from "react";

type Campaign = {
    id: string;
    subject: string;
    body: string;
    status: string;
};

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [progressMap, setProgressMap] = useState<Record<string, any>>({});
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
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

        if (subject.trim().length > 200) {
            alert("Subject must be 200 characters or less");
            return;
        }

        if (body.trim().length > 10000) {
            alert("Body must be 10000 characters or less");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/campaigns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ subject, body }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(`Failed to create campaign: ${data.error}`);
            setLoading(false);
            return;
        }

        setSubject("");
        setBody("");
        setLoading(false);

        loadCampaigns();
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
                    placeholder="Subject (max 200 characters)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={200}
                />
                <div className="text-xs text-gray-500">
                    {subject.length} / 200
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

                <button
                    onClick={createCampaign}
                    disabled={loading || !subject.trim() || !body.trim()}
                    className="bg-black text-white px-4 py-2 disabled:bg-gray-400"
                >
                    {loading ? "Creating..." : "Create Campaign"}
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-3">
                {campaigns.length === 0 ? (
                    <p className="text-gray-500">No campaigns yet</p>
                ) : (
                    campaigns.map((c) => {
                        const progress = progressMap[c.id];
                        const canSend = c.status === "PENDING";

                        return (
                            <div key={c.id} className="border p-4 rounded">
                                {/* TOP ROW */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="font-bold">{c.subject}</h2>

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

                                        {/* PROGRESS */}
                                        {progress && (
                                            <div className="text-xs text-gray-600 mt-1">
                                                {progress.sent} / {progress.total} (
                                                {progress.progress}%)
                                            </div>
                                        )}
                                    </div>

                                    {/* SEND BUTTON */}
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