"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Power, PowerOff, Trash2, ShieldCheck, ShieldOff, FolderCog } from "lucide-react";
import { Toast } from "@/components/studio/Toast";
import { ConfirmDialog } from "@/components/studio/ConfirmDialog";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  canAccessIntel: boolean;
  createdAt: string;
  projects: string[];
}

interface Project {
  slug: string;
  name: string;
  client: string;
  status: string;
}

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createSelectedSlugs, setCreateSelectedSlugs] = useState<string[]>([]);
  const [editAccessUser, setEditAccessUser] = useState<User | null>(null);
  const [editSelectedSlugs, setEditSelectedSlugs] = useState<string[]>([]);
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<User | null>(null);

  const fetchAll = useCallback(async () => {
    const [usersRes, projectsRes] = await Promise.all([
      fetch("/api/studio/admin/users"),
      fetch("/api/studio/talent/admin/projects"),
    ]);
    if (usersRes.ok) setUsersList(await usersRes.json());
    if (projectsRes.ok) setProjectsList(await projectsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const activeProjects = projectsList.filter((p) => p.status === "active");

  function openCreate() {
    setCreateSelectedSlugs([]);
    setCreateError("");
    setShowCreate(true);
  }

  function toggleCreateSlug(slug: string) {
    setCreateSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError("");
    if (createSelectedSlugs.length === 0) {
      setCreateError("Selecciona al menos un proyecto");
      return;
    }
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/studio/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        name: form.get("name"),
        projectSlugs: createSelectedSlugs,
      }),
    });
    if (res.ok) {
      setShowCreate(false);
      setToast({ message: "Usuario creado y asignado", type: "success" });
      fetchAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setCreateError(data.error || "Error al crear usuario");
    }
  }

  function openEditAccess(user: User) {
    setEditAccessUser(user);
    setEditSelectedSlugs(user.projects);
    setEditError("");
  }

  function toggleEditSlug(slug: string) {
    setEditSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function saveEditAccess() {
    if (!editAccessUser) return;
    if (editSelectedSlugs.length === 0) {
      setEditError("El usuario debe tener al menos un proyecto");
      return;
    }
    const res = await fetch(`/api/studio/admin/users/${editAccessUser.id}/access`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectSlugs: editSelectedSlugs }),
    });
    if (res.ok) {
      setEditAccessUser(null);
      setToast({ message: "Acceso actualizado", type: "success" });
      fetchAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setEditError(data.error || "Error al actualizar acceso");
    }
  }

  function handleDelete(user: User) {
    if (user.role === "admin") { setToast({ message: "No se puede eliminar un admin", type: "error" }); return; }
    setDeleteDialog(user);
  }

  async function executeDelete(user: User) {
    setDeleteDialog(null);
    const res = await fetch(`/api/studio/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) { setToast({ message: "Usuario eliminado", type: "success" }); fetchAll(); }
    else setToast({ message: "Error al eliminar", type: "error" });
  }

  async function toggleActive(user: User) {
    const res = await fetch(`/api/studio/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    if (res.ok) {
      setToast({ message: `Usuario ${user.isActive ? "desactivado" : "activado"}`, type: "success" });
    }
    fetchAll();
  }

  async function toggleIntel(user: User) {
    const res = await fetch(`/api/studio/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canAccessIntel: !user.canAccessIntel }),
    });
    if (res.ok) {
      setToast({ message: `Acceso Intel ${user.canAccessIntel ? "revocado" : "habilitado"}`, type: "success" });
    }
    fetchAll();
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-white/40">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-sm text-white/40">{usersList.length} usuarios registrados</p>
        </div>
        <button
          onClick={openCreate}
          disabled={activeProjects.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          title={activeProjects.length === 0 ? "Crea un proyecto activo primero" : undefined}
        >
          <Plus className="h-4 w-4" />
          Crear usuario
        </button>
      </div>

      {/* Users table */}
      <div className="overflow-x-auto rounded-xl border border-[#222]">
        <table className="w-full text-sm">
          <thead className="border-b border-[#222] bg-white/[0.04]">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Rol</th>
              <th className="px-4 py-3 text-left font-medium">Proyectos</th>
              <th className="px-4 py-3 text-center font-medium">Estado</th>
              <th className="px-4 py-3 text-center font-medium">Intel</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {usersList.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-white/40">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-900/30 text-purple-400"
                      : "bg-blue-900/30 text-blue-400"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.role === "admin" ? (
                    <span className="text-xs text-white/30">—</span>
                  ) : user.projects.length === 0 ? (
                    <span className="text-xs italic text-white/30">Sin acceso</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.projects.map((slug) => (
                        <span key={slug} className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/60">
                          {slug}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block h-2 w-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleIntel(user)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      user.canAccessIntel
                        ? "text-orange-400 hover:bg-orange-500/10"
                        : "text-white/20 hover:bg-white/[0.04] hover:text-white/60"
                    }`}
                    title={user.canAccessIntel ? "Revocar acceso Intel" : "Dar acceso Intel"}
                  >
                    {user.canAccessIntel ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => openEditAccess(user)}
                        className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.04] hover:text-white"
                        title="Editar acceso a proyectos"
                      >
                        <FolderCog className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user)}
                      className="rounded-lg p-1.5 text-white/40 hover:bg-destructive/10 hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(user)}
                      className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.04] hover:text-white"
                      title={user.isActive ? "Desactivar" : "Activar"}
                    >
                      {user.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create user modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-xl bg-[#1a1a1a] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold">Crear usuario</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {createError && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{createError}</div>
              )}
              <div className="space-y-2">
                <label htmlFor="admin-name" className="text-sm font-medium">Nombre</label>
                <input id="admin-name" name="name" required className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-medium">Email</label>
                <input id="admin-email" name="email" type="email" required className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium">Contraseña</label>
                <input id="admin-password" name="password" type="password" required minLength={8} className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Proyectos asignados <span className="text-white/40">(al menos uno)</span></label>
                <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-[#333] bg-[#0a0a0a] p-2">
                  {activeProjects.map((p) => (
                    <label key={p.slug} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-white/[0.04]">
                      <input
                        type="checkbox"
                        checked={createSelectedSlugs.includes(p.slug)}
                        onChange={() => toggleCreateSlug(p.slug)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-[13px] font-medium text-white/80">{p.name}</span>
                      <span className="font-mono text-[10px] text-white/30">{p.client}</span>
                    </label>
                  ))}
                </div>
                <p className="font-mono text-[10px] text-white/30">
                  {createSelectedSlugs.length} seleccionado{createSelectedSlugs.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-4 py-2 text-sm text-white/40 hover:bg-white/[0.04]">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit access modal */}
      {editAccessUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditAccessUser(null)}>
          <div className="w-full max-w-lg rounded-xl bg-[#1a1a1a] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-lg font-semibold">Editar acceso a proyectos</h2>
            <p className="mb-4 text-sm text-white/40">
              {editAccessUser.name} — {editAccessUser.email}
            </p>
            {editError && (
              <div className="mb-3 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{editError}</div>
            )}
            <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-[#333] bg-[#0a0a0a] p-2">
              {activeProjects.map((p) => (
                <label key={p.slug} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-white/[0.04]">
                  <input
                    type="checkbox"
                    checked={editSelectedSlugs.includes(p.slug)}
                    onChange={() => toggleEditSlug(p.slug)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="text-[13px] font-medium text-white/80">{p.name}</span>
                  <span className="font-mono text-[10px] text-white/30">{p.client}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] text-white/30">
              {editSelectedSlugs.length} proyecto{editSelectedSlugs.length === 1 ? "" : "s"}. Los quitados quedan revocados (no se eliminan).
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setEditAccessUser(null)} className="rounded-lg px-4 py-2 text-sm text-white/40 hover:bg-white/[0.04]">
                Cancelar
              </button>
              <button onClick={saveEditAccess} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <ConfirmDialog
        open={!!deleteDialog}
        message={deleteDialog ? `¿Eliminar a ${deleteDialog.name} (${deleteDialog.email})?` : ""}
        onConfirm={() => { if (deleteDialog) void executeDelete(deleteDialog); }}
        onCancel={() => setDeleteDialog(null)}
        danger
        confirmLabel="Eliminar"
      />
    </div>
  );
}
