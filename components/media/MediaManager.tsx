"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Copy, Check, Pencil, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  title: string | null;
  altText: string | null;
  description: string | null;
  type: "IMAGE" | "VIDEO";
  bucket: string;
  path: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  section: string;
  mediaGroup: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

interface MediaManagerProps {
  section: "GALLERY" | "WELLNESS" | "WORKSHOPS" | "HERO";
  mediaGroup?: "ASSESSMENT" | "COUNSELLING" | "WELLNESS" | "WORKSHOPS" | "HERO";
  title: string;
  description: string;
}

export function MediaManager({ section, mediaGroup, title, description }: MediaManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("0");
  const [savingEdit, setSavingEdit] = useState(false);

  // Form states
  const [files, setFiles] = useState<File[]>([]);
  const [assetTitle, setAssetTitle] = useState("");
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/media?section=${section}&all=true`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json();
      setAssets(data);
    } catch (err: any) {
      toast.error(err.message || "Could not load assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [section]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const invalid = selected.find((item) => item.size > 50 * 1024 * 1024 || (!item.type.startsWith("image/") && !item.type.startsWith("video/")));
    if (invalid) {
      toast.error(`${invalid.name} must be an image/video smaller than 50MB`);
      setFiles([]);
      e.target.value = "";
      return;
    }
    setFiles(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("section", section);
        if (mediaGroup) formData.append("mediaGroup", mediaGroup);
        formData.append("title", assetTitle);
        formData.append("altText", altText);
        const res = await fetch("/api/media/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(`${file.name}: ${data.error || "Failed to upload file"}`);
      }

      toast.success(`${files.length} file${files.length === 1 ? "" : "s"} uploaded successfully!`);
      setFiles([]);
      setAssetTitle("");
      setAltText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this media asset?")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete asset");
      }

      toast.success("Media deleted successfully!");
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !currentStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update asset");
      }

      toast.success(`Media ${!currentStatus ? "published" : "hidden"} successfully!`);
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEditing = (asset: MediaAsset) => {
    setEditingId(asset.id);
    setEditTitle(asset.title || "");
    setEditAltText(asset.altText || "");
    setEditSortOrder(String(asset.sortOrder ?? 0));
  };

  const cancelEditing = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    setSavingEdit(true);
    try {
      const res = await fetch("/api/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle.trim() || null, altText: editAltText.trim() || null, sortOrder: Number(editSortOrder) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save media details");
      toast.success("Media details saved");
      cancelEditing();
      await fetchAssets();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save media details");
    } finally {
      setSavingEdit(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500 text-sm mt-1">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Form Card */}
        <Card className="lg:col-span-1 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Upload Media</CardTitle>
            <CardDescription>Supported formats: Images (.jpeg, .png) and Videos (.mp4)</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="media-file">Choose File</Label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition cursor-pointer relative">
                  <input
                    id="media-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center space-y-1">
                    <Upload className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-sm font-medium text-slate-700">
                      {files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected` : "Drag & drop or browse"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {files.length ? `${formatSize(files.reduce((total, item) => total + item.size, 0))} total` : "Max 50MB each"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-title">Title (Optional)</Label>
                <Input
                  id="media-title"
                  placeholder="e.g. Classroom Session"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-alt">Alt Text (Optional)</Label>
                <Input
                  id="media-alt"
                  placeholder="Describe the image/video"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {files.map((selectedFile) => (
                    <div key={`${selectedFile.name}-${selectedFile.lastModified}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {selectedFile.type.startsWith("image/") ? (
                        <img src={URL.createObjectURL(selectedFile)} alt={selectedFile.name} className="h-20 w-full object-cover" />
                      ) : (
                        <video src={URL.createObjectURL(selectedFile)} muted className="h-20 w-full object-cover" />
                      )}
                      <p className="truncate px-1 py-1 text-[10px] text-slate-600">{selectedFile.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" disabled={uploading || files.length === 0} className="w-full bg-primary hover:bg-primary/90 text-white">
                {uploading ? "Uploading..." : "Upload to Supabase"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Assets Grid */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Media Library ({assets.length})</CardTitle>
            <CardDescription>Manage and configure files displayed in this section</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading assets...</div>
            ) : assets.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400">
                No media assets found in this section. Upload files to get started.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {assets.map((asset) => (
                  <div key={asset.id} className="group relative flex flex-col border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow transition-shadow">
                    
                    {/* Media Preview Box */}
                    <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {asset.type === "IMAGE" ? (
                        <img
                          src={asset.publicUrl}
                          alt={asset.altText || asset.title || "Image"}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <video
                          src={asset.publicUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <Badge className={`${asset.type === "IMAGE" ? "bg-blue-600" : "bg-purple-600"} text-white hover:none`}>
                          {asset.type}
                        </Badge>
                        <Badge className={`${asset.isPublished ? "bg-green-600 text-white" : "bg-amber-600 text-white"} hover:none`}>
                          {asset.isPublished ? "Published" : "Hidden"}
                        </Badge>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      {editingId === asset.id ? (
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                          <Label>Alt text</Label>
                          <Input value={editAltText} onChange={(event) => setEditAltText(event.target.value)} />
                          <Label>Display order</Label>
                          <Input type="number" min="0" value={editSortOrder} onChange={(event) => setEditSortOrder(event.target.value)} />
                        </div>
                      ) : <div>
                        <h4 className="font-semibold text-slate-950 truncate">
                          {asset.title || "Untitled Asset"}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Size: {formatSize(asset.sizeBytes)} • {new Date(asset.createdAt).toLocaleDateString()}
                        </p>
                      </div>}

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        {editingId === asset.id ? (
                          <>
                            <Button type="button" size="sm" className="h-8 flex-1 text-xs" disabled={savingEdit} onClick={() => saveEdit(asset.id)}>
                              {savingEdit ? "Saving..." : "Save"}
                            </Button>
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={savingEdit} onClick={cancelEditing} title="Cancel">
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-slate-600 hover:text-slate-950" title="Edit Details" onClick={() => startEditing(asset)}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-slate-600 hover:text-slate-950"
                          title="Copy Link"
                          onClick={() => handleCopyLink(asset.publicUrl, asset.id)}
                        >
                          {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-8 flex-1 text-xs ${asset.isPublished ? "text-amber-600 hover:text-amber-800" : "text-green-600 hover:text-green-800"}`}
                          onClick={() => handleTogglePublish(asset.id, asset.isPublished)}
                        >
                          {asset.isPublished ? "Hide" : "Publish"}
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Delete Asset"
                          onClick={() => handleDelete(asset.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
