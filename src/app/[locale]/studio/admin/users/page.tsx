"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, CreditCard, Power, PowerOff, Trash2 } from "lucide-react";
import { Toast } from "@/components/studio/Toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  credits: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creditsModal, setCreditsModal] = useState<User | null>(null);
  const [createError, setCreateError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/studio/admin/users");
    if (res.ok) setUsersList(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/studio/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        name: form.get("name"),
        credits: Number(form.get("credits")) || 0,
      }),
    });
    if (res.ok) {
      setShowCreate(false);
      setCreateError("");
      setToast({ message: "Usuario creado", type: "success" });
      fetchUsers();
    } else {
      const data = await res.json().catch(() => ({}));
      setCreateError(data.error || "Error al crear usuario");
    }
  }

  async function handleAddCredits(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!creditsModal) return;
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/studio/admin/users/${creditsModal.id}/credits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(form.get("amount")) }),
    });
    if (res.ok) {
      setCreditsModal(null);
      setToast({ message: "Créditos agregados", type: "success" });
      fetchUsers();
    } else {
      setToast({ message: "Error al agregar créditos", type: "error" });
    }
  }

  async function handleDelete(user: User) {
    if (user.role === "admin") { setToast({ message: "No se puede eliminar un admin", type: "error" }); return; }
    if (!confirm(`¿Eliminar a ${user.name} (${user.email})?`)) return;
    const res = await fetch(`/api/studio/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) { setToast({ message: "Usuario eliminado", type: "success" }); fetchUsers(); }
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
    fetchUsers();
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
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
              <th className="px-4 py-3 text-right font-medium">Creditos</th>
              <th className="px-4 py-3 text-center font-medium">Estado</th>
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
                <td className="px-4 py-3 text-right font-mono">{user.credits}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block h-2 w-2 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setCreditsModal(user)}
                      className="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.04] hover:text-white"
                      title="Agregar creditos"
                    >
                      <CreditCard className="h-4 w-4" />
                    </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md rounded-xl bg-[#1a1a1a] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
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
                <label htmlFor="admin-credits" className="text-sm font-medium">Creditos iniciales</label>
                <input id="admin-credits" name="credits" type="number" defaultValue={10} min={0} className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50" />
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

      {/* Add credits modal */}
      {creditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setCreditsModal(null)}>
          <div className="w-full max-w-sm rounded-xl bg-[#1a1a1a] p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-1 text-lg font-semibold">Agregar creditos</h2>
            <p className="mb-4 text-sm text-white/40">
              {creditsModal.name} — {creditsModal.credits} creditos actuales
            </p>
            <form onSubmit={handleAddCredits} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cantidad</label>
                <input name="amount" type="number" required min={1} defaultValue={10} className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setCreditsModal(null)} className="rounded-lg px-4 py-2 text-sm text-white/40 hover:bg-white/[0.04]">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
