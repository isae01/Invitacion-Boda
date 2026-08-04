import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import { useAdminMusic } from "./AdminLayout";
import { apiGet, ApiError } from "../lib/api";
import DashboardStats from "./DashboardStats";
import GuestTable from "./GuestTable";
import PhotoGallery from "./PhotoGallery";
import type { DashboardStats as DashboardStatsData } from "./types";
import { COUPLE } from "../data/couple";

function AdminPanel() {
  const { authenticated, loading, logout } = useAdminAuth();
  const { muted, toggleMuted } = useAdminMusic();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !authenticated) navigate("/admin/login", { replace: true });
  }, [loading, authenticated, navigate]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await apiGet<DashboardStatsData>("/api/admin/dashboard"));
    } catch (err) {
      setStatsError(
        err instanceof ApiError
          ? err.message
          : "No se pudo cargar el dashboard.",
      );
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadStats();
  }, [authenticated, loadStats]);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  if (loading || !authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface text-ink-secondary">
        Cargando…
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface">
      {/* La pareja como marco decorativo a los lados — misma ilustración, espejada,
          visible en todos los tamaños (más chica en mobile, no hay margen para más). */}
      <img
        src="/images/novios.PNG"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-72 h-48 w-48 -rotate-6 opacity-20 sm:-left-10 sm:h-56 sm:w-56 lg:-left-12 lg:h-72 lg:w-72"
      />
      <img
        src="/images/novios.PNG"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-72 h-48 w-48 rotate-6 opacity-20 -scale-x-100 sm:-right-10 sm:h-56 sm:w-56 lg:-right-12 lg:h-72 lg:w-72"
      />

      {/* Mismo patrón que el Footer de la invitación: foto + velo azul + nombre en serif cursiva. */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <img
          src="/images/IMG_9304.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
        <div className="absolute inset-0 bg-accent-deep/65" />

        <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
          <p className="font-serif text-4xl italic sm:text-5xl">
            ¡Bienvenidos!
          </p>
          <p className="mt-2 font-serif text-xl italic text-white/90">
            {COUPLE.bride} &amp; {COUPLE.groom}
          </p>
          <p className="mt-2 text-[11px] tracking-[2px]">
            23 · 24.10.2026 · PANEL DE ADMINISTRACIÓN
          </p>
        </div>

        <div className="absolute right-6 top-6 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMuted}
            className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
          >
            {muted ? "Activar música" : "Silenciar música"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
        <PhotoGallery />

        <section>
          <h2 className="font-serif text-2xl italic text-ink">
            Resumen de confirmaciones
          </h2>
          {statsError && (
            <p className="mt-2 text-sm text-red-600">{statsError}</p>
          )}
          {stats && (
            <div className="mt-4">
              <DashboardStats stats={stats} />
            </div>
          )}
        </section>

        <section>
          <h2 className="font-serif text-2xl italic text-ink">
            Lista de invitados
          </h2>
          <div className="mt-4">
            <GuestTable onChange={loadStats} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminPanel;
