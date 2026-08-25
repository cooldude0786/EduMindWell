"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminUser = { id: string; name: string | null; email: string; isActive: boolean; createdAt: string };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const load = async () => { const response = await fetch("/api/users"); if (response.ok) setUsers(await response.json()); };
  useEffect(() => { load(); }, []);
  const create = async (event: React.FormEvent) => { event.preventDefault(); const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) }); const data = await response.json(); if (!response.ok) return alert(data.error); setName(""); setEmail(""); setPassword(""); load(); };
  const toggle = async (user: AdminUser) => { await fetch("/api/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, isActive: !user.isActive }) }); load(); };
  const remove = async (user: AdminUser) => { if (confirm(`Delete ${user.email}?`)) { await fetch(`/api/users?id=${user.id}`, { method: "DELETE" }); load(); } };
  return <main className="max-w-4xl space-y-6"><div><h1 className="text-3xl font-bold">Admin Users</h1><p className="text-sm text-slate-500">Manage users with the single administrator role.</p></div><form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-5 md:grid-cols-4"><Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><Input required minLength={8} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><Button type="submit">Create user</Button></form><div className="space-y-3">{users.map((user) => <div key={user.id} className="flex items-center justify-between rounded-xl border bg-white p-4"><div><p className="font-medium">{user.name || user.email}</p><p className="text-sm text-slate-500">{user.email} · {user.isActive ? "Active" : "Suspended"}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => toggle(user)}>{user.isActive ? "Suspend" : "Activate"}</Button><Button variant="outline" className="text-red-600" onClick={() => remove(user)}>Delete</Button></div></div>)}</div></main>;
}
