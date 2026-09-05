"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type NavigationSection = "CAREER" | "MINDSET" | "WELLNESS";
type NavigationContent = {
  id: string;
  section: NavigationSection;
  itemKey: string;
  title: string;
  description: string;
  imageUrl: string | null;
  showTitle: boolean;
  showDescription: boolean;
};

const sectionLabels: Record<NavigationSection, string> = { CAREER: "Career", MINDSET: "Mindset", WELLNESS: "Wellness" };

export default function NavigationContentAdmin() {
  const [items, setItems] = useState<NavigationContent[]>([]);
  const [activeSection, setActiveSection] = useState<NavigationSection>("CAREER");
  const [activeItemKey, setActiveItemKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sectionItems = useMemo(() => items.filter((item) => item.section === activeSection), [activeSection, items]);
  const activeItem = sectionItems.find((item) => item.itemKey === activeItemKey) ?? sectionItems[0];
  useEffect(() => {
    fetch("/api/navigation-content")
      .then(async (response) => {
        const data: unknown = await response.json();
        if (!response.ok) {
          const errorMessage = typeof data === "object" && data !== null && "error" in data
            ? String(data.error)
            : "Failed to load navigation content";
          throw new Error(errorMessage);
        }
        if (!Array.isArray(data)) {
          throw new Error("Navigation content response was invalid");
        }
        return data as NavigationContent[];
      })
      .then((data) => {
        setItems(data);
        setActiveItemKey(data.find((item) => item.section === "CAREER")?.itemKey ?? "");
      })
      .catch((error: unknown) => {
        setMessage(error instanceof Error ? error.message : "Failed to load navigation content");
      });
  }, []);

  useEffect(() => {
    if (sectionItems.length > 0 && !sectionItems.some((item) => item.itemKey === activeItemKey)) {
      setActiveItemKey(sectionItems[0].itemKey);
    }
  }, [activeItemKey, sectionItems]);

  const updateActive = (field: keyof NavigationContent, value: string | boolean) => {
    if (!activeItem) return;
    setItems((current) => current.map((item) => item.id === activeItem.id ? { ...item, [field]: value } : item));
  };

  const save = async () => {
    if (!activeItem) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/navigation-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeItem),
      });
      if (!response.ok) throw new Error("Failed to save content");
      setMessage(`${activeItem.title} content saved`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file: File) => {
    if (!activeItem) return;
    const formData = new FormData();
    formData.append("section", activeItem.section);
    formData.append("itemKey", activeItem.itemKey);
    formData.append("file", file);
    setUploading(true);
    const response = await fetch("/api/navigation-content", { method: "POST", body: formData });
    if (!response.ok) {
      setUploading(false);
      throw new Error("Failed to upload image");
    }
    const updated = await response.json() as NavigationContent;
    setItems((current) => current.map((item) => item.id === activeItem.id ? updated : item));
    setUploading(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Website content</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Nav Content</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Choose a section and submenu item to edit its image, title, and description.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(Object.keys(sectionLabels) as NavigationSection[]).map((section) => (
          <button key={section} type="button" onClick={() => setActiveSection(section)} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeSection === section ? "border-primary text-primary" : "border-transparent text-slate-500"}`}>
            {sectionLabels[section]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1 rounded-xl border border-slate-200 bg-white p-2" aria-label={`${sectionLabels[activeSection]} submenu items`}>
          {sectionItems.map((item) => (
            <button key={item.itemKey} type="button" onClick={() => setActiveItemKey(item.itemKey)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${activeItem?.itemKey === item.itemKey ? "bg-primary/10 font-semibold text-primary" : "text-slate-600"}`}>
              {item.title}
            </button>
          ))}
        </nav>

        {activeItem && (
          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{sectionLabels[activeSection]} submenu</p><h2 className="mt-1 text-xl font-semibold text-slate-950">{activeItem.title}</h2></div>
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="space-y-3">
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-slate-100">{activeItem.imageUrl && <img src={activeItem.imageUrl} alt="" className="h-full w-full object-cover" />}</div>
                <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"><Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload image"}<input type="file" accept="image/*" disabled={uploading} className="hidden" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0]).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Failed to upload image"))} /></label>
              </div>
              <div className="space-y-4">
                <div className="space-y-2"><Label htmlFor="nav-title">Title</Label><Input id="nav-title" value={activeItem.title} onChange={(event) => updateActive("title", event.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="nav-description">Description</Label><Textarea id="nav-description" value={activeItem.description} onChange={(event) => updateActive("description", event.target.value)} /></div>
                <div className="flex flex-wrap gap-5 text-sm text-slate-600"><label className="flex items-center gap-2"><input type="checkbox" checked={activeItem.showTitle} onChange={(event) => updateActive("showTitle", event.target.checked)} /> Show title</label><label className="flex items-center gap-2"><input type="checkbox" checked={activeItem.showDescription} onChange={(event) => updateActive("showDescription", event.target.checked)} /> Show description</label></div>
                <Button type="button" disabled={saving} onClick={save}><Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save"}</Button>
              </div>
            </div>
          </section>
        )}
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}